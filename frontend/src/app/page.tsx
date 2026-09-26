"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [formData, setFormData] = useState({
    study_hours: 5,
    past_attendance: 85,
    quiz_scores: 75,
  });
  
  const [result, setResult] = useState<{impact_metric: number, risk_level: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const endpoint = backendUrl ? `${backendUrl}/predict` : '/api/predict';
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Failed to fetch prediction", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-6 selection:bg-zinc-800">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <div className="z-10 max-w-5xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 to-zinc-500">
            AICON EdTech
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide">
            Data in. AI in the loop. Impact out. 
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Input Form using Shadcn Components */}
          <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50 shadow-2xl text-zinc-100 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight text-zinc-100">Student Data</CardTitle>
              <CardDescription className="text-zinc-400">Input student performance parameters for AI risk analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="study_hours" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Weekly Study Hours (0-10)</Label>
                  <Input
                    id="study_hours"
                    type="number" step="0.1" name="study_hours"
                    value={formData.study_hours} onChange={handleChange}
                    className="bg-zinc-950/50 border-zinc-800 text-zinc-200 focus:ring-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="past_attendance" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Past Attendance (%)</Label>
                  <Input
                    id="past_attendance"
                    type="number" name="past_attendance"
                    value={formData.past_attendance} onChange={handleChange}
                    className="bg-zinc-950/50 border-zinc-800 text-zinc-200 focus:ring-zinc-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiz_scores" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Average Quiz Score (%)</Label>
                  <Input
                    id="quiz_scores"
                    type="number" name="quiz_scores"
                    value={formData.quiz_scores} onChange={handleChange}
                    className="bg-zinc-950/50 border-zinc-800 text-zinc-200 focus:ring-zinc-700"
                  />
                </div>
                <Button
                  type="submit" disabled={loading}
                  className="w-full bg-zinc-100 text-zinc-900 font-semibold py-3 px-4 rounded-xl hover:bg-white transition-all disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  {loading ? "Analyzing..." : "Generate AI Prediction"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Panel using Shadcn Components */}
          <Card className="bg-zinc-900/30 backdrop-blur-md border-zinc-800/30 flex flex-col justify-center items-center text-center p-8 text-zinc-100">
            {result ? (
              <div className="space-y-6 animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                <p className="text-sm text-zinc-400 uppercase tracking-widest font-semibold">Predicted Impact Metric</p>
                <div className="text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">
                  {result.impact_metric}
                </div>
                
                <Badge variant={result.risk_level.includes('High') ? "destructive" : "default"} className={`mt-6 px-5 py-2 text-sm font-semibold tracking-wide backdrop-blur-md ${
                  result.risk_level.includes('High') 
                  ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {result.risk_level}
                </Badge>
              </div>
            ) : (
              <div className="text-zinc-500 flex flex-col items-center space-y-4">
                <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p className="tracking-wide font-light">Awaiting model input...</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
