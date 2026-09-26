import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const study_hours = Number(body.study_hours) || 0;
    const past_attendance = Number(body.past_attendance) || 0;
    const quiz_scores = Number(body.quiz_scores) || 0;
    
    // ML Prediction Calculation matching Linear Regression model
    const rawScore = (study_hours * 2.5) + (past_attendance * 0.4) + (quiz_scores * 0.35);
    const score = Number(Math.min(100, Math.max(0, rawScore)).toFixed(2));
    
    const risk_level = score < 60 ? "High Risk" : "Low Risk (On Track)";

    return NextResponse.json({
      impact_metric: score,
      risk_level: risk_level,
      status: "success"
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to compute AI prediction" }, { status: 400 });
  }
}
