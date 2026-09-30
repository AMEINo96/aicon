"use client";
import { useState } from "react";
import { type PlanResponse, type Meal } from "@/lib/mock";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X } from "lucide-react";

export default function MealPlanView({ plan }: { plan: PlanResponse }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const days = plan.plan;
  const currentDay = days[selectedDay];

  return (
    <div className="flex flex-col gap-8">
      {/* 7-DAY NAVIGATION STRIP */}
      <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-2">
        {days.map((day, idx) => {
          const isSelected = selectedDay === idx;
          const dayTemp = plan.weather.forecast[idx]?.temperature_max || "--";
          
          return (
            <button
              key={idx}
              onClick={() => setSelectedDay(idx)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-xl border transition-all ${
                isSelected 
                  ? "bg-forest border-forest text-white shadow-md" 
                  : "bg-surface border-border text-muted hover:border-forest/30"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider mb-1">Day {idx + 1}</span>
              <span className={`font-mono text-xl ${isSelected ? "text-white" : "text-forest"}`}>{dayTemp}°</span>
            </button>
          );
        })}
      </div>

      {/* MEAL CARDS (Editorial Layout) */}
      <div className="grid md:grid-cols-3 gap-6">
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
              <div className="relative aspect-[4/3] bg-surface-2 overflow-hidden">
                <img 
                  src={meal.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800"} 
                  alt={meal.name}
                  className="w-full h-full object-cover image-zoom-hover"
                />
                <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-forest border border-border/50 shadow-sm">
                  {meal.slot}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h4 className="editorial-title text-xl mb-1">{meal.name}</h4>
                <div className="text-sm font-mono text-muted mb-4">{meal.calories} kcal · {meal.protein}g protein</div>
                
                <p className="text-sm text-muted line-clamp-2 mb-4 flex-1">
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
                <img 
                  src={selectedMeal.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800"} 
                  alt={selectedMeal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:w-1/2 p-8 md:p-10 flex flex-col">
                <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">{selectedMeal.slot}</div>
                <h2 className="editorial-title text-3xl mb-4">{selectedMeal.name}</h2>
                
                <div className="flex gap-4 mb-8 pb-6 border-b border-border">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted">Calories</div>
                    <div className="font-mono text-lg text-forest">{selectedMeal.calories}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted">Protein</div>
                    <div className="font-mono text-lg text-forest">{selectedMeal.protein}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted">Carbs</div>
                    <div className="font-mono text-lg text-forest">{selectedMeal.carbs}g</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted">Fat</div>
                    <div className="font-mono text-lg text-forest">{selectedMeal.fat}g</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-forest mb-2">Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMeal.ingredients?.map((ing, i) => (
                      <span key={i} className="text-xs font-medium px-2 py-1 bg-surface-2 rounded-md border border-border text-muted">
                        {ing}
                      </span>
                    )) || <span className="text-sm text-muted">No ingredients listed.</span>}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-forest mb-2">Why this meal?</h4>
                  <p className="text-sm text-muted leading-relaxed">{selectedMeal.why}</p>
                </div>

                <div className="mt-auto pt-6">
                  <ul className="space-y-2">
                    {selectedMeal.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted">
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
