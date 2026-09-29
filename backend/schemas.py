from pydantic import BaseModel, Field
from typing import List, Optional

# --- Input Models (From Next.js Frontend) ---

class PatientIntake(BaseModel):
    age: int = Field(..., description="Age in years")
    weight_kg: float = Field(..., description="Weight in kilograms")
    height_cm: float = Field(..., description="Height in centimeters")
    gender: str = Field(..., description="'male' or 'female'")
    activity_level: str = Field(..., description="e.g., 'sedentary', 'light', 'moderate', 'active', 'very_active'")
    clinical_conditions: List[str] = Field(default=[], description="List of conditions like 'diabetes', 'hypertension'")
    country: str = Field(..., description="Patient's country (e.g., 'Pakistan')")
    city: str = Field(..., description="Patient's city (e.g., 'Lahore')")
    
    # New Goal Fields
    goal: str = Field(..., description="e.g., 'lose weight', 'gain muscle', 'maintain'")
    goal_amount: Optional[str] = Field(None, description="e.g., '5 kg', 'build lean mass'")

# --- Output Models (To Next.js Frontend & for LLM Structured Output) ---

class Meal(BaseModel):
    meal_type: str = Field(..., description="MUST be exactly 'Breakfast', 'Lunch', or 'Dinner'")
    name: str = Field(..., description="Name of the food or meal")
    portion: str = Field(..., description="Recommended portion size (e.g., '150g' or '1 cup')")
    calories: int = Field(..., description="Estimated calories for this portion")
    protein_g: int = Field(..., description="Protein in grams")
    carbs_g: int = Field(..., description="Carbohydrates in grams")
    fat_g: int = Field(..., description="Fat in grams")
    
    # New Nutrient & Image Fields
    key_micronutrients: List[str] = Field(..., description="e.g., ['Iron', 'Vitamin C', 'Calcium']")
    climate_reasoning: str = Field(..., description="Why this fits the local real-time weather")
    clinical_reasoning: str = Field(..., description="Why this is safe for the patient's clinical conditions")
    image_keyword: str = Field(..., description="A simple 1-2 word search term (e.g., 'salmon rice') that the frontend can use to fetch an image from Unsplash/Pexels")

class DailyPlan(BaseModel):
    day: int = Field(..., description="Day number (1-7)")
    meals: List[Meal] = Field(..., description="Exactly 3 meals (Breakfast, Lunch, Dinner)")
    total_calories: int = Field(..., description="Sum of meal calories for the day")
    total_protein_g: int = Field(..., description="Sum of meal protein for the day")
    total_carbs_g: int = Field(..., description="Sum of meal carbs for the day")
    total_fat_g: int = Field(..., description="Sum of meal fat for the day")

class MealPlanResponse(BaseModel):
    # Calculated deterministic values
    bmi: float = Field(..., description="Body Mass Index")
    bmi_category: str = Field(..., description="e.g., 'Normal weight', 'Overweight'")
    bmr: int = Field(..., description="Basal Metabolic Rate")
    baseline_tdee: int = Field(..., description="Baseline Total Daily Energy Expenditure (Calories) to maintain weight")
    target_calories: int = Field(..., description="Adjusted calories based on the user's goal")
    target_protein_g: int = Field(..., description="Target protein in grams")
    target_carbs_g: int = Field(..., description="Target carbohydrates in grams")
    target_fat_g: int = Field(..., description="Target fat in grams")
    
    # AI generated values
    weekly_plan: List[DailyPlan] = Field(..., description="7-day meal plan")
