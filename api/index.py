import os
import urllib.parse
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from google import genai
from pydantic import TypeAdapter

from schemas import PatientIntake, PlanResponse, Meal
from nutrition_math import get_nutritional_targets

load_dotenv()

app = FastAPI(title="ClimaDiet API", description="AI Clinical Nutrition API")

# Setup CORS to allow Next.js frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.post("/api/generate-plan", response_model=PlanResponse)
@app.post("/generate-plan", response_model=PlanResponse)
def generate_meal_plan(patient: PatientIntake):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is missing.")

    client = genai.Client(api_key=GEMINI_API_KEY)

    # 1. Deterministic Math Engine
    targets = get_nutritional_targets(patient)
    
    # 2. Get Weather
    from weather_api import get_7_day_forecast
    # Use patient.location directly as it contains City, Country format
    # e.g., "Lahore, Pakistan (hot, 40C)"
    city_country = patient.location.split(" (")[0] if " (" in patient.location else patient.location
    real_time_weather = get_7_day_forecast(city_country, "")

    # 3. Prompt
    prompt = f"""
    You are an expert clinical nutritionist. 
    Create a complete 7-DAY meal plan for a patient with the following profile:
    - Age: {patient.age}, Gender: {patient.gender}
    - Activity: {patient.activity}
    - Conditions: {', '.join(patient.conditions) if patient.conditions else 'None'}
    - Ethnicity: {patient.ethnicity}
    - Location: {patient.location}
    
    {real_time_weather}
    
    CRITICAL INSTRUCTIONS:
    1. EXACTLY 3 MEALS PER DAY: You MUST provide exactly 'Breakfast', 'Lunch', and 'Dinner' for every day (21 meals total). Do NOT include snacks!
    2. CLIMATE CONTEXT PER DAY: Match Day 1's meals to Day 1's forecasted weather, Day 2 to Day 2, etc. If > 32°C, no heavy/spoiling foods like fish.
    3. TARGETS: The math engine calculated:
       - Target Calories: {targets["target_calories"]} kcal
       - Target Protein: {targets["protein_g"]}g
       - Target Carbs: {targets["carbs_g"]}g
       - Target Fats: {targets["fat_g"]}g
    Ensure the sum of the 3 meals EACH DAY roughly aligns with these daily targets.
    4. Provide an `emoji` for each meal, and an `image_keyword` (a single, simple word like 'curry' or 'salad').
    """

    # 4. Generate
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
                        "schema": TypeAdapter(list[Meal]).json_schema(),
                    }
                ]
            )
            break
        except Exception as model_e:
            continue
            
    if not interaction:
        raise HTTPException(status_code=500, detail="Gemini API failed.")
    
    # 5. Parse JSON Response
    ta = TypeAdapter(list[Meal])
    try:
        meals = ta.validate_json(interaction.output_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse LLM output: {str(e)}")

    # 6. Post-process to inject actual image URLs
    for m in meals:
        kw = urllib.parse.quote(m.image_keyword)
        m.image = f"https://loremflickr.com/800/600/{kw}"

    # 7. Assemble Payload
    return PlanResponse(
        tdee=targets["target_calories"],
        protein=targets["protein_g"],
        carbs=targets["carbs_g"],
        fat=targets["fat_g"],
        meals=meals
    )

@app.get("/health")
def health_check():
    return {"status": "ok"}
