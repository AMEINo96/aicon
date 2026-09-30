export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export const SLOTS = ["Breakfast", "Lunch", "Dinner"] as const;
export type Day = (typeof DAYS)[number];
export type Slot = (typeof SLOTS)[number];

export type Meal = {
  id: string;
  day: string;
  slot: Slot;
  name: string;
  ingredients: string[];
  image?: string | null;
  emoji?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  why: string;
  benefits: string[];
};

export type PatientIntake = {
  age: number; weight: number; height: number; gender: string; activity: string;
  conditions: string[]; allergies: string[]; ethnicity: string;
  goal: string; goal_amount: string; dietary_restrictions: string[];
  start_date: string; end_date: string; city: string; country: string;
};
export type IntakeData = PatientIntake;

export type NutritionTargets = {
  bmi: number;
  bmi_category: string;
  bmr: number;
  tdee: number;
  target_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  constraints_applied: string[];
};

export type WeatherDay = {
  time: string;
  temperature_max: number;
  temperature_min: number | null;
  weather_code?: number;
};

export type WeatherInfo = {
  location: string;
  forecast: WeatherDay[];
};

export type DailyTotals = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type ValidationInfo = {
  valid: boolean;
  messages: string[];
};

export type DayPlan = {
  date: string;
  day_label: string;
  weather: WeatherDay | null;
  meals: Meal[];
  daily_totals: DailyTotals;
  validation: ValidationInfo;
};

export type MealPlan = {
  days: DayPlan[];
  overall_validation: ValidationInfo;
};

export type PlanResponse = {
  patient: PatientIntake;
  nutrition: NutritionTargets;
  weather: WeatherInfo;
  meal_plan: MealPlan;
};

export async function generatePlan(data: IntakeData): Promise<PlanResponse> {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
  
  const r = await fetch(`${url}/generate-plan`, {
    method: "POST", 
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify(data),
  });
  
  if (!r.ok) {
    const errorData = await r.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to generate plan. Please try again.");
  }
  
  return await r.json();
}
