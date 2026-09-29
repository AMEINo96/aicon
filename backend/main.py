import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from google import genai
from pydantic import TypeAdapter

from schemas import PatientIntake, MealPlanResponse, DailyPlan
from nutrition_math import get_nutritional_targets

load_dotenv()

app = FastAPI(title="ClimaDiet API", description="AI Clinical Nutrition API")

# Setup CORS to allow Next.js frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY environment variable not set. Please set it in .env")

@app.post("/generate-plan", response_model=MealPlanResponse)
def generate_meal_plan(patient: PatientIntake):
    # If the user hasn't set the key, fail gracefully so they know what to do
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is missing. Please set it in the .env file.")

    client = genai.Client(api_key=GEMINI_API_KEY)

    # 1. Deterministic Math Engine
    targets = get_nutritional_targets(patient)
    
    baseline_tdee = targets["baseline_tdee"]
    target_calories = targets["target_calories"]
    target_protein = targets["protein_g"]
    target_carbs = targets["carbs_g"]
    target_fat = targets["fat_g"]

    goal_str = f"{patient.goal}"
    if patient.goal_amount:
        goal_str += f" ({patient.goal_amount})"

    # Get 7-Day Forecast
    from weather_api import get_7_day_forecast
    real_time_weather = get_7_day_forecast(patient.city, patient.country)

    # 2. Construct Strict Prompt for Gemini (7-Day Plan)
    prompt = f"""
    You are an expert clinical nutritionist. 
    Create a complete 7-DAY meal plan for a patient with the following profile:
    - Age: {patient.age}, Gender: {patient.gender}
    - Primary Goal: {goal_str}
    - Conditions: {', '.join(patient.clinical_conditions) if patient.clinical_conditions else 'None'}
    - Location: {patient.city}, {patient.country}
    
    {real_time_weather}
    
    CRITICAL INSTRUCTIONS:
    1. EXACTLY 3 MEALS PER DAY: You MUST provide exactly 'Breakfast', 'Lunch', and 'Dinner' for every day. Do NOT include snacks, late-night snacks, or any other meal types.
    2. CLIMATE CONTEXT PER DAY: I have provided the 7-day weather forecast above. You must match Day 1's meals to Day 1's weather, Day 2 to Day 2's weather, etc. If a specific day is extremely hot (e.g. > 32°C), DO NOT recommend heavy or easily spoiled foods like fish FOR THAT SPECIFIC DAY.
    3. TARGETS: The mathematical engine has calculated the EXACT daily nutritional target required to hit their goal:
       - Target Calories: {target_calories} kcal
       - Target Protein: {target_protein}g
       - Target Carbs: {target_carbs}g
       - Target Fats: {target_fat}g
    Do NOT recalculate these targets. Ensure the sum of the 3 meals EACH DAY roughly aligns with these daily targets.
    4. Provide key micronutrients (e.g. Iron, Vitamin C) and an `image_keyword` (e.g. "grilled chicken salad") for the frontend to fetch an image.
    """

    try:
        # Fallback mechanism for Models
        models_to_try = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite']
        interaction = None
        
        for model_name in models_to_try:
            try:
                interaction = client.interactions.create(
                    model=model_name,
                    input=prompt,
                    response_format=[
                        {
                            "type": "text",
                            "mime_type": "application/json",
                            "schema": TypeAdapter(list[DailyPlan]).json_schema(),
                        }
                    ]
                )
                print(f"Successfully generated using {model_name}")
                break
            except Exception as model_e:
                print(f"Model {model_name} failed: {model_e}")
                continue
                
        if not interaction:
            raise Exception("All Gemini models failed. You may have exhausted all API quotas.")
        
        # 4. Parse JSON Response
        ta = TypeAdapter(list[DailyPlan])
        weekly_plan = ta.validate_json(interaction.output_text)

        # 5. Assemble Final Payload
        return MealPlanResponse(
            bmi=targets["bmi"],
            bmi_category=targets["bmi_category"],
            bmr=targets["bmr"],
            baseline_tdee=baseline_tdee,
            target_calories=target_calories,
            target_protein_g=target_protein,
            target_carbs_g=target_carbs,
            target_fat_g=target_fat,
            weekly_plan=weekly_plan
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}
