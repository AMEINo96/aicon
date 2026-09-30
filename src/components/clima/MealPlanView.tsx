"use client";
import { useState } from "react";
import { CalendarDays, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { PlanResponse, DayPlan, Meal } from "@/lib/mock";
import { ACCENT } from "@/lib/theme";
import MealDetail from "./MealDetail";

const SLOT_ICON: Record<string, string> = { Breakfast: "☕", Lunch: "🥗", Dinner: "🍗" };

export default function MealPlanView({ plan, subtitle }: { plan: PlanResponse; subtitle?: string }) {
  const [dayIdx, setDayIdx] = useState(0);
  const [openMeal, setOpenMeal] = useState<Meal | null>(null);

  const days = plan.meal_plan.days;
  const currentDay: DayPlan = days[dayIdx];
  const tdee = plan.nutrition.target_calories;
  const validation = plan.meal_plan.overall_validation;

  // Flatten meals for the MealDetail carousel navigation
  const allMeals = days.flatMap(d => d.meals);
  const openIdx = openMeal ? allMeals.findIndex(m => m.id === openMeal.id) : -1;
  const goPrev = () => { if (openIdx >= 0) setOpenMeal(allMeals[(openIdx - 1 + allMeals.length) % allMeals.length]); };
  const goNext = () => { if (openIdx >= 0) setOpenMeal(allMeals[(openIdx + 1) % allMeals.length]); };

  return (
    <div>
      {/* Top navigation: Day 1 - Day 7 */}
      <nav aria-label="Select day" className="sticky top-[4.5rem] z-20 -mx-5 mb-6 border-b border-white/10 bg-black/60 px-5 py-3 backdrop-blur-xl rounded-b-xl lg:-mx-0 lg:rounded-xl lg:border">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {days.map((d, i) => {
            const on = i === dayIdx;
            return (
              <button key={d.date} onClick={() => setDayIdx(i)} aria-current={on ? "page" : undefined}
                className={`relative flex min-w-[80px] flex-1 flex-col items-center rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${on ? "text-neutral-900" : "text-neutral-300 hover:text-white hover:bg-white/5"}`}
              >
                {on && (
                  <motion.div
                    layoutId="day-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: ACCENT }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{d.day_label}</span>
                <span className={`relative z-10 text-[10px] uppercase tracking-wider ${on ? "text-neutral-700" : "text-neutral-500"}`}>{d.date}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Day Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={dayIdx}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
          id="weekly-plan" 
          className="glass-panel p-4 sm:p-7 rounded-3xl"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
                <CalendarDays size={22} style={{ color: ACCENT }} /> {currentDay.day_label} <span className="text-white/20">|</span> {currentDay.date}
              </h3>
              <p className="mt-1 text-xs text-neutral-400 font-medium">ClimaDiet{subtitle ? ` - ${subtitle}` : ""} - Target {tdee.toLocaleString()} kcal/day</p>
              {currentDay.weather && (
                <p className="mt-1 text-xs text-blue-300">
                  Weather Forecast: High {currentDay.weather.temperature_max}°C | Low {currentDay.weather.temperature_min}°C
                </p>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm ${validation.valid ? 'bg-lime-500/10 border-lime-500/20 text-lime-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                <ShieldCheck size={14} /> 
                {validation.valid ? "Decision-support validation complete" : "Validation Failed"}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-neutral-400">
                  <th className="px-4 py-4 font-semibold">Meal</th>
                  <th className="px-4 py-4 font-semibold">Dish</th>
                  <th className="px-4 py-4 text-right font-semibold">Kcal</th>
                  <th className="px-4 py-4 text-right font-semibold">Protein</th>
                  <th className="px-4 py-4 text-right font-semibold">Carbs</th>
                  <th className="px-4 py-4 text-right font-semibold">Fat</th>
                </tr>
              </thead>
              <tbody>
                {currentDay.meals.map((m, rowIdx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIdx * 0.05 }}
                    key={m.id} 
                    onClick={() => setOpenMeal(m)} 
                    className="group cursor-pointer border-b border-white/5 transition-colors hover:bg-white/[0.04] last:border-0"
                  >
                    <th scope="row" className="whitespace-nowrap px-4 py-3.5 text-sm font-bold text-white/90">
                      <span className="mr-2 inline-block rounded-md bg-white/10 px-2 py-1 text-xs">{SLOT_ICON[m.slot] || "🍲"}</span> 
                      {m.slot}
                    </th>
                    <td className="px-4 py-3.5 text-neutral-300 group-hover:text-white transition-colors">
                      <div className="flex items-center gap-2">
                        {m.emoji} <span className="truncate max-w-[200px]">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium text-white/90">{m.calories}</td>
                    <td className="px-4 py-3.5 text-right text-neutral-400">{m.protein}g</td>
                    <td className="px-4 py-3.5 text-right text-neutral-400">{m.carbs}g</td>
                    <td className="px-4 py-3.5 text-right text-neutral-400">{m.fat}g</td>
                  </motion.tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-white/[0.02]">
                  <th colSpan={2} className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Validated Daily Totals</th>
                  <td className="px-4 py-4 text-right font-bold text-white" style={{ color: ACCENT }}>{currentDay.daily_totals.calories}</td>
                  <td className="px-4 py-4 text-right font-bold text-white/90">{currentDay.daily_totals.protein_g}g</td>
                  <td className="px-4 py-4 text-right font-bold text-white/90">{currentDay.daily_totals.carbs_g}g</td>
                  <td className="px-4 py-4 text-right font-bold text-white/90">{currentDay.daily_totals.fat_g}g</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {openMeal && (
          <MealDetail 
            meal={openMeal} 
            tdee={tdee}
            index={openIdx}
            total={allMeals.length}
            onClose={() => setOpenMeal(null)}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
