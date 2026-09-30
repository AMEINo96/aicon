"use client";

import { type PlanResponse } from "@/lib/mock";
import { Activity, HeartPulse, Target } from "lucide-react";

export default function MacroScorecard({ plan }: { plan: PlanResponse }) {
  const { nutrition, patient, weather } = plan;
  const metrics = [
    { label: "BMI", value: nutrition.bmi.toFixed(1), detail: nutrition.bmi_category, icon: Activity },
    { label: "BMR", value: `${nutrition.bmr}`, detail: "kcal at rest", icon: HeartPulse },
    { label: "Maintenance (TDEE)", value: `${nutrition.tdee}`, detail: "kcal per day", icon: Activity },
    { label: "Calorie goal", value: `${nutrition.target_calories}`, detail: "kcal per day", icon: Target },
    { label: "Protein goal", value: `${nutrition.protein_g} g`, detail: "per day", icon: Target },
    { label: "Carbohydrate goal", value: `${nutrition.carbs_g} g`, detail: "per day", icon: Target },
    { label: "Fat goal", value: `${nutrition.fat_g} g`, detail: "per day", icon: Target },
  ];

  return (
    <div className="flex flex-col gap-4">
      <section className="clinical-card" aria-labelledby="calculated-summary-title">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 id="calculated-summary-title" className="editorial-title text-xl">Calculated for this patient</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {patient.age} years · {patient.gender} · {patient.weight} kg · {patient.height} cm · {patient.goal}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Local climate</div>
            <div className="font-semibold text-forest">
              {weather.forecast[0]?.temperature_max ?? "—"}°C · {weather.location}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {metrics.slice(0, 4).map(({ label, value, detail, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-border bg-surface-2/60 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Icon size={14} className="text-sage" /> {label}
              </div>
              <div className="mt-2 font-mono text-xl font-bold text-forest">{value}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{detail}</div>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {metrics.slice(4).map(({ label, value, detail, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-border bg-surface-2/60 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Icon size={14} className="text-sage" /> {label}
              </div>
              <div className="mt-2 font-mono text-xl font-bold text-forest">{value}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{detail}</div>
            </div>
          ))}
        </div>

        {(patient.conditions.length > 0 || patient.dietary_restrictions.length > 0 || patient.allergies.length > 0) && (
          <div className="mt-4 border-t border-border pt-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Profile constraints</div>
            <div className="flex flex-wrap gap-2">
              {[...patient.conditions, ...patient.dietary_restrictions, ...patient.allergies].map((item, index) => (
                <span key={`${item}-${index}`} className="rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-forest">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
