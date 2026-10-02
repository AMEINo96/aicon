import os
import urllib.parse
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import pathlib

from google import genai
from google.genai import types
from pydantic import TypeAdapter

from api.schemas import (
    PatientIntake, PlanResponse, Meal, NutritionTargets,
    WeatherInfo, DailyTotals, ValidationInfo, DayPlan, MealPlan
)
from api.nutrition_math import get_nutritional_targets
from api.weather_api import get_7_day_forecast
from api.meal_validator import validate_meals, structure_day_plans
from api.catalog_planner import build_catalog_plan

env_path = pathlib.Path('.') / '.env.local'
load_dotenv(dotenv_path=env_path)
load_dotenv()

app = FastAPI(title="ClimaDiet API", description="AI Clinical Nutrition API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REGIONAL_FOOD_GUIDANCE = {
    "pakistan": {
        "preferred": "everyday Pakistani home foods such as roti/chapati made with atta, basmati rice, moong/masoor/chana dal, chana, eggs, chicken, seasonal sabzi (palak, bhindi, lauki, tori, gobi), dahi/raita, and locally common fruit",
        "avoid": ["quinoa", "cauliflower rice", "riced cauliflower", "thepla", "kale", "couscous", "avocado", "chia seeds"],
    },
    "india": {
        "preferred": "everyday foods common in the selected Indian region: atta roti, rice, locally common dals, eggs, chicken or fish where appropriate, seasonal sabzi, curd, and local fruit",
        "avoid": ["quinoa", "cauliflower rice", "riced cauliflower", "kale", "couscous", "avocado", "chia seeds"],
    },
    "bangladesh": {
        "preferred": "everyday Bangladeshi foods such as rice, masoor/moong dal, seasonal vegetables, eggs, locally common fish or chicken, and local fruit",
        "avoid": ["quinoa", "cauliflower rice", "riced cauliflower", "kale", "couscous", "avocado", "chia seeds"],
    },
}

def get_regional_food_guidance(country: str) -> dict:
    return REGIONAL_FOOD_GUIDANCE.get(country.strip().lower(), {
        "preferred": f"simple, affordable foods commonly sold in markets in {country}",
        "avoid": [],
    })

@app.post("/api/generate-plan", response_model=PlanResponse)
@app.post("/generate-plan", response_model=PlanResponse)
def generate_meal_plan(patient: PatientIntake):
    # 1. Deterministic Math Engine
    t = get_nutritional_targets(patient)
    
    # Setup constraints
    constraints = []
    if patient.allergies: constraints.extend(patient.allergies)
    if patient.dietary_restrictions: constraints.extend(patient.dietary_restrictions)
    if patient.conditions: constraints.extend(patient.conditions)
    constraints.append(f"Goal: {patient.goal} {patient.goal_amount}")
    
    targets = NutritionTargets(
        bmi=t["bmi"],
        bmi_category=t["bmi_category"],
        bmr=t["bmr"],
        tdee=t["baseline_tdee"],
        target_calories=t["target_calories"],
        protein_g=t["protein_g"],
        carbs_g=t["carbs_g"],
        fat_g=t["fat_g"],
        constraints_applied=constraints
    )
    
    # 2. Get Weather
    try:
        weather_data = get_7_day_forecast(patient.city, patient.country, patient.start_date)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    weather_info = WeatherInfo(
        location=weather_data["location"],
        forecast=weather_data["forecast"]
    )

    if patient.planner_mode == "catalog":
        if patient.country.strip().lower() != "pakistan":
            raise HTTPException(status_code=422, detail="The local catalog currently supports Pakistan only.")
        try:
            meals, planner_messages = build_catalog_plan(
                targets,
                patient.dietary_restrictions,
                patient.allergies,
                weather_info.forecast,
            )
        except ValueError as e:
            raise HTTPException(status_code=422, detail=str(e))

        is_valid, validation_msgs = validate_meals(
            meals, targets, patient.allergies + patient.dietary_restrictions
        )
        if not is_valid:
            details = "; ".join(validation_msgs[:5])
            raise HTTPException(status_code=422, detail=f"Catalog plan validation failed: {details}")
        for meal in meals:
            image_prompt = f"Authentic home-cooked {meal.name}. Pakistani home-style food photography, recognizable ingredients, simple tableware, no text, one dish."
            meal.image = (
                "https://image.pollinations.ai/prompt/"
                f"{urllib.parse.quote(image_prompt, safe='')}?width=800&height=600&model=flux&nologo=true"
            )
        meal_plan = MealPlan(
            days=structure_day_plans(meals, weather_info.forecast),
            overall_validation=ValidationInfo(
                valid=True,
                messages=planner_messages + [
                    "Meals selected from the Pakistan starter catalog",
                    "Nutrition values are approximate ingredient-based estimates",
                ],
            ),
        )
        return PlanResponse(patient=patient, nutrition=targets, weather=weather_info, meal_plan=meal_plan)

    # Existing AI-provider path remains the default. Load keys dynamically so
    # environment changes do not require reconstructing a module-level client.
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is missing. Please add it to your .env.local file or Vercel Environment Variables.")

    client = genai.Client(
        api_key=GEMINI_API_KEY,
        http_options=types.HttpOptions(
            timeout=10,
            retry_options=types.HttpRetryOptions(attempts=1),
        ),
    )
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    regional_foods = get_regional_food_guidance(patient.country)
    
    weather_str = "\\n".join([f"Day {i+1} ({w['time']}): High {w['temperature_max']}C" for i, w in enumerate(weather_info.forecast)])

    # 3. Base Prompt
    past_meals_str = ', '.join(patient.past_meals) if patient.past_meals else 'None'
    base_prompt = f"""
    You are an expert clinical nutritionist. 
    Create a complete 1-DAY meal plan for a patient with the following profile.
    This is DAY {patient.plan_day_number} of their meal plan journey.
    
    - Age: {patient.age}, Gender: {patient.gender}, Ethnicity/Culture: {patient.ethnicity}
    - Primary Goal: {patient.goal} ({patient.goal_amount})
    - Conditions: {', '.join(patient.conditions) if patient.conditions else 'None'}
    - Allergies: {', '.join(patient.allergies) if patient.allergies else 'None'}
    - VARIETY RULE: Do not repeat the exact same daily menu. You may reuse staple items (like eggs, protein shakes, or rice), but ensure the main dishes offer variety compared to previous days.
    - CULINARY REALISM & SIMPLICITY: Use standard, globally or locally recognized real-world dish names that already exist on the internet (e.g., 'Daal Chawal', 'Chicken Karahi', 'Palak Paneer', 'Grilled Chicken Salad'). Do NOT invent your own dishes or combine random items like 'fish with apple and daal'. Keep meals EXTREMELY SIMPLE, maximum 2-3 components per meal, and culturally accurate. Never mix fruits into hot savory meals.
    - NAMING RULE: The 'name' field MUST be 1-4 words maximum of just the CORE dish (e.g. 'Chicken Karahi' or 'Daal Chawal'). Do NOT include the side dishes or rice in the 'name' field. Never add words like 'Grilled' to traditional curries.
    - PORTION SIZES & MACRO MATH: You MUST include exact portion sizes (e.g. '200g chicken breast', '150g basmati rice', '2 whole boiled eggs') in the 'ingredients' array. The macros you generate MUST perfectly match these realistic portion sizes.
    - MACRO DISTRIBUTION: If the daily calorie target is over 1800 or protein is over 100g, YOU MUST generate 4 meals (Breakfast, Lunch, Dinner, Snack) to prevent absurdly large portion sizes. DO NOT force the user to eat 400g of fish in one sitting. Distribute the macros by adding a 4th meal (slot: 'Snack') such as a Protein Shake or Greek Yogurt. If targets are lower, generate exactly 3 meals (Breakfast, Lunch, Dinner).
    - Dietary Restrictions: {', '.join(patient.dietary_restrictions) if patient.dietary_restrictions else 'None'}
    - PREVIOUSLY EATEN MEALS (For context): {past_meals_str}
    
    Location: {weather_info.location}
    Weather Forecast:
    {weather_str}
    
    CRITICAL INSTRUCTIONS:
    1. EXACTLY 3 MEALS PER DAY: You MUST provide exactly 'Breakfast', 'Lunch', and 'Dinner' for 3 days (3 meals total). Do NOT include snacks!
    2. TARGETS: The math engine calculated:
       - Target Calories: {targets.target_calories} kcal
       - Target Protein: {targets.protein_g}g
       - Target Carbs: {targets.carbs_g}g
       - Target Fats: {targets.fat_g}g
       Do NOT invent your own targets.
    Ensure the sum of the 3 meals EACH DAY roughly aligns with these daily targets.
    3. INGREDIENTS & SAFETY: You MUST populate the `ingredients` array for each meal. Be completely exhaustive so the validator can check for allergies. ZERO cross-contamination.
    4. CULTURAL & CLIMATE MATCH: Recommend meals suited to `{patient.ethnicity}` cuisine and the provided local weather forecast.
    5. LOCAL AVAILABILITY: Prioritize these familiar, everyday foods for {patient.country}: {regional_foods['preferred']}. Avoid imported, niche, or substitute ingredients. Do not use these uncommon items unless the patient explicitly asks for them: {', '.join(regional_foods['avoid']) or 'none listed'}.
    6. Provide an `image_keyword` (a single word like 'biryani').
    """

    # 4. Generate & Validate (Retry Loop)
    MAX_ATTEMPTS = 3
    ta = TypeAdapter(list[Meal])
    schema_dict = ta.json_schema()
    
    meals = []
    is_valid = False
    validation_msgs = []
    
    current_prompt = base_prompt
    
    import json
    import requests
    import time
    
    # Compact schema description for fallback providers (saves ~3000 tokens vs full JSON schema)
    compact_schema = """Return only a JSON array of 3 or 4 meal objects. Each object must have these fields: {"id":"day1-breakfast","day":"Day 1","slot":"Breakfast","name":"Dish Name","ingredients":["200g chicken breast","150g basmati rice"],"image_keyword":"keyword","emoji":"🥣","calories":500,"protein":30,"carbs":60,"fat":15,"why":"Why it fits the weather and profile","benefits":["Benefit one","Benefit two"]}. Use days Day 1 and slots Breakfast, Lunch, Dinner exactly once, and YOU MUST include a 4th meal (slot: "Snack") if the total daily protein target is over 100g or calories over 1800 to keep portions realistic. No markdown."""
    
    def call_ai_agent(prompt: str) -> str:
        """Tries multiple free-tier AI providers sequentially to avoid 429 quota limits."""
        # 1. Primary: Groq (GPT-OSS 120B â€” 8000 TPM limit, keep it tight)
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key:
            try:
                print("Trying Groq (gpt-oss-120b)...")
                res = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"},
                    json={
                        "model": "openai/gpt-oss-20b",
                        "max_tokens": 3000,
                        "messages": [
                            {"role": "system", "content": f"You are a clinical nutritionist AI. {compact_schema}"},
                            {"role": "user", "content": prompt}
                        ]
                    }, timeout=15
                )
                if res.status_code == 200:
                    text = res.json()["choices"][0]["message"].get("content", "")
                    if text: return text
                    else: raise ValueError("Groq returned empty content (hit reasoning limit)")
                else: print(f"Groq returned {res.status_code}: {res.text[:200]}")
            except Exception as e: print("Groq failed:", e)

        # 2. Fallback: OpenRouter (Gemma 4 31B â€” strong free model)
        or_key = os.getenv("OPENROUTER_API_KEY")
        if or_key:
            try:
                print("Falling back to OpenRouter (nemotron-3.5)...")
                res = requests.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {or_key}", "Content-Type": "application/json"},
                    json={
                        "model": "liquid/lfm-2.5-2.6b:free",
                        "messages": [
                            {"role": "system", "content": f"You are a clinical nutritionist AI. {compact_schema}"},
                            {"role": "user", "content": prompt}
                        ]
                    }, timeout=15
                )
                if res.status_code == 200:
                    text = res.json()["choices"][0]["message"].get("content", "")
                    if text: return text
                    else: raise ValueError("Groq returned empty content (hit reasoning limit)")
                else: print(f"OpenRouter returned {res.status_code}: {res.text[:200]}")
            except Exception as e: print("OpenRouter failed:", e)

        # 3. Fallback: Google Gemini (stable generate_content API â€” uses full schema)
        if GEMINI_API_KEY:
            try:
                response = client.models.generate_content(
                    model=os.getenv("GEMINI_MODEL", "gemini-1.5-flash"),
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=schema_dict,
                    )
                )
                return response.text
            except Exception as e:
                print("Gemini fallback failed:", e)

        raise HTTPException(
            status_code=503,
            detail="All configured AI providers are unavailable or rate-limited. Please wait a few minutes and try again, or configure another provider key.",
        )

    for attempt in range(MAX_ATTEMPTS):
        try:
            output_text = call_ai_agent(current_prompt)
            # Remove potential markdown formatting from fallback models
            output_text = output_text.strip()
            if not output_text: raise Exception("Empty response from AI")
            if output_text.startswith("```json"): output_text = output_text[7:]
            if output_text.startswith("```"): output_text = output_text[3:]
            if output_text.endswith("```"): output_text = output_text[:-3]
            
            meals = ta.validate_json(output_text.strip())
            
            # Validation Step
            restrictions_to_check = patient.allergies + patient.dietary_restrictions
            is_valid, validation_msgs = validate_meals(
                meals,
                targets,
                restrictions_to_check,
                disallowed_ingredients=regional_foods["avoid"],
            )
            
            if is_valid:
                validation_msgs = ["Nutrition targets verified", "Dietary restrictions checked", "1-DAY plan generated", "Automated validation passed"]
                break
                
            # If invalid, append feedback and retry
            current_prompt = base_prompt + "\\n\\nPREVIOUS ATTEMPT FAILED VALIDATION.\\nProblems:\\n- " + "\\n- ".join(validation_msgs) + "\\n\\nRegenerate the complete meal plan and CORRECT these issues."
            
        except HTTPException:
            raise
        except Exception as e:
            print(f"Gen/Parse Error (Attempt {attempt+1}):", str(e).encode('ascii', 'replace').decode())
            time.sleep(2)
            if attempt == MAX_ATTEMPTS - 1:
                raise HTTPException(status_code=502, detail=str(e) if "providers exhausted" in str(e) else "External AI service failed after multiple attempts.")
                
    if not is_valid:
        raise HTTPException(status_code=422, detail="Failed to generate a meal plan that passes clinical validation constraints.")

    # 5. Post-process to inject actual image URLs
    for m in meals:
        visual_detail = ""
        normalized_name = m.name.lower().replace("daal", "dal")
        if any(term in normalized_name for term in ("moong", "mung", "mong")) and any(term in normalized_name for term in ("dal", "lentil")):
            visual_detail = " Yellow split mung beans in a golden, lightly textured curry with visible lentils and a small cumin tempering, served in a simple bowl; not a green soup, not a blended puree."
        image_prompt = (
            f"Authentic home-cooked {m.image_keyword}. Show exactly the named dish as it is commonly served in {patient.country}, "
            f"recognizable ingredients and traditional preparation.{visual_detail} "
            "Photorealistic natural food photography, simple real tableware, soft daylight, appetizing but realistic, "
            "single dish centered, no text, no collage, no unrelated garnish."
        )
        m.image = (
            "https://image.pollinations.ai/prompt/"
            f"{urllib.parse.quote(image_prompt, safe='')}?width=800&height=600&model=flux&nologo=true"
        )

    # 6. Assemble Final Payload
    day_plans = structure_day_plans(meals, weather_info.forecast)
    
    meal_plan = MealPlan(
        days=day_plans,
        overall_validation=ValidationInfo(valid=is_valid, messages=validation_msgs)
    )

    return PlanResponse(
        patient=patient,
        nutrition=targets,
        weather=weather_info,
        meal_plan=meal_plan
    )

@app.get("/health")
def health_check():
    return {"status": "ok"}
