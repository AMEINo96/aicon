"use client";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame, Lightbulb, HeartPulse, Sparkles, Check } from "lucide-react";
import type { Meal } from "@/lib/mock";
import { ACCENT } from "@/lib/theme";
import Ring from "./Ring";
import MealImage from "./MealImage";

export default function MealDetail({
  meal, tdee, index, total, onClose, onPrev, onNext,
}: { meal: Meal; tdee: number; index: number; total: number; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose, onPrev, onNext]);

  const kcal = meal.protein * 4 + meal.carbs * 4 + meal.fat * 9;
  const pct = (g: number, k: number) => Math.round(((g * k) / kcal) * 100);
  const dayShare = Math.round((meal.calories / tdee) * 1000) / 10;
  const macros = [
    { label: "Protein", g: meal.protein, p: pct(meal.protein, 4), color: ACCENT },
    { label: "Fat", g: meal.fat, p: pct(meal.fat, 9), color: "#f5a742" },
    { label: "Carbs", g: meal.carbs, p: pct(meal.carbs, 4), color: "#7dd3a8" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose} role="dialog" aria-modal="true" aria-label={meal.name}>
      <div key={meal.id} onClick={(e) => e.stopPropagation()}
        className="fade-up relative flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-[#141416] shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-[2rem] sm:border sm:border-white/10">
        {/* Scrollable content (photo + details) */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {/* Hero image */}
        <div className="relative shrink-0">
          <MealImage meal={meal} className="aspect-[4/3] w-full" emojiSize="text-8xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-black/40" />
          <button onClick={onClose} aria-label="Back to planner"
            className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-black">
            <ChevronLeft size={22} />
          </button>
          <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-neutral-200 backdrop-blur">
            {meal.day} · {meal.slot}
          </span>
        </div>

        <div className="-mt-8 space-y-4 rounded-t-3xl px-5 pb-6 pt-2">
          <h2 className="relative text-center text-2xl font-bold text-white">{meal.name}</h2>

          {/* Calories card */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div>
              <p className="text-sm text-neutral-400">Total Calories</p>
              <p className="mt-1 text-5xl font-medium text-white">{meal.calories}<span className="ml-2 text-lg text-neutral-400">Kcal</span></p>
            </div>
            <Ring pct={dayShare} size={84} stroke={7} color={ACCENT}>
              <div><Flame size={18} className="mx-auto text-orange-400" /><span className="text-[11px] font-semibold text-white">{dayShare}%</span></div>
            </Ring>
          </div>
          <p className="-mt-2 text-center text-xs text-neutral-500">Ring = share of your {tdee.toLocaleString()} kcal daily target</p>

          {/* Macro rings */}
          <div className="grid grid-cols-3 gap-3">
            {macros.map((mc) => (
              <div key={mc.label} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-3">
                <Ring pct={mc.p} size={62} stroke={5} color={mc.color}>
                  <div className="leading-tight"><b className="block text-sm text-white">{mc.p}%</b><span className="text-[10px] text-neutral-400">{mc.g}g</span></div>
                </Ring>
                <span className="text-sm text-neutral-300">{mc.label}</span>
              </div>
            ))}
          </div>

          {/* Why AI suggested */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide" style={{ color: ACCENT }}><Sparkles size={16} /> Why the AI suggested this</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-200">{meal.why}</p>
          </section>

          {/* How it helps */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide" style={{ color: ACCENT }}><HeartPulse size={16} /> How it will help you</h3>
            <ul className="mt-3 space-y-2.5">
              {meal.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[15px] text-neutral-200">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full" style={{ background: ACCENT }}><Check size={13} className="text-neutral-900" strokeWidth={3} /></span>{b}
                </li>
              ))}
            </ul>
          </section>

          <p className="flex items-start gap-2 text-xs text-neutral-500"><Lightbulb size={14} className="mt-0.5 shrink-0" />Decision support only. Your nutritionist confirms the final plan.</p>

        </div>
        </div>

        {/* Navigation: always pinned at the bottom, never scrolls out of view */}
        <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-white/10 bg-[#141416] px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button onClick={onPrev} className="flex items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.06] py-3 text-sm font-semibold text-white transition hover:bg-white/10"><ChevronLeft size={16} /> Previous</button>
          <span className="px-2 text-xs text-neutral-500">{index + 1} / {total}</span>
          <button onClick={onNext} className="flex items-center justify-center gap-1 rounded-full py-3 text-sm font-bold text-neutral-900 transition hover:brightness-110" style={{ background: ACCENT }}>Next <ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}
