"use client";
import { type PlanResponse } from "@/lib/mock";
import { Target, ShieldCheck } from "lucide-react";

export default function MacroScorecard({ plan }: { plan: PlanResponse }) {
  const { nutrition, patient, weather } = plan;
  const targets = nutrition;
  const constraints_applied = nutrition.constraints_applied;

  return (
    <div className="flex flex-col gap-6">
      {/* TOP METRIC ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="clinical-card !p-4 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Target Calories</div>
          <div className="text-2xl font-mono font-bold text-forest">{targets.target_calories} <span className="text-sm font-sans text-muted-foreground">kcal</span></div>
        </div>
        <div className="clinical-card !p-4 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Target Protein</div>
          <div className="text-2xl font-mono font-bold text-forest">{targets.protein_g} <span className="text-sm font-sans text-muted-foreground">g</span></div>
        </div>
        <div className="clinical-card !p-4 flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Base TDEE</div>
          <div className="text-2xl font-mono font-bold text-muted-foreground">{targets.tdee} <span className="text-sm font-sans">kcal</span></div>
        </div>
        <div className="clinical-card !p-4 flex flex-col justify-between border-l-4 border-l-climate">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Local Climate</div>
          <div className="text-2xl font-mono font-bold text-forest flex items-center gap-1">
            {weather.forecast[0]?.temperature_max || "--"}°C <span className="text-sm font-sans text-muted-foreground">{weather.location}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* NUTRITION & PATIENT PANEL */}
        <div className="clinical-card md:col-span-2 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <h3 className="editorial-title text-lg flex items-center gap-2">
              <Target size={18} className="text-sage" /> Clinical Targets
            </h3>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-surface-2 px-3 py-1 rounded-full">
              {patient.goal}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">BMI</div>
              <div className="font-mono font-semibold">{targets.bmi} ({targets.bmi_category})</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">BMR</div>
              <div className="font-mono font-semibold">{targets.bmr} kcal</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Carbs</div>
              <div className="font-mono font-semibold">{targets.carbs_g} g</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Fat</div>
              <div className="font-mono font-semibold">{targets.fat_g} g</div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Patient Profile</div>
            <div className="flex flex-wrap gap-2 text-sm text-forest">
              <span className="bg-surface-2 px-2.5 py-1 rounded-md border border-border">Age {patient.age}</span>
              <span className="bg-surface-2 px-2.5 py-1 rounded-md border border-border">{patient.gender}</span>
              <span className="bg-surface-2 px-2.5 py-1 rounded-md border border-border">{patient.weight}kg / {patient.height}cm</span>
              {constraints_applied?.map((c, i) => (
                <span key={i} className="bg-surface-2 px-2.5 py-1 rounded-md border border-border">{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* WHY THIS PLAN PANEL */}
        <div className="clinical-card bg-surface-2/50 border-forest/10 flex flex-col">
          <h3 className="editorial-title text-lg flex items-center gap-2 mb-4">
            <ShieldCheck size={18} className="text-success" /> Why this plan?
          </h3>
          <ul className="space-y-4 flex-1">
            <li className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 w-4 h-4 rounded-full bg-success/20 text-success flex items-center justify-center text-[10px] font-bold">✓</div>
              <div><span className="font-semibold text-forest block">Nutrition targets calculated</span> Deterministic Mifflin-St Jeor equation.</div>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 w-4 h-4 rounded-full bg-success/20 text-success flex items-center justify-center text-[10px] font-bold">✓</div>
              <div><span className="font-semibold text-forest block">Climate considered</span> Meals adjusted for local weather conditions.</div>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 w-4 h-4 rounded-full bg-success/20 text-success flex items-center justify-center text-[10px] font-bold">✓</div>
              <div><span className="font-semibold text-forest block">Local foods prioritized</span> Matches cultural and regional availability.</div>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 w-4 h-4 rounded-full bg-success/20 text-success flex items-center justify-center text-[10px] font-bold">✓</div>
              <div><span className="font-semibold text-forest block">Validation passed</span> Ingredients checked against known allergens and synonyms. *Requires human review to guarantee zero cross-contamination.*</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
