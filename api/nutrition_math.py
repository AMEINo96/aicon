from typing import Tuple
from api.schemas import PatientIntake

ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "lightly active": 1.375,
    "moderately active": 1.55,
    "very active": 1.725,
    "athlete": 1.9
}

def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
    """Calculates Basal Metabolic Rate using the Mifflin-St Jeor equation."""
    base = (10 * weight_kg) + (6.25 * height_cm) - (5 * age)
    if gender.lower() == 'male':
        return base + 5
    else:
        return base - 161

def calculate_tdee(bmr: float, activity_level: str) -> int:
    """Calculates Total Daily Energy Expenditure."""
    multiplier = ACTIVITY_MULTIPLIERS.get(activity_level.lower(), 1.2)
    return int(bmr * multiplier)

def adjust_calories_for_goal(tdee: int, goal: str) -> int:
    """Adjusts the daily caloric target based on weight loss/gain goals."""
    goal_lower = goal.lower()
    if "lose" in goal_lower or "loss" in goal_lower:
        # Standard healthy weight loss is roughly a 500 calorie deficit
        return tdee - 500
    elif "gain" in goal_lower or "muscle" in goal_lower or "bulk" in goal_lower:
        # Standard lean bulk is roughly a 300-500 calorie surplus
        return tdee + 300
    return tdee # maintain

def calculate_macros(target_calories: int, conditions: list[str], goal: str) -> Tuple[int, int, int]:
    """
    Calculates macronutrient split in grams.
    Returns: (protein_g, carbs_g, fat_g)
    """
    conditions_lower = [c.lower() for c in conditions]
    is_diabetic = any('diabetes' in c for c in conditions_lower)
    goal_lower = goal.lower()

    if is_diabetic:
        # Low carb, higher fat/protein: 35% Protein, 25% Carbs, 40% Fat
        pct_protein = 0.35
        pct_carbs = 0.25
        pct_fat = 0.40
    elif "muscle" in goal_lower or "gain" in goal_lower:
        # High protein for muscle gain: 35% Protein, 45% Carbs, 20% Fat
        pct_protein = 0.35
        pct_carbs = 0.45
        pct_fat = 0.20
    else:
        # Standard balanced: 30% Protein, 40% Carbs, 30% Fat
        pct_protein = 0.30
        pct_carbs = 0.40
        pct_fat = 0.30

    # Calories to grams: Protein=4kcal/g, Carbs=4kcal/g, Fat=9kcal/g
    protein_g = int((target_calories * pct_protein) / 4)
    carbs_g = int((target_calories * pct_carbs) / 4)
    fat_g = int((target_calories * pct_fat) / 9)

    return protein_g, carbs_g, fat_g

def calculate_bmi(weight_kg: float, height_cm: float) -> Tuple[float, str]:
    """Calculates BMI and returns (bmi_value, category_string)"""
    height_m = height_cm / 100
    bmi = round(weight_kg / (height_m ** 2), 1)
    
    if bmi < 18.5:
        category = "Underweight"
    elif 18.5 <= bmi < 25:
        category = "Normal weight"
    elif 25 <= bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"
        
    return bmi, category

def get_nutritional_targets(patient: PatientIntake) -> dict:
    """Wrapper function to compute all deterministic math targets."""
    bmi, bmi_category = calculate_bmi(patient.weight, patient.height)
    bmr = calculate_bmr(patient.weight, patient.height, patient.age, patient.gender)
    baseline_tdee = calculate_tdee(bmr, patient.activity)
    
    # We use the goal field from the intake form
    target_calories = adjust_calories_for_goal(baseline_tdee, patient.goal)
    
    protein, carbs, fat = calculate_macros(target_calories, patient.conditions, patient.goal)
    
    return {
        "bmi": bmi,
        "bmi_category": bmi_category,
        "bmr": int(bmr),
        "baseline_tdee": baseline_tdee,
        "target_calories": target_calories,
        "protein_g": protein,
        "carbs_g": carbs,
        "fat_g": fat
    }
