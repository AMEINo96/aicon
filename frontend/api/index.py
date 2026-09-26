from fastapi import FastAPI
from pydantic import BaseModel
import os
import joblib

app = FastAPI()

class StudentData(BaseModel):
    study_hours: float
    past_attendance: float
    quiz_scores: float

@app.get("/api/health")
def health():
    return {"status": "ok", "backend": "FastAPI on Vercel Serverless"}

@app.post("/api/predict")
def predict(data: StudentData):
    # Calculate prediction score
    study = data.study_hours
    att = data.past_attendance
    quiz = data.quiz_scores
    
    predicted_score = round((study * 2.5) + (att * 0.4) + (quiz * 0.35), 2)
    risk_level = "High Risk" if predicted_score < 60 else "Low Risk (On Track)"
    
    return {
        "impact_metric": predicted_score,
        "risk_level": risk_level
    }
