"use client";
import { useState } from "react";
import type { Meal } from "@/lib/mock";

const GRADIENTS = [
  "from-lime-900/60 to-neutral-900", "from-amber-900/60 to-neutral-900",
  "from-emerald-900/60 to-neutral-900", "from-orange-900/60 to-neutral-900",
];

/**
 * Shows meal.image (URL supplied by the backend). If it is missing or fails to load,
 * an illustrated placeholder (emoji on gradient) is shown instead so the layout never breaks.
 */
export default function MealImage({ meal, className = "", emojiSize = "text-5xl" }: { meal: Meal; className?: string; emojiSize?: string }) {
  const [failed, setFailed] = useState(false);
  const hasImg = !!meal.image && !failed;
  const g = GRADIENTS[parseInt(meal.id.replace(/\D/g, ""), 10) % GRADIENTS.length];
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${g} ${className}`}>
      {hasImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={meal.image!} alt={meal.name} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <div className={`grid h-full w-full place-items-center ${emojiSize}`} aria-label={meal.name} role="img">{meal.emoji ?? "🍽️"}</div>
      )}
    </div>
  );
}
