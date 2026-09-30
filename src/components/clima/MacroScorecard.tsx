"use client";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import type { PlanResponse } from "@/lib/mock";
import { ACCENT } from "@/lib/theme";

const MACROS = [
  { k: "protein", label: "Protein", kcal: 4, color: ACCENT },
  { k: "carbs", label: "Carbs", kcal: 4, color: "#f5a742" },
  { k: "fat", label: "Fat", kcal: 9, color: "#7dd3a8" },
] as const;

export default function MacroScorecard({ plan }: { plan: PlanResponse }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 100); return () => clearTimeout(t); }, []);
  const total = MACROS.reduce((s, m) => s + plan[m.k] * m.kcal, 0);
  const R = 62, C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-8">
      <div className="flex flex-col items-center gap-8 sm:flex-row">
        <div className="relative h-44 w-44 shrink-0">
          <svg viewBox="0 0 160 160" className="-rotate-90">
            <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="14" />
            {MACROS.map((m) => {
              const frac = (plan[m.k] * m.kcal) / total;
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
            <div><Flame className="mx-auto text-orange-400" size={20} /><b className="block text-3xl leading-none text-white">{plan.tdee}</b><span className="text-xs text-neutral-400">kcal / day (TDEE)</span></div>
          </div>
        </div>
        <div className="w-full space-y-4">
          {MACROS.map((m) => {
            const pct = Math.round(((plan[m.k] * m.kcal) / total) * 100);
            return (
              <div key={m.k}>
                <div className="mb-1 flex justify-between text-sm"><b className="text-white">{m.label}</b><span className="text-neutral-400">{plan[m.k]} g · {pct}%</span></div>
                <div className="h-2.5 rounded-full bg-white/10">
                  <div className="h-full rounded-full" style={{ width: on ? `${pct}%` : 0, background: m.color, transition: "width 1.1s cubic-bezier(.2,.7,.2,1)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
