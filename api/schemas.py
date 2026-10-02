from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal

class PatientIntake(BaseModel):
    planner_mode: Literal["ai", "catalog"] = Field(default="ai", description="Select the existing AI providers or the local catalog planner")
    age: int = Field(..., description="Age in years")
    weight: float = Field(..., description="Weight in kg")
    height: float = Field(..., description="Height in cm")
    gender: str = Field(..., description="'Male' or 'Female'")
    activity: str = Field(..., description="e.g., 'Sedentary', 'Lightly active', 'Moderately active'")
    conditions: List[str] = Field(default=[], description="List of conditions like 'Diabetes', 'Hypertension'")
    allergies: List[str] = Field(default=[], description="List of allergies like 'peanuts'")
    ethnicity: str = Field(..., description="e.g., 'South Asian - Punjabi'")
    goal: str = Field(default='maintain', description="e.g., 'maintain', 'lose weight', 'gain muscle'")
    goal_amount: str = Field(default='', description="e.g., '5kg'")
    dietary_restrictions: List[str] = Field(default=[], description="e.g., 'Halal', 'Vegan'")
    start_date: str = Field(..., description="e.g. YYYY-MM-DD")
    end_date: str = Field(..., description="e.g. YYYY-MM-DD")
    city: str = Field(..., description="e.g., 'Lahore'")
    country: str = Field(..., description="e.g., 'Pakistan'")

# --- Output Models for LLM Structured Output ---

class Meal(BaseModel):
    id: str = Field(..., description="Unique ID like 'day1-breakfast'")
    day: str = Field(..., description="e.g., 'Day 1', 'Day 2'")
    slot: str = Field(..., description="MUST be exactly 'Breakfast', 'Lunch', or 'Dinner'. NO SNACKS.")
    name: str = Field(..., description="Name of the food or meal")
    ingredients: List[str] = Field(..., description="List of all main ingredients to allow strict allergy validation")
    image_keyword: str = Field(..., description="1-2 word search term for the image (e.g. 'biryani', 'salad')")
    image: Optional[str] = Field(None, description="Image URL populated by backend")
    emoji: Optional[str] = Field(None, description="A single emoji representing the meal (deprecated)")
    calories: int = Field(..., description="Estimated calories")
    protein: int = Field(..., description="Protein in grams")
    carbs: int = Field(..., description="Carbohydrates in grams")
    fat: int = Field(..., description="Fat in grams")
    why: str = Field(..., description="Why this fits the local real-time weather and their conditions")
    benefits: List[str] = Field(..., description="3-4 short points on why this meal helps them")

# --- Final API Response Models ---

class NutritionTargets(BaseModel):
    bmi: float
    bmi_category: str
    bmr: int
    tdee: int
    target_calories: int
    protein_g: int
    carbs_g: int
    fat_g: int
    constraints_applied: List[str]

class WeatherInfo(BaseModel):
    location: str
    forecast: List[Dict[str, Any]]

class DailyTotals(BaseModel):
    calories: int
    protein_g: int
    carbs_g: int
    fat_g: int

class ValidationInfo(BaseModel):
    valid: bool
    messages: List[str]

class DayPlan(BaseModel):
    date: str
    day_label: str
    weather: Optional[Dict[str, Any]]
    meals: List[Meal]
    daily_totals: DailyTotals
    validation: ValidationInfo

class MealPlan(BaseModel):
    days: List[DayPlan]
    overall_validation: ValidationInfo

class PlanResponse(BaseModel):
    patient: PatientIntake
    nutrition: NutritionTargets
    weather: WeatherInfo
    meal_plan: MealPlan
