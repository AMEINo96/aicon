"use client";
import { useState } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClinicalIntakeForm from "@/components/clima/ClinicalIntakeForm";
import MacroScorecard from "@/components/clima/MacroScorecard";
import MealPlanView from "@/components/clima/MealPlanView";
import { generatePlan, type PlanResponse, type IntakeData } from "@/lib/mock";
import { ACCENT } from "@/lib/theme";

export default function Dashboard() {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [place, setPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  const submit = async (d: IntakeData) => {
    setLoading(true);
    setPlan(await generatePlan(d));
    setPlace(d.location.split(" (")[0]);
    setKey((k) => k + 1);
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-neutral-100 selection:bg-lime-500/30">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold transition-transform hover:scale-105"><Leaf style={{ color: ACCENT }} /> ClimaDiet</Link>
          <span className="text-sm font-medium text-neutral-400">Clinical decision support</span>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-5 py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:sticky lg:top-24"
          >
            <ClinicalIntakeForm onSubmit={submit} loading={loading} />
          </motion.div>
          
          <div className="flex min-w-0 flex-col gap-8">
            <AnimatePresence mode="wait">
              {plan ? (
                <motion.div
                  key={`results-${key}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col gap-8"
                >
                  <MacroScorecard plan={plan} />
                  <MealPlanView meals={plan.meals} tdee={plan.tdee} subtitle={place} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel grid h-full min-h-[500px] place-items-center rounded-3xl p-10 text-center"
                >
                  <div className="max-w-md">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Leaf className="mx-auto mb-4" style={{ color: ACCENT }} size={48} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Your personalized plan awaits</h3>
                    <p className="text-base text-neutral-400">Fill in the patient intake on the left to generate an AI-powered meal plan perfectly tuned to their climate and background.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
