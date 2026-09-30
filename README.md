# ClimaDiet

ClimaDiet is an AI-powered clinical nutrition decision-support system. It generates culturally and climatically appropriate meal plans while strictly enforcing deterministic nutritional boundaries.

## Architecture

ClimaDiet operates on a strict deterministic validation architecture. The AI does NOT blindly calculate nutritional goals.

1. **Patient Intake**: User data (Age, Weight, Climate, Allergies, Goals).
2. **Deterministic Nutrition Engine**: A Python engine (`api/nutrition_math.py`) calculates BMR, TDEE, Target Calories, and strict Macro goals deterministically using the Mifflin-St Jeor equation.
3. **Weather Engine**: Open-Meteo fetches the 7-day forecast for the exact City/Country.
4. **Gemini AI Meal Generation**: Gemini receives the clinical targets, dietary restrictions, and weather context. It generates culturally and climatically appropriate meals that fit the mathematical constraints.
5. **Deterministic Validation Layer**: The Python backend computationally validates the AI output (checks exactly 21 meals, verifies calories are within 10% of target, checks macro addition, and scans for explicit allergens/dietary restrictions). If the AI fails, it is given an exact error trace and retries.
6. **Next.js Dashboard**: The validated plan and the clinical constraints are served to the user.

> **Note:** ClimaDiet does not rely on the LLM to calculate nutritional targets. Deterministic Python calculations establish the targets, while the LLM generates meals constrained by those targets. Generated plans are then validated before being shown to the user.

## Running Locally

Because this is a Next.js full-stack application with a Python backend mapped to `/api/*`, **you must run both Next.js and Uvicorn concurrently in local development**.

### 1. Set up Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_key_here
# Optional Fallbacks for 429 Limit exhaustion
OPENROUTER_API_KEY=your_openrouter_key
GROQ_API_KEY=your_groq_key
```

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