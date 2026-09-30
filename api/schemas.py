from pydantic import BaseModel, Field
from typing import List, Optional

class PatientIntake(BaseModel):
    age: int = Field(..., description="Age in years")
    weight: float = Field(..., description="Weight in kg")
    height: float = Field(..., description="Height in cm")
    gender: str = Field(..., description="'Male' or 'Female'")
    activity: str = Field(..., description="e.g., 'Sedentary', 'Lightly active', 'Moderately active'")
    conditions: List[str] = Field(default=[], description="List of conditions like 'Diabetes', 'Hypertension'")
    location: str = Field(..., description="Patient's location (e.g., 'Lahore, Pakistan (hot, 40C)')")
    ethnicity: str = Field(..., description="e.g., 'South Asian - Punjabi'")

# --- Output Models (To Next.js Frontend & for LLM Structured Output) ---

class Meal(BaseModel):
    id: str = Field(..., description="Unique ID like 'monday-breakfast'")
    day: str = Field(..., description="e.g., 'Monday', 'Tuesday'")
    slot: str = Field(..., description="MUST be exactly 'Breakfast', 'Lunch', or 'Dinner'. NO SNACKS.")
    name: str = Field(..., description="Name of the food or meal")
    image_keyword: str = Field(..., description="1-2 word search term for the image (e.g. 'biryani', 'salad')")
    image: Optional[str] = Field(None, description="Image URL populated by backend")
    emoji: str = Field(..., description="A single emoji representing the meal (e.g., 🍲)")
    calories: int = Field(..., description="Estimated calories")
    protein: int = Field(..., description="Protein in grams")
    carbs: int = Field(..., description="Carbohydrates in grams")
    fat: int = Field(..., description="Fat in grams")
    why: str = Field(..., description="Why this fits the local real-time weather and their conditions")
    benefits: List[str] = Field(..., description="3-4 short points on why this meal helps them")

class PlanResponse(BaseModel):
    tdee: int = Field(..., description="Total Daily Energy Expenditure (Calories)")
    protein: int = Field(..., description="Target protein in grams")
    carbs: int = Field(..., description="Target carbs in grams")
    fat: int = Field(..., description="Target fat in grams")
    meals: List[Meal] = Field(..., description="Flat array of exactly 21 meals (7 days x 3 meals)")
