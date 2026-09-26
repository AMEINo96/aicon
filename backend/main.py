from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from model_loader import get_prediction

load_dotenv()

app = FastAPI(title="AI RAPIDSPRINT - Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudentData(BaseModel):
    study_hours: float
    past_attendance: float
    quiz_scores: float

@app.get("/")
def read_root():
    return {"status": "Backend is running!", "ai_ready": True}

@app.post("/predict")
async def predict_performance(data: StudentData):
    features = [data.study_hours, data.past_attendance, data.quiz_scores]
    predicted_score = get_prediction(features)
    risk_level = "High Risk" if predicted_score < 60 else "Low Risk (On Track)"
    
    return {
        "impact_metric": predicted_score,
        "risk_level": risk_level,
    }
