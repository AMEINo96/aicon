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
  const [plannerMode, setPlannerMode] = useState<IntakeData["planner_mode"]>("ai");
  const [loading, setLoading] = useState(false);
  const [isTakingLong, setIsTakingLong] = useState(false);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const submit = async (d: IntakeData) => {
    setLoading(true);
    setIsTakingLong(false);
    setError(null);
    setCurrentDay(d.plan_day_number || 1);
    const timeout = setTimeout(() => setIsTakingLong(true), 8000);
    try {
      const result = await generatePlan(d);
      setPlan(result);
      if (result.meal_plan?.days?.[0]) {
        const generatedMeals = result.meal_plan.days[0].meals.map((m: { name: string }) => m.name);
        const nextDayProfile = { ...d, plan_day_number: (d.plan_day_number || 1) + 1, past_meals: [...(d.past_meals || []), ...generatedMeals] };
        localStorage.setItem("patientProfile", JSON.stringify(nextDayProfile));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed.";
      setError(msg);
      setPlan(null); // Clear plan on error to show the error state
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* NUTRITIONIST SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-surface-2 p-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-forest mb-12">
          <Leaf className="text-sage" /> ClimaDiet
        </Link>
        <nav className="flex-1 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4 px-3">Workspace</div>
          <button className="flex w-full items-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-forest shadow-sm border border-border">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/50 hover:text-foreground transition-colors">
            <PlusCircle size={18} /> New Patient
          </button>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/50 hover:text-foreground transition-colors">
            <Users size={18} /> Patients
          </button>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/50 hover:text-foreground transition-colors">
            <ClipboardList size={18} /> Meal Plans
          </button>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/50 hover:text-foreground transition-colors">
            <Activity size={18} /> Insights
          </button>
        </nav>
        <div className="pt-6 border-t border-border mt-auto">
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/50 hover:text-foreground transition-colors">
            <Settings size={18} /> Settings
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-6 py-3 lg:px-10">
          <h1 className="text-lg font-bold text-forest">Nutritionist Workspace</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-border bg-surface-2 p-1" role="group" aria-label="Choose meal plan generation method">
              <button
                type="button"
                aria-pressed={plannerMode === "ai"}
                disabled={loading}
                onClick={() => { setPlannerMode("ai"); setError(null); }}
                className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${plannerMode === "ai" ? "bg-forest text-white shadow-sm" : "text-muted-foreground hover:text-forest"}`}
              >
                Generative AI
              </button>
              <button
                type="button"
                aria-pressed={plannerMode === "catalog"}
                disabled={loading}
                onClick={() => { setPlannerMode("catalog"); setError(null); }}
                className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${plannerMode === "catalog" ? "bg-forest text-white shadow-sm" : "text-muted-foreground hover:text-forest"}`}
              >
                Our meal catalog
              </button>
            </div>
            <div className="hidden h-8 w-8 items-center justify-center rounded-full border border-sage/30 bg-sage/20 text-xs font-bold text-forest sm:flex">
              DR
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-6xl grid gap-10 xl:grid-cols-[400px_1fr] items-start">
            
            {/* INTAKE COLUMN */}
            <div className="flex flex-col gap-6 xl:sticky xl:top-10">
              <div>
                <h2 className="editorial-title text-2xl mb-1">New Plan Generation</h2>
                <p className="text-sm text-muted-foreground">Enter patient signals and local climate context.</p>
              </div>
              
              {error && (
                <div className="rounded-md border border-heat/20 bg-heat/10 p-4 text-sm font-medium text-heat">
                  {error}
                </div>
              )}
              
              <ClinicalIntakeForm onSubmit={submit} loading={loading} plannerMode={plannerMode} onInputChange={() => setError(null)} />
            </div>
            
            {/* RESULTS COLUMN */}
            <div className="flex flex-col gap-10 min-w-0">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-[600px] flex-col items-center justify-center rounded-2xl border border-border/50 bg-white/40 backdrop-blur-md shadow-sm text-center p-8 animate-pulse"
                  >
                    <div className="h-12 w-12 rounded-full border-4 border-forest border-t-transparent animate-spin mb-6"></div>
                    <h3 className="text-xl font-bold text-forest mb-2">Generating your day {currentDay} plan</h3>
                    <p className="text-sm text-forest/70 max-w-sm h-5 transition-all">
                      {isTakingLong ? "It is taking longer than usual, please wait..." : ""}
                    </p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-[600px] flex-col items-center justify-center rounded-2xl border border-dashed border-heat/30 bg-heat/5 text-center p-8"
                  >
                    <div className="text-6xl mb-4">??</div>
                    <h3 className="text-lg font-bold text-heat mb-2">Sorry, could not generate plan</h3>
                    <p className="text-sm text-heat/70 max-w-sm">
                      {error}
                    </p>
                  </motion.div>
                ) : plan ? (
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
                    <ClipboardList size={48} className="text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-bold text-forest mb-2">No active plan</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
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
