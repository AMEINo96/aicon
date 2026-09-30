"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { Meal } from "@/lib/mock";

const GRADIENTS = [
  "from-lime-900/40 to-neutral-900/80", "from-amber-900/40 to-neutral-900/80",
  "from-emerald-900/40 to-neutral-900/80", "from-orange-900/40 to-neutral-900/80",
];

export default function MealImage({ meal, className = "", emojiSize = "text-5xl" }: { meal: Meal; className?: string; emojiSize?: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Create a beautiful prompt for pollinations
  const encodedPrompt = encodeURIComponent(`A cinematic, highly detailed food photography shot of ${meal.name}, healthy ${meal.slot} meal, dark moody background, studio lighting, 4k resolution`);
  const imageUrl = meal.image || `https://pollinations.ai/p/${encodedPrompt}?width=800&height=600&model=flux&nologo=true`;
  const hasImg = !failed;
  
  const g = GRADIENTS[parseInt(meal.id.replace(/\D/g, ""), 10) % GRADIENTS.length];
  
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${g} rounded-2xl border border-white/10 shadow-lg ${className}`}>
      <AnimatePresence mode="wait">
        {hasImg ? (
          <motion.div
            key="image-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl} 
              alt={meal.name} 
              loading="lazy" 
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)} 
              className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`} 
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 flex items-center justify-center ${emojiSize}`}
            aria-label={meal.name}
            role="img"
          >
            {meal.emoji ?? "🍽️"}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
