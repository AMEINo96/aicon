"use client";
import { useState } from "react";
import { type PlanResponse, type Meal } from "@/lib/mock";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import MealImage from "./MealImage";

export default function MealPlanView({ plan }: { plan: PlanResponse }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const days = plan.meal_plan.days;
  const currentDay = days[selectedDay];

  return (
    <div className="flex flex-col gap-5">
      <section className="clinical-card" aria-label={`Planned nutrition totals for ${currentDay.day_label}`}>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="editorial-title text-lg">Planned daily intake</h3>
            <p className="mt-1 text-xs text-muted-foreground">Estimated totals from all meals for {currentDay.day_label}</p>
          </div>
          <span className="text-xs text-muted-foreground">Targets shown underneath</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Calories", actual: `${currentDay.daily_totals.calories} kcal`, target: `${plan.nutrition.target_calories} kcal` },
            { label: "Protein", actual: `${currentDay.daily_totals.protein_g} g`, target: `${plan.nutrition.protein_g} g` },
            { label: "Carbohydrates", actual: `${currentDay.daily_totals.carbs_g} g`, target: `${plan.nutrition.carbs_g} g` },
            { label: "Fat", actual: `${currentDay.daily_totals.fat_g} g`, target: `${plan.nutrition.fat_g} g` },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-surface-2/60 p-3">
              <div className="text-xs font-semibold text-muted-foreground">{item.label}</div>
              <div className="mt-1 font-mono text-xl font-bold text-forest">{item.actual}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Target: {item.target}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DAY SELECTOR */}
      <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
        {days.map((day, idx) => {
          const isSelected = selectedDay === idx;
          
          return (
            <button
              key={day.date}
              onClick={() => setSelectedDay(idx)}
              aria-pressed={isSelected}
              className={`flex-shrink-0 flex flex-col items-center justify-center min-w-24 min-h-16 px-4 rounded-xl border transition-all ${
                isSelected 
                  ? "bg-forest border-forest text-white shadow-md" 
                  : "bg-surface border-border text-muted-foreground hover:border-forest/30"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider">{day.day_label}</span>
              <span className={`mt-1 text-xs ${isSelected ? "text-white/75" : "text-muted-foreground"}`}>{day.date}</span>
            </button>
          );
        })}
      </div>

      {/* MEAL CARDS (Editorial Layout) */}
      <div className="grid md:grid-cols-3 gap-4">
        <AnimatePresence mode="wait">
          {currentDay.meals.map((meal, idx) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer flex flex-col bg-surface rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all"
              onClick={() => setSelectedMeal(meal)}
            >
              <div className="relative">
                <MealImage meal={meal} className="aspect-[4/3] w-full rounded-none border-0 shadow-none" />
                <div className="absolute top-3 left-3 rounded-full border border-white/80 bg-forest px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                  {meal.slot}
                </div>
              </div>
              
              <div className="flex flex-1 flex-col p-4">
                <h4 className="editorial-title text-xl mb-1">{meal.name}</h4>
                <div className="text-sm font-mono text-muted-foreground mb-4">{meal.calories} kcal · {meal.protein}g protein</div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {meal.why}
                </p>

                <div className="flex items-center text-xs font-bold uppercase tracking-wider text-forest group-hover:text-sage transition-colors mt-auto pt-4 border-t border-border">
                  View details <ChevronRight size={14} className="ml-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MEAL DETAIL MODAL */}
      <AnimatePresence>
        {selectedMeal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row relative"
            >
              <button 
                onClick={() => setSelectedMeal(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <X size={20} />
              </button>

              <div className="md:w-1/2 aspect-square md:aspect-auto relative bg-surface-2">
                <MealImage meal={selectedMeal} className="absolute inset-0 h-full w-full rounded-none border-0 shadow-none" />
              </div>

              <div className="md:w-1/2 p-8 md:p-10 flex flex-col">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{selectedMeal.slot}</div>
                <h2 className="editorial-title text-3xl mb-4">{selectedMeal.name}</h2>
                
                <div className="flex gap-4 mb-8 pb-6 border-b border-border">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Calories</div>
                    <div className="font-mono text-lg text-forest">{selectedMeal.calories}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Protein</div>
                    <div className="font-mono text-lg text-forest">{selectedMeal.protein}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Carbs</div>
                    <div className="font-mono text-lg text-forest">{selectedMeal.carbs}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Fat</div>
                    <div className="font-mono text-lg text-forest">{selectedMeal.fat}g</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-forest mb-2">Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeal.ingredients?.map((ing, i) => (
                      <span key={i} className="text-xs font-medium px-2 py-1 bg-surface-2 rounded-md border border-border text-muted-foreground">
                        {ing}
                      </span>
                    )) || <span className="text-sm text-muted-foreground">No ingredients listed.</span>}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-forest mb-2">Why this meal?</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedMeal.why}</p>
                </div>

                <div className="mt-auto pt-6">
                  <ul className="space-y-2">
                    {selectedMeal.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-success mt-0.5">•</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
