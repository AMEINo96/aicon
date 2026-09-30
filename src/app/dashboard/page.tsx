"use client";
import { useState } from "react";
import Link from "next/link";
import { Leaf, Users, LayoutDashboard, Settings, Activity, ClipboardList, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClinicalIntakeForm from "@/components/clima/ClinicalIntakeForm";
import MacroScorecard from "@/components/clima/MacroScorecard";
import MealPlanView from "@/components/clima/MealPlanView";
import { generatePlan, type PlanResponse, type IntakeData } from "@/lib/mock";

export default function Dashboard() {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (d: IntakeData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePlan(d);
      setPlan(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg text-text">
      {/* NUTRITIONIST SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-surface-2 p-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-forest mb-12">
          <Leaf className="text-sage" /> ClimaDiet
        </Link>
        <nav className="flex-1 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-4 px-3">Workspace</div>
          <button className="flex w-full items-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-forest shadow-sm border border-border">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted hover:bg-white/50 hover:text-text transition-colors">
            <PlusCircle size={18} /> New Patient
          </button>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted hover:bg-white/50 hover:text-text transition-colors">
            <Users size={18} /> Patients
          </button>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted hover:bg-white/50 hover:text-text transition-colors">
            <ClipboardList size={18} /> Meal Plans
          </button>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted hover:bg-white/50 hover:text-text transition-colors">
            <Activity size={18} /> Insights
          </button>
        </nav>
        <div className="pt-6 border-t border-border mt-auto">
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted hover:bg-white/50 hover:text-text transition-colors">
            <Settings size={18} /> Settings
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6 lg:px-10">
          <h1 className="text-lg font-bold text-forest">Nutritionist Workspace</h1>
          <div className="h-8 w-8 rounded-full bg-sage/20 border border-sage/30 flex items-center justify-center text-xs font-bold text-forest">
            DR
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-6xl grid gap-10 xl:grid-cols-[400px_1fr] items-start">
            
            {/* INTAKE COLUMN */}
            <div className="flex flex-col gap-6 xl:sticky xl:top-10">
              <div>
                <h2 className="editorial-title text-2xl mb-1">New Plan Generation</h2>
                <p className="text-sm text-muted">Enter patient signals and local climate context.</p>
              </div>
              
              {error && (
                <div className="rounded-md border border-heat/20 bg-heat/10 p-4 text-sm font-medium text-heat">
                  {error}
                </div>
              )}
              
              <ClinicalIntakeForm onSubmit={submit} loading={loading} />
            </div>
            
            {/* RESULTS COLUMN */}
            <div className="flex flex-col gap-10 min-w-0">
              <AnimatePresence mode="wait">
                {plan ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-10"
                  >
                    <MacroScorecard plan={plan} />
                    <MealPlanView plan={plan} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-[600px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-2/50 text-center p-8"
                  >
                    <ClipboardList size={48} className="text-muted/30 mb-4" />
                    <h3 className="text-lg font-bold text-forest mb-2">No active plan</h3>
                    <p className="text-sm text-muted max-w-sm">
                      Submit the clinical intake form to run the deterministic math engine and generate a validated, climate-aware meal plan.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
