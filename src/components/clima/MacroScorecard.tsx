"use client";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import type { PlanResponse } from "@/lib/mock";
import { ACCENT } from "@/lib/theme";

const MACROS = [
  { k: "protein_g", label: "Protein", kcal: 4, color: ACCENT },
  { k: "carbs_g", label: "Carbs", kcal: 4, color: "#f5a742" },
  { k: "fat_g", label: "Fat", kcal: 9, color: "#7dd3a8" },
] as const;

export default function MacroScorecard({ plan }: { plan: PlanResponse }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 100); return () => clearTimeout(t); }, []);
  
  const n = plan.nutrition;
  const total = MACROS.reduce((s, m) => s + (n[m.k as keyof typeof n] as number) * m.kcal, 0);
  const R = 62, C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-8">
      <div className="flex flex-col items-center gap-8 sm:flex-row">
        <div className="relative h-44 w-44 shrink-0">
          <svg viewBox="0 0 160 160" className="-rotate-90">
            <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="14" />
            {MACROS.map((m) => {
              const val = n[m.k as keyof typeof n] as number;
              const frac = (val * m.kcal) / total;
              const el = (
                <circle key={m.k} cx="80" cy="80" r={R} fill="none" stroke={m.color} strokeWidth="14" strokeLinecap="butt"
                  strokeDasharray={`${on ? frac * C - 3 : 0} ${C}`} strokeDashoffset={-offset * C}
                  style={{ transition: "stroke-dasharray 1.1s cubic-bezier(.2,.7,.2,1)" }} />
              );
              offset += frac;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <Flame className="mx-auto text-orange-400" size={20} />
              <b className="block text-3xl leading-none text-white">{n.target_calories}</b>
              <span className="text-xs text-neutral-400">kcal (Target)</span>
            </div>
          </div>
        </div>
        <div className="w-full space-y-4">
          <div className="mb-2 border-b border-white/5 pb-2 text-sm text-neutral-400 flex justify-between">
            <span>Maintenance (TDEE):</span> <strong className="text-white">{n.tdee} kcal</strong>
          </div>
          {MACROS.map((m) => {
            const val = n[m.k as keyof typeof n] as number;
            const pct = Math.round(((val * m.kcal) / total) * 100);
            return (
              <div key={m.k}>
                <div className="mb-1 flex justify-between text-sm"><b className="text-white">{m.label}</b><span className="text-neutral-400">{val} g A {pct}%</span></div>
                <div className="h-2.5 rounded-full bg-white/10">
                  <div className="h-full rounded-full" style={{ width: on ? `${pct}%` : 0, background: m.color, transition: "width 1.1s cubic-bezier(.2,.7,.2,1)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-4 py-2 border border-white/5">
            <span className="text-neutral-400">BMI:</span>
            <span className="font-bold text-white">{n.bmi?.toFixed(1) || "-"}</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-lime-400">{n.bmi_category || "Normal"}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-4 py-2 border border-white/5">
            <span className="text-neutral-400">BMR:</span>
            <span className="font-bold text-white">{n.bmr || "-"} kcal</span>
          </div>
        </div>
        
        {n.constraints_applied?.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Constraints Applied by AI</div>
            <div className="flex flex-wrap gap-2">
              {n.constraints_applied.map(c => (
                <span key={c} className="rounded-lg bg-lime-500/10 px-3 py-1 text-xs font-medium text-lime-300 border border-lime-500/20 shadow-[0_0_10px_rgba(132,204,22,0.1)]">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
