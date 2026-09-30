"use client";
import { useState, useCallback } from "react";
import { CalendarDays, ChevronRight, ShieldCheck } from "lucide-react";
import { DAYS, SLOTS, type Meal } from "@/lib/mock";
import { ACCENT } from "@/lib/theme";
import MealDetail from "./MealDetail";

const SLOT_ICON: Record<string, string> = { Breakfast: "🌅", Lunch: "☀️", Snack: "🍵", Dinner: "🌙" };

export default function MealPlanView({ meals, tdee, subtitle }: { meals: Meal[]; tdee: number; subtitle?: string }) {
  const [dayIdx, setDayIdx] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const total = meals.length;

  const day = DAYS[dayIdx];
  const dayMeals = SLOTS.map((s) => meals.findIndex((m) => m.day === day && m.slot === s)).filter((i) => i >= 0);
  const sum = (k: "calories" | "protein" | "carbs" | "fat") => dayMeals.reduce((t, i) => t + meals[i][k], 0);

  // Move through all meals from the detail screen and keep the day tab in sync.
  const go = useCallback((i: number) => { setOpen(i); const d = DAYS.indexOf(meals[i].day); if (d >= 0) setDayIdx(d); }, [meals]);
  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => open !== null && go((open - 1 + total) % total), [open, total, go]);
  const next = useCallback(() => open !== null && go((open + 1) % total), [open, total, go]);

  return (
    <div>
      {/* Top navigation: Day 1 - Day 7 */}
      <nav aria-label="Select day" className="sticky top-0 z-20 -mx-5 mb-4 border-b border-white/10 bg-[#0b0b0d]/90 px-5 py-3 backdrop-blur">
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {DAYS.map((d, i) => {
            const on = i === dayIdx;
            return (
              <button key={d} onClick={() => setDayIdx(i)} aria-current={on ? "page" : undefined}
                className={`flex min-w-[76px] flex-1 flex-col items-center rounded-2xl border px-3 py-2 text-sm font-bold transition ${on ? "border-transparent text-neutral-900" : "border-white/10 bg-white/[0.04] text-neutral-300 hover:bg-white/10"}`}
                style={on ? { background: ACCENT } : undefined}>
                Day {i + 1}
                <span className={`text-[10px] font-medium ${on ? "text-neutral-800" : "text-neutral-500"}`}>{d.slice(0, 3)}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Screenshot area: header + one day's table */}
      <div id="weekly-plan" className="rounded-3xl border border-white/10 bg-[#111113] p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl"><CalendarDays size={22} style={{ color: ACCENT }} /> Day {dayIdx + 1} · {day}</h3>
            <p className="mt-0.5 text-xs text-neutral-400">ClimaDiet{subtitle ? ` · ${subtitle}` : ""} · Target {tdee.toLocaleString()} kcal/day</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold" style={{ color: ACCENT }}><ShieldCheck size={14} /> Clinically safe</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-white/[0.06] text-xs uppercase tracking-wide text-neutral-400">
                <th className="px-3 py-3 font-semibold">Meal</th>
                <th className="px-3 py-3 font-semibold">Dish</th>
                <th className="px-3 py-3 text-right font-semibold">Kcal</th>
                <th className="px-3 py-3 text-right font-semibold">Protein</th>
                <th className="px-3 py-3 text-right font-semibold">Carbs</th>
                <th className="px-3 py-3 text-right font-semibold">Fat</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {dayMeals.map((i) => {
                const m = meals[i];
                return (
                  <tr key={m.id} onClick={() => go(i)} className="cursor-pointer border-t border-white/10 transition hover:bg-white/[0.06]">
                    <th scope="row" className="whitespace-nowrap px-3 py-3 text-sm font-bold text-white">{SLOT_ICON[m.slot]} {m.slot}</th>
                    <td className="px-3 py-3">
                      <button onClick={(e) => { e.stopPropagation(); go(i); }} aria-label={`${m.slot}: ${m.name}. View details`}
                        className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300/60">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-2xl">{m.emoji ?? "🍽️"}</span>
                        <span className="text-[13px] font-semibold leading-snug text-neutral-100">{m.name}</span>
                      </button>
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-white">{m.calories}</td>
                    <td className="px-3 py-3 text-right text-neutral-300">{m.protein}g</td>
                    <td className="px-3 py-3 text-right text-neutral-300">{m.carbs}g</td>
                    <td className="px-3 py-3 text-right text-neutral-300">{m.fat}g</td>
                    <td className="pr-3 text-neutral-600"><ChevronRight size={16} /></td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10 bg-white/[0.06] font-bold text-white">
                <td className="px-3 py-3" colSpan={2}>Day total</td>
                <td className="px-3 py-3 text-right" style={{ color: ACCENT }}>{sum("calories").toLocaleString()}</td>
                <td className="px-3 py-3 text-right">{sum("protein")}g</td>
                <td className="px-3 py-3 text-right">{sum("carbs")}g</td>
                <td className="px-3 py-3 text-right">{sum("fat")}g</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-3 text-center text-xs text-neutral-500">Tap any meal to see its photo, nutrition and why it was chosen for you.</p>
      </div>

      {open !== null && meals[open] && (
        <MealDetail meal={meals[open]} tdee={tdee} index={open} total={total} onClose={close} onPrev={prev} onNext={next} />
      )}
    </div>
  );
}
