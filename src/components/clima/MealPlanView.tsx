"use client";
import { useState, useCallback } from "react";
import { CalendarDays, ChevronRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const go = useCallback((i: number) => { setOpen(i); const d = DAYS.indexOf(meals[i].day); if (d >= 0) setDayIdx(d); }, [meals]);
  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => open !== null && go((open - 1 + total) % total), [open, total, go]);
  const next = useCallback(() => open !== null && go((open + 1) % total), [open, total, go]);

  return (
    <div>
      {/* Top navigation: Day 1 - Day 7 */}
      <nav aria-label="Select day" className="sticky top-[4.5rem] z-20 -mx-5 mb-6 border-b border-white/10 bg-black/60 px-5 py-3 backdrop-blur-xl rounded-b-xl lg:-mx-0 lg:rounded-xl lg:border">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {DAYS.map((d, i) => {
            const on = i === dayIdx;
            return (
              <button key={d} onClick={() => setDayIdx(i)} aria-current={on ? "page" : undefined}
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
                <span className="relative z-10">Day {i + 1}</span>
                <span className={`relative z-10 text-[10px] font-medium uppercase tracking-wider ${on ? "text-neutral-800" : "text-neutral-500"}`}>{d.slice(0, 3)}</span>
              </button>
            );
          })}
        </div>
      </nav>

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
              <h3 className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl"><CalendarDays size={22} style={{ color: ACCENT }} /> Day {dayIdx + 1} <span className="text-white/20">|</span> {day}</h3>
              <p className="mt-1 text-xs text-neutral-400 font-medium">ClimaDiet{subtitle ? ` • ${subtitle}` : ""} • Target {tdee.toLocaleString()} kcal/day</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-semibold shadow-sm" style={{ color: ACCENT }}><ShieldCheck size={14} /> Clinically safe</span>
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
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {dayMeals.map((i, rowIdx) => {
                  const m = meals[i];
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: rowIdx * 0.05 }}
                      key={m.id} 
                      onClick={() => go(i)} 
                      className="group cursor-pointer border-b border-white/5 transition-colors hover:bg-white/[0.04] last:border-0"
                    >
                      <th scope="row" className="whitespace-nowrap px-4 py-3.5 text-sm font-bold text-white/90">
                        <span className="mr-2 inline-block rounded-md bg-white/10 px-2 py-1 text-xs">{SLOT_ICON[m.slot]}</span> 
                        {m.slot}
                      </th>
                      <td className="px-4 py-3.5">
                        <button onClick={(e) => { e.stopPropagation(); go(i); }} aria-label={`${m.slot}: ${m.name}. View details`}
                          className="flex items-center gap-3 text-left focus:outline-none">
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-2xl shadow-inner transition-transform group-hover:scale-110">{m.emoji ?? "🍽️"}</span>
                          <span className="text-[14px] font-semibold leading-snug text-neutral-100 group-hover:text-white">{m.name}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-white">{m.calories}</td>
                      <td className="px-4 py-3.5 text-right text-neutral-300">{m.protein}g</td>
                      <td className="px-4 py-3.5 text-right text-neutral-300">{m.carbs}g</td>
                      <td className="px-4 py-3.5 text-right text-neutral-300">{m.fat}g</td>
                      <td className="pr-4 text-right text-neutral-600 transition-colors group-hover:text-white"><ChevronRight size={18} className="ml-auto" /></td>
                    </motion.tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-white/[0.02] border-t border-white/10 font-bold text-white">
                  <td className="px-4 py-4" colSpan={2}>Day total</td>
                  <td className="px-4 py-4 text-right text-lg" style={{ color: ACCENT }}>{sum("calories").toLocaleString()}</td>
                  <td className="px-4 py-4 text-right">{sum("protein")}g</td>
                  <td className="px-4 py-4 text-right">{sum("carbs")}g</td>
                  <td className="px-4 py-4 text-right">{sum("fat")}g</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-neutral-500 font-medium">Tap any meal to view nutrition, AI insights, and recipe photos.</p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {open !== null && meals[open] && (
          <MealDetail meal={meals[open]} tdee={tdee} index={open} total={total} onClose={close} onPrev={prev} onNext={next} />
        )}
      </AnimatePresence>
    </div>
  );
}
