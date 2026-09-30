"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Soup } from "lucide-react";
import type { Meal } from "@/lib/mock";

const FALLBACK_URL = "https://image.pollinations.ai/prompt/";

function makeImageUrl(meal: Meal) {
  const isMoongDal = /moong|mung|mong/i.test(meal.name) && /dal|daal|lentil/i.test(meal.name);
  const detail = isMoongDal
    ? " A bowl of golden yellow split mung bean dal, visibly textured with lentils and cumin tempering, served with rice or roti; not green, not a smooth puree, not broccoli soup."
    : " The dish must clearly match its name and familiar real-world ingredients; do not substitute another dish.";
  const prompt = `Authentic home-cooked ${meal.name}.${detail} Realistic food photography, natural daylight, simple tableware, one dish centered, no text, no collage.`;
  return `${FALLBACK_URL}${encodeURIComponent(prompt)}?width=800&height=600&model=flux&nologo=true`;
}

export default function MealImage({
  meal,
  className = "",
  emojiSize = "text-5xl",
}: {
  meal: Meal;
  className?: string;
  emojiSize?: string;
}) {
  const sources = Array.from(new Set([meal.image, makeImageUrl(meal)].filter((url): url is string => Boolean(url))));
  const [sourceIndex, setSourceIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const imageUrl = sources[sourceIndex];
  const hasImage = Boolean(imageUrl);

  useEffect(() => {
    setSourceIndex(0);
    setLoaded(false);
  }, [meal.id]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface-2 ${className}`}>
      <AnimatePresence mode="wait">
        {hasImage ? (
          <motion.div
            key={`${meal.id}-${sourceIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {!loaded && (
              <div className="absolute inset-0 z-10 grid place-items-center bg-surface-2/80">
                <Loader2 className="h-7 w-7 animate-spin text-sage" aria-label="Loading food photo" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`Photo of ${meal.name}`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => {
                setLoaded(false);
                setSourceIndex((current) => current + 1);
              }}
              className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`${meal.id}-placeholder`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#f1eadc] to-[#e4e8dd] p-4 text-center text-forest"
            role="img"
            aria-label={`Food photo unavailable for ${meal.name}`}
          >
            <Soup className={emojiSize} strokeWidth={1.25} aria-hidden="true" />
            <span className="text-xs font-semibold">{meal.name}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
