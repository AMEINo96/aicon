"""Deterministic three-day planner backed by the reviewed starter catalog."""

from itertools import product
import re

from api.meal_catalog import CATALOG, Recipe, nutrition_for
from api.meal_validator import get_synonyms
from api.schemas import Meal, NutritionTargets


PORTIONS = (0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0)


def _allowed(recipe: Recipe, restrictions: list[str], allergies: list[str]) -> bool:
    ingredients = " ".join(item.name.lower() for item in recipe.ingredients)
    searchable_foods = f"{recipe.name.lower()} {ingredients}"
    tags = set(recipe.cuisine_tags)
    normalized = [re.sub(r"[^a-z]", "", item.lower()) for item in restrictions]
    normalized = [item[:-4] if item.endswith("free") else item for item in normalized]
    if any(item in {"vegetarian", "vegan"} for item in normalized) and "chicken" in ingredients:
        return False
    if any(item in {"vegan", "plantbased"} for item in normalized) and any(word in ingredients for word in ("egg", "yogurt", "milk")):
        return False
    if any(item in {"dairyfree", "lactosefree"} for item in normalized) and any(word in ingredients for word in ("yogurt", "milk")):
        return False
    if any(item in {"glutenfree", "gluten"} for item in normalized) and "atta flour" in ingredients:
        return False
    if "halal" in normalized and "halal" not in tags:
        return False

    # Apply the same allergen synonym groups used by final plan validation.
    for allergy in [*allergies, *restrictions]:
        key = allergy.lower().strip().removesuffix("-free").removesuffix(" free").strip()
        words = list(set(get_synonyms(key) + [key]))
        if any(re.search(rf"\b{re.escape(word)}\b", searchable_foods) for word in words):
            return False
    return True


def _score(totals: dict[str, int], targets: NutritionTargets) -> tuple[float, bool]:
    goals = {
        "calories": targets.target_calories,
        "protein": targets.protein_g,
        "carbs": targets.carbs_g,
        "fat": targets.fat_g,
    }
    # Calories get extra weight; macros retain the validator's tolerances.
    score = sum((2 if key == "calories" else 1) * ((totals[key] - goals[key]) / max(goals[key], 1)) ** 2 for key in goals)
    valid = abs(totals["calories"] - goals["calories"]) / max(goals["calories"], 1) <= 0.15
    valid &= all(abs(totals[key] - goals[key]) / max(goals[key], 1) <= 0.35 for key in ("protein", "carbs", "fat"))
    return score, valid


def _make_meal(recipe: Recipe, day_index: int, portion: float, weather: dict | None) -> Meal:
    nutrients = nutrition_for(recipe, portion)
    ingredient_text = [f"{item.name} ({round(item.grams * portion)} g)" for item in recipe.ingredients]
    temperature = (weather or {}).get("temperature_max")
    climate_note = f" Weather high: {temperature}°C." if temperature is not None else ""
    return Meal(
        id=f"day{day_index + 1}-{recipe.key}",
        day=f"Day {day_index + 1}",
        slot=recipe.slot,
        name=recipe.name,
        ingredients=ingredient_text,
        image_keyword=recipe.name.lower(),
        calories=nutrients["calories"],
        protein=nutrients["protein"],
        carbs=nutrients["carbs"],
        fat=nutrients["fat"],
        why=recipe.why + climate_note,
        benefits=list(recipe.benefits),
    )


def build_catalog_plan(
    targets: NutritionTargets,
    restrictions: list[str],
    allergies: list[str],
    forecast: list[dict],
) -> tuple[list[Meal], list[str]]:
    available = [recipe for recipe in CATALOG if _allowed(recipe, restrictions, allergies)]
    by_slot = {
        slot: [recipe for recipe in available if recipe.slot == slot]
        for slot in ("Breakfast", "Lunch", "Dinner")
    }
    if any(not recipes for recipes in by_slot.values()):
        raise ValueError("The local meal catalog has no safe meals for one or more meal slots with these restrictions.")

    chosen: list[Meal] = []
    used_recipe_keys: set[str] = set()
    day_messages: list[str] = []
    portion_nutrients = {
        (recipe.key, portion): nutrition_for(recipe, portion)
        for recipe in available
        for portion in PORTIONS
    }

    for day_index in range(3):
        best: tuple[float, tuple[Recipe, ...], tuple[float, ...]] | None = None
        day_weather = forecast[day_index] if day_index < len(forecast) else None
        combinations = product(by_slot["Breakfast"], by_slot["Lunch"], by_slot["Dinner"])
        for recipes in combinations:
            for portions in product(PORTIONS, repeat=3):
                nutrient_parts = [portion_nutrients[(recipe.key, portion)] for recipe, portion in zip(recipes, portions)]
                totals = {
                    key: sum(part[key] for part in nutrient_parts)
                    for key in ("calories", "protein", "carbs", "fat")
                }
                score, valid = _score(totals, targets)
                if not valid:
                    continue
                repeats = sum(recipe.key in used_recipe_keys for recipe in recipes)
                score += repeats * 0.05
                if best is None or score < best[0]:
                    best = (score, recipes, portions)

        if best is None:
            raise ValueError(
                "The available local meals cannot meet these daily calorie and macro targets within the planner's tolerances."
            )
        day_meals = [
            _make_meal(recipe, day_index, portion, day_weather)
            for recipe, portion in zip(best[1], best[2])
        ]
        chosen.extend(day_meals)
        used_recipe_keys.update(recipe.key for recipe in best[1])
        day_messages.append(f"Day {day_index + 1} totals fit the target ranges")

    return chosen, day_messages
