export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export const SLOTS = ["Breakfast", "Lunch", "Snack", "Dinner"] as const;
export type Day = (typeof DAYS)[number];
export type Slot = (typeof SLOTS)[number];

/**
 * One meal in the 7-day plan.
 * BACKEND CONTRACT: return `meals` as a flat array of 28 items (7 days x 4 slots).
 *  - `image`  : full URL of the meal photo (nullable, UI shows an illustrated fallback if missing/broken)
 *  - `calories`, `protein`, `carbs`, `fat` : per serving (macros in grams)
 *  - `why`    : why the AI suggested this meal for THIS patient
 *  - `benefits`: how the meal will help (3-4 short points)
 */
export type Meal = {
  id: string;
  day: Day;
  slot: Slot;
  name: string;
  image?: string | null;
  emoji?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  why: string;
  benefits: string[];
};
export type PlanResponse = { tdee: number; protein: number; carbs: number; fat: number; meals: Meal[] };

export type IntakeData = {
  age: number; weight: number; height: number; gender: string; activity: string;
  conditions: string[]; location: string; ethnicity: string;
};

let n = 0;
const m = (
  day: Day, slot: Slot, name: string, emoji: string,
  protein: number, carbs: number, fat: number, why: string, benefits: string[],
): Meal => ({
  id: `m${++n}`, day, slot, name, emoji, image: null, protein, carbs, fat,
  calories: Math.round(protein * 4 + carbs * 4 + fat * 9), why, benefits,
});

// Hardcoded until POST /generate-plan is ready. `image: null` -> fallback art; backend will send real URLs.
const MEALS: Meal[] = [
  // ---------- Monday
  m("Monday", "Breakfast", "Vegetable Daliya", "🥣", 18, 68, 12,
    "Cracked wheat is a whole grain that releases sugar slowly, which suits a diabetes-safe plan and keeps you full through a hot morning.",
    ["Slow-release carbs avoid a sugar spike", "Fibre keeps you full until lunch", "Vegetables add potassium and vitamins"]),
  m("Monday", "Lunch", "Cucumber Raita with Grilled Chicken", "🍗", 52, 62, 18,
    "At 40°C the body loses water fast. Cucumber and yogurt are cooling and hydrating, and grilled chicken gives lean protein without heavy oil.",
    ["Hydrates and cools the body in heat", "High protein protects muscle while losing fat", "Probiotic yogurt supports digestion"]),
  m("Monday", "Snack", "Sattu Sharbat", "🥤", 10, 32, 6,
    "A traditional cooling drink that replaces afternoon coffee. Roasted gram flour adds fibre and protein with a low glycemic load.",
    ["Replaces caffeine with a natural coolant", "Replenishes electrolytes lost to sweat", "Steady energy without sugar crash"]),
  m("Monday", "Dinner", "Lentil Stew with Brown Rice", "🍲", 30, 78, 12,
    "Lentils are low glycemic and rich in plant protein and iron. Brown rice keeps the carbs slow and the meal light for the evening.",
    ["Low glycemic index for stable blood sugar", "Iron and folate for energy", "Light on the stomach before sleep"]),
  // ---------- Tuesday
  m("Tuesday", "Breakfast", "Moong Daal Chilla with Mint Chutney", "🥞", 24, 48, 14,
    "Moong is one of the easiest legumes to digest and is high in protein, a good start when heavy breakfasts feel sluggish in the heat.",
    ["Plant protein with very little saturated fat", "Easy to digest in hot weather", "Mint chutney aids digestion"]),
  m("Tuesday", "Lunch", "Grilled Fish with Bhindi & Roti", "🐟", 46, 58, 20,
    "Fish gives lean protein and omega-3, and okra (bhindi) is low in calories with soluble fibre that slows glucose absorption.",
    ["Omega-3 supports heart and BP health", "Okra fibre helps control blood sugar", "Grilled, low-oil and locally available"]),
  m("Tuesday", "Snack", "Mint Lemon Water with Chia & Almonds", "🍋", 7, 14, 10,
    "Rehydration without caffeine. Chia holds water and almonds add healthy fat, keeping the stomach settled in the heat.",
    ["Rehydrates without caffeine", "Chia fibre helps you feel full", "Healthy fats from almonds"]),
  m("Tuesday", "Dinner", "Light Chicken Karahi with Cucumber Salad", "🍛", 44, 20, 22,
    "A familiar dish made with less oil and more tomato. A low-carb dinner keeps overnight glucose steady while the salad adds water.",
    ["Familiar flavours make the plan easy to follow", "Low carbs for stable overnight sugar", "Cucumber salad adds hydration"]),
  // ---------- Wednesday
  m("Wednesday", "Breakfast", "Masala Omelette with Whole Wheat Paratha", "🍳", 26, 42, 22,
    "Eggs give complete protein that keeps hunger low all morning. A thin whole-wheat paratha keeps the meal culturally familiar.",
    ["Complete protein for muscle and satiety", "Whole wheat adds fibre over refined flour", "Choline for brain health"]),
  m("Wednesday", "Lunch", "Chana Chaat Bowl", "🥗", 22, 70, 12,
    "Chickpeas are high in fibre and protein with a low GI. Tomato, onion and lemon make it a cool, tangy meal that needs no cooking.",
    ["Fibre slows sugar absorption", "No hot cooking needed on a hot day", "Vitamin C from lemon boosts iron uptake"]),
  m("Wednesday", "Snack", "Seasonal Fruit with Plain Yogurt", "🍓", 10, 34, 6,
    "Seasonal fruit is affordable and water-rich. Pairing with yogurt adds protein that softens the sugar response.",
    ["Water-rich fruit helps hydration", "Protein slows the sugar response", "Calcium for bones"]),
  m("Wednesday", "Dinner", "Tandoori Chicken with Mixed Vegetables", "🍗", 50, 24, 18,
    "Grilled rather than fried, this keeps protein high and carbs low at night, which supports weight loss without hunger.",
    ["High protein, low carb dinner", "Grilled, so less added oil", "Vegetables add fibre and antioxidants"]),
  // ---------- Thursday
  m("Thursday", "Breakfast", "Overnight Oats with Dates & Walnuts", "🥛", 16, 60, 16,
    "Oats contain beta-glucan, a fibre that lowers cholesterol. Soaked overnight, they need no cooking in the morning heat.",
    ["Beta-glucan supports healthy cholesterol", "Prepared the night before, no cooking", "Walnuts add omega-3"]),
  m("Thursday", "Lunch", "Mixed Daal with Jowar Roti", "🍛", 28, 80, 12,
    "Jowar (sorghum) is gluten-free with a lower glycemic impact than wheat, and mixed daals give a fuller amino acid profile.",
    ["Lower GI grain for steady energy", "Mixed lentils give complete protein", "Rich in magnesium and iron"]),
  m("Thursday", "Snack", "Salted Lassi", "🥛", 9, 14, 7,
    "A salted (not sweet) lassi replaces salt and fluids lost through sweat and supports gut health.",
    ["Replaces sodium and fluids lost to sweat", "Probiotics support digestion", "No added sugar"]),
  m("Thursday", "Dinner", "Baked Fish Tikka with Spinach Saag", "🐟", 48, 18, 18,
    "Baked fish is light and high in protein. Spinach adds iron, calcium and folate without many calories.",
    ["Lean protein for recovery", "Iron and folate from spinach", "Low calorie, light dinner"]),
  // ---------- Friday
  m("Friday", "Breakfast", "Boiled Eggs with Whole Wheat Toast", "🥚", 24, 32, 16,
    "A quick, portable breakfast with high-quality protein that keeps you satisfied and controls mid-morning cravings.",
    ["Protein keeps cravings low", "Simple and quick to prepare", "Whole wheat adds fibre"]),
  m("Friday", "Lunch", "Chicken Daliya Khichdi", "🍲", 40, 66, 14,
    "One-pot comfort food made with cracked wheat instead of white rice, giving slow-release energy and lean protein.",
    ["Slow carbs from cracked wheat", "One pot, easy to digest", "Balanced protein and fibre"]),
  m("Friday", "Snack", "Roasted Chana", "🥜", 12, 26, 5,
    "A crunchy, low-cost snack packed with fibre and protein. It replaces fried snacks and biscuits.",
    ["Swap for fried snacks", "Fibre and protein keep you full", "Affordable and shelf-stable"]),
  m("Friday", "Dinner", "Palak Paneer with Roti", "🥬", 28, 44, 26,
    "Spinach and paneer offer calcium, iron and protein in a vegetarian dinner, made with less cream to keep fat in check.",
    ["Calcium and iron in one meal", "Vegetarian protein source", "Spinach supports blood health"]),
  // ---------- Saturday
  m("Saturday", "Breakfast", "Vegetable Besan Cheela", "🥞", 20, 42, 12,
    "Gram flour is high in protein and low GI. Adding vegetables increases fibre and keeps the meal light for the heat.",
    ["Higher protein than wheat flour", "Low glycemic index", "Vegetables boost fibre"]),
  m("Saturday", "Lunch", "Lean Beef Keema with Lauki & Roti", "🥘", 42, 52, 20,
    "Lean keema with bottle gourd (lauki) is a familiar dish with plenty of iron. Lauki is over 90% water, which helps in the heat.",
    ["Iron and B12 for energy", "Lauki is cooling and hydrating", "Culturally familiar flavours"]),
  m("Saturday", "Snack", "Cucumber-Mint Cooler with Roasted Makhana", "🥒", 6, 18, 4,
    "A light, cooling snack. Makhana (fox nuts) are low calorie and crunchy, a healthier swap for chips.",
    ["Very hydrating", "Low calorie crunchy snack", "Mint soothes the stomach"]),
  m("Saturday", "Dinner", "Chicken Vegetable Soup with Roti", "🍜", 30, 38, 10,
    "A warm but light soup is easy on digestion at night, with vegetables adding fibre and minerals.",
    ["Light and easy to digest", "Hydrating broth", "Vegetables add micronutrients"]),
  // ---------- Sunday
  m("Sunday", "Breakfast", "Egg Bhurji with Multigrain Roti", "🍳", 24, 44, 20,
    "A traditional breakfast rebuilt with multigrain roti for extra fibre and less oil, so it fits a diabetic-friendly plan.",
    ["High protein start to the day", "Multigrain adds fibre", "Familiar and satisfying"]),
  m("Sunday", "Lunch", "Brown Rice Chicken Pulao with Raita", "🍚", 38, 74, 16,
    "A weekend favourite made with brown rice and lean chicken. Raita cools the meal and adds probiotics.",
    ["Brown rice has a lower GI than white", "Raita cools and aids digestion", "Balanced macros in one plate"]),
  m("Sunday", "Snack", "Dates & Almonds", "🌰", 6, 24, 10,
    "A small portion of dates gives natural energy, and almonds slow the sugar release with healthy fat and protein.",
    ["Natural energy without refined sugar", "Healthy fats slow absorption", "Portion-controlled treat"]),
  m("Sunday", "Dinner", "Grilled Seekh Kebab with Mint Raita & Salad", "🍢", 40, 16, 20,
    "High protein and low carb to end the week, grilled instead of fried, with a big salad to add volume and water.",
    ["Protein-rich, low-carb dinner", "Grilled, so less added fat", "Salad adds fibre and hydration"]),
];

export const MOCK_PLAN: PlanResponse = { tdee: 2200, protein: 150, carbs: 200, fat: 65, meals: MEALS };

export async function generatePlan(data: IntakeData): Promise<PlanResponse> {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";
  try {
    const r = await fetch(`${url}/generate-plan`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    if (r.ok) return await r.json();
  } catch (e) {
    console.error("API failed, falling back to mock data", e);
  }
  await new Promise((r) => setTimeout(r, 1200));
  return MOCK_PLAN;
}
