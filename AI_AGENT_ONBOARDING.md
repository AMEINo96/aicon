# ClimaDiet Agent Onboarding

Welcome to the ClimaDiet repository. This is an AI-powered clinical nutrition decision-support system that enforces strict deterministic rules (Mifflin-St Jeor calculations, hard validation bounds). 

## Repository Structure (Unified Vercel Monorepo)
- `/src/` and `/public/`: Contains the entire Next.js frontend application (React, Tailwind CSS).
- `/api/`: Contains the Python FastAPI backend.
  - `api/index.py`: Core API endpoints (Gemini integration, retry logic).
  - `api/nutrition_math.py`: Deterministic math engine (BMR, TDEE, macros).
  - `api/meal_validator.py`: Strict computational bounds checking (calories, macros, explicit allergens).
  - `api/weather_api.py`: Open-Meteo weather integrations.

## Local Development
To run this project locally, you must run both servers concurrently. The Next.js config (`next.config.mjs`) automatically proxies all `/api/*` requests to port `8000`.

**Terminal 1 (Backend):**
```bash
python -m uvicorn api.index:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment (Vercel)
This project is configured natively for Vercel. Vercel automatically detects the Next.js framework, and `vercel.json` tells Vercel's Python Serverless Runtime to handle `/api/(.*)` requests using `api/index.py`. No separate backend hosting is required in production!

## Strict Rules for AI Editing
1. **Never bypass the Deterministic Engine**: The BMR/TDEE math must always be done in Python before Gemini is invoked.
2. **Allergen Checking**: The backend checks for exact word-boundary allergen matches across both meal names and ingredient arrays.
3. **UI/UX Guidelines**: The UI follows a strict "Editorial/Clinical" aesthetic. Warm ivory backgrounds, forest green accents, and no neon colors. Real food photography is required (no emojis).
