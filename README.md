# ClimaDiet

ClimaDiet is a nutrition-planning demo. It calculates nutrition targets deterministically and supports both its original AI-provider flow and an optional Pakistan-focused catalog planner for comparison.

## Architecture

ClimaDiet operates on a strict deterministic validation architecture. The AI does NOT blindly calculate nutritional goals.

1. **Patient Intake**: User data (Age, Weight, Climate, Allergies, Goals).
2. **Deterministic Nutrition Engine**: A Python engine (`api/nutrition_math.py`) calculates BMR, TDEE, Target Calories, and strict Macro goals deterministically using the Mifflin-St Jeor equation.
3. **Weather Engine**: Open-Meteo fetches the forecast for the selected city and dates.
4. **Meal planning**: The intake form defaults to the existing AI-provider flow. For testing, choose the local catalog mode, which filters Pakistan starter meals against supported allergies and dietary restrictions, then searches serving-size combinations to fit daily calorie and macro targets.
5. **Deterministic Validation Layer**: The backend validates the three-day plan, nutrition ranges, ingredient restrictions, and macro arithmetic before returning it.
6. **Next.js Dashboard**: The plan, daily totals, and calculated patient values are shown to the user.

> **Prototype data note:** The starter catalog covers Pakistan only. Ingredient values are approximate generic-food references informed by [USDA FoodData Central](https://fdc.nal.usda.gov/), whose data are public domain. The recipe portions and values in this prototype are estimates, not lab analysis of Pakistani recipes or clinical advice. USDA data are not Pakistan-specific, and condition-specific medical diets are not yet encoded; a qualified local nutrition professional should review the catalog before real-world use.

## Running Locally

Because this is a Next.js full-stack application with a Python backend mapped to `/api/*`, **you must run both Next.js and Uvicorn concurrently in local development**.

### 1. Set up Environment Variables
The default AI-provider mode uses keys configured in the root `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_key_here
OPENROUTER_API_KEY=your_openrouter_key
GROQ_API_KEY=your_groq_key
```

The optional catalog mode requires no AI-provider key. In the dashboard, set **Meal plan source** to **Local Pakistan catalog (test)**. It currently covers Pakistan only and uses approximate ingredient nutrition.

### 2. Start the Python Backend
Open a terminal and run:
```bash
python -m uvicorn api.index:app --reload --port 8000
```
This starts the backend on `http://127.0.0.1:8000`.

### 3. Start the Next.js Frontend
Open a *second* terminal and run:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application. (The Next.js `next.config.mjs` will proxy all `/api` calls directly to your Python backend running on port 8000).

## Deployment

Deploy seamlessly to Vercel. 
Vercel automatically detects the Next.js framework and uses the `vercel.json` configuration to map all `/api/(.*)` requests to the Python serverless function at `api/index.py`. No standalone backend hosting (like Render) is required!
