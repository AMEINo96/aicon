"use client";
import { useState } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";
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
    <div className="min-h-screen bg-[#0b0b0d] text-neutral-100">
      <header className="border-b border-white/10 bg-[#0b0b0d]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold"><Leaf style={{ color: ACCENT }} /> ClimaDiet</Link>
          <span className="text-sm text-neutral-400">Clinical decision support</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-8 px-5 py-10">
        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <ClinicalIntakeForm onSubmit={submit} loading={loading} />
          <section>
            {plan ? (
              <div key={key}><MacroScorecard plan={plan} /></div>
            ) : (
              <div className="grid h-full min-h-[420px] place-items-center rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
                <div><Leaf className="mx-auto mb-3" style={{ color: ACCENT }} size={40} /><h3 className="text-xl font-bold text-white">Your plan appears here</h3>
                  <p className="mt-1 max-w-sm text-sm text-neutral-400">Fill in the patient intake and generate a plan tuned to their climate and background.</p></div>
              </div>
            )}
          </section>
        </div>
        {plan && <div key={`p${key}`} className="fade-up"><MealPlanView meals={plan.meals} tdee={plan.tdee} subtitle={place} /></div>}
      </main>
    </div>
  );
}
