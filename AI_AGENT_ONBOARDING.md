# 🤖 AI AGENT ONBOARDING PROTOCOL

**ATTENTION ALL AI AGENTS:** If you are reading this file, you have been invited to assist a human developer on the "AICON" hackathon project. 

## 🎯 Project Goal
We are building an **AI-driven EdTech Dashboard** for the "AI RAPIDSPRINT" hackathon. The core theme is "Data in -> AI in the loop -> Impact out."
We take student data, feed it into a local Scikit-Learn model via FastAPI, and return an actionable "Impact Metric" / Risk Level to a Next.js frontend.

## 🛠 Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS. Styled using aesthetics inspired by **21st.dev** (glassmorphism, subtle borders, modern UI). Located in `/frontend`.
- **Backend**: FastAPI (Python), Scikit-Learn, Pandas. Located in `/backend`.
- **Model**: Local `.joblib` model predicting student performance.

## 🚦 Current State & Setup Instructions
The boilerplate is 100% complete and functional.

**To run the Backend:**
1. `cd backend`
2. Ensure you are using the virtual environment: `venv\Scripts\activate` (or Anaconda if the user prefers, they have Anaconda installed).
3. `uvicorn main:app --reload`
*Note: `generate_mock_data.py` has already been run. The model exists.*

**To run the Frontend:**
1. `cd frontend`
2. `npm install`
3. `npm run dev`

**Deployment:**
The `/frontend` folder is configured for immediate deployment on **Vercel**.
The backend can be deployed on Render, Railway, or Heroku. Ensure `NEXT_PUBLIC_BACKEND_URL` is updated in the Vercel environment variables.

## 🧑‍🤝‍🧑 Team Division (For the Humans)
If you are an AI assisting one of the 4-5 team members, here is the intended task division you should help them with:

1. **Member 1 (Frontend UI/UX - 21st.dev Specialist):** Focus on `frontend/app/page.tsx`. Integrate actual components from `21st.dev`. Enhance the form and results panel with animations.
2. **Member 2 (Backend / AI Model):** Focus on `backend/generate_mock_data.py` and `backend/main.py`. Upgrade the Scikit-learn model from dummy data to a real kaggle dataset. Add feature engineering.
3. **Member 3 (GenAI Integration):** Hook up the Google GenAI SDK (already in `requirements.txt`) to the `/predict` endpoint to generate a paragraph of textual advice based on the student's risk score.
4. **Member 4 (Data Pipeline/Analytics):** Add charts to the Next.js frontend (e.g., using Recharts) to visualize the dataset or the student's relative position in the class.
5. **Member 5 (DevOps/Pitch):** Handle the Vercel deployment, configure the backend hosting, and prepare the pitch deck based on the working prototype.

*As an AI, your job is to read this, understand the team member's specific role, and write code strictly within those boundaries to avoid merge conflicts!*
