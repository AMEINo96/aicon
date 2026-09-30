import os
import urllib.parse
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import pathlib

from google import genai
from pydantic import TypeAdapter

from api.schemas import (
    PatientIntake, PlanResponse, Meal, NutritionTargets,
    WeatherInfo, DailyTotals, ValidationInfo, DayPlan, MealPlan
)
from api.nutrition_math import get_nutritional_targets
from api.weather_api import get_7_day_forecast
from api.meal_validator import validate_meals, structure_day_plans

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

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Use a specific verified model ID from ENV, fallback to flash
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

@app.post("/api/generate-plan", response_model=PlanResponse)
@app.post("/generate-plan", response_model=PlanResponse)
def generate_meal_plan(patient: PatientIntake):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is missing.")

    client = genai.Client(api_key=GEMINI_API_KEY)

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
    weather_data = get_7_day_forecast(patient.city, patient.country, patient.start_date)
    weather_info = WeatherInfo(
        location=weather_data["location"],
        forecast=weather_data["forecast"]
    )
    
    weather_str = "\\n".join([f"Day {i+1} ({w['time']}): High {w['temperature_max']}C" for i, w in enumerate(weather_info.forecast)])

    # 3. Base Prompt
    base_prompt = f"""
    You are an expert clinical nutritionist. 
    Create a complete 7-DAY meal plan for a patient with the following profile:
    - Age: {patient.age}, Gender: {patient.gender}, Ethnicity/Culture: {patient.ethnicity}
    - Primary Goal: {patient.goal} ({patient.goal_amount})
    - Conditions: {', '.join(patient.conditions) if patient.conditions else 'None'}
    - Allergies: {', '.join(patient.allergies) if patient.allergies else 'None'}
    - Dietary Restrictions: {', '.join(patient.dietary_restrictions) if patient.dietary_restrictions else 'None'}
    
    Location: {weather_info.location}
    Weather Forecast:
    {weather_str}
    
    CRITICAL INSTRUCTIONS:
    1. EXACTLY 3 MEALS PER DAY: You MUST provide exactly 'Breakfast', 'Lunch', and 'Dinner' for every day (21 meals total). Do NOT include snacks!
    2. TARGETS: The math engine calculated:
       - Target Calories: {targets.target_calories} kcal
       - Target Protein: {targets.protein_g}g
       - Target Carbs: {targets.carbs_g}g
       - Target Fats: {targets.fat_g}g
       Do NOT invent your own targets.
    Ensure the sum of the 3 meals EACH DAY roughly aligns with these daily targets.
    3. INGREDIENTS & SAFETY: You MUST populate the `ingredients` array for each meal. Be completely exhaustive so the validator can check for allergies. ZERO cross-contamination.
    4. CULTURAL & CLIMATE MATCH: Recommend meals suited to `{patient.ethnicity}` cuisine and the provided local weather forecast.
    5. Provide an `image_keyword` (a single word like 'biryani').
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
    
    def call_ai_agent(prompt: str) -> str:
        """Tries multiple free-tier AI providers sequentially to avoid 429 quota limits."""
        # 1. Primary: Google Gemini
        if GEMINI_API_KEY:
            try:
                interaction = client.interactions.create(
                    model=GEMINI_MODEL,
                    input=prompt,
                    response_format=[{
                        "type": "text", "mime_type": "application/json", "schema": schema_dict
                    }]
                )
                return interaction.output_text
            except Exception as e:
                print("Gemini failed:", e)
                if "429" not in str(e) and "exhausted" not in str(e).lower():
                    pass # Keep trying fallbacks for other errors too for maximum uptime

        # 2. Fallback: OpenRouter (Dozens of Free Models like Llama 3, Claude, Mistral)
        or_key = os.getenv("OPENROUTER_API_KEY")
        if or_key:
            try:
                print("Falling back to OpenRouter free models...")
                res = requests.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {or_key}", "Content-Type": "application/json"},
                    json={
                        "model": "google/gemini-2.0-flash-lite-preview-02-05:free", # Free routing
                        "messages": [
                            {"role": "system", "content": f"You are a clinical AI. Reply ONLY with a raw JSON array matching this JSON Schema: {json.dumps(schema_dict)}"},
                            {"role": "user", "content": prompt}
                        ]
                    }, timeout=30
                )
                if res.status_code == 200: return res.json()["choices"][0]["message"]["content"]
            except Exception as e: print("OpenRouter failed:", e)

        # 3. Fallback: Groq (Ultra-fast Llama 3 Free Tier)
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key:
            try:
                print("Falling back to Groq...")
                res = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"},
                    json={
                        "model": "llama3-8b-8192",
                        "messages": [
                            {"role": "system", "content": f"You are a clinical AI. Reply ONLY with a raw JSON array matching this JSON Schema: {json.dumps(schema_dict)}. No markdown blocks."},
                            {"role": "user", "content": prompt}
                        ]
                    }, timeout=15
                )
                if res.status_code == 200: return res.json()["choices"][0]["message"]["content"]
            except Exception as e: print("Groq failed:", e)

        raise Exception("All AI providers exhausted their Free Tier limits or failed. Please add OPENROUTER_API_KEY or GROQ_API_KEY to .env.local")

    for attempt in range(MAX_ATTEMPTS):
        try:
            output_text = call_ai_agent(current_prompt)
            # Remove potential markdown formatting from fallback models
            output_text = output_text.strip()
            if output_text.startswith("```json"): output_text = output_text[7:]
            if output_text.startswith("```"): output_text = output_text[3:]
            if output_text.endswith("```"): output_text = output_text[:-3]
            
            meals = ta.validate_json(output_text.strip())
            
            # Validation Step
            restrictions_to_check = patient.allergies + patient.dietary_restrictions
            is_valid, validation_msgs = validate_meals(meals, targets, restrictions_to_check)
            
            if is_valid:
                validation_msgs = ["Nutrition targets verified", "Dietary restrictions checked", "7-day plan generated", "Automated validation passed"]
                break
                
            # If invalid, append feedback and retry
            current_prompt = base_prompt + "\\n\\nPREVIOUS ATTEMPT FAILED VALIDATION.\\nProblems:\\n- " + "\\n- ".join(validation_msgs) + "\\n\\nRegenerate the complete meal plan and CORRECT these issues."
            
        except Exception as e:
            print(f"Gen/Parse Error (Attempt {attempt+1}):", e)
            if attempt == MAX_ATTEMPTS - 1:
                raise HTTPException(status_code=502, detail=str(e) if "providers exhausted" in str(e) else "External AI service failed after multiple attempts.")
                
    if not is_valid:
        raise HTTPException(status_code=422, detail="Failed to generate a meal plan that passes clinical validation constraints.")

    # 5. Post-process to inject actual image URLs
    for m in meals:
        m.image = f"https://image.pollinations.ai/prompt/Delicious%20{urllib.parse.quote(m.name)}%20professional%20food%20photography"

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
