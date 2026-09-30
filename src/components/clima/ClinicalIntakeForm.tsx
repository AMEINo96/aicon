"use client";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import type { IntakeData } from "@/lib/mock";
import { ACCENT } from "@/lib/theme";

const G = ACCENT;
const CONDITIONS = ["Diabetes", "Hypertension", "PCOS", "Thyroid", "High cholesterol", "Kidney disease", "None"];
const ETHNICITIES = ["South Asian - Punjabi", "South Asian - Pashtun", "South Asian - Sindhi", "South Asian - Other", "Middle Eastern", "African", "East Asian", "European", "Other"];
const ACTIVITY = ["Sedentary", "Lightly active", "Moderately active", "Very active", "Athlete"];

const field = "glass-input w-full rounded-xl px-4 py-3.5 text-sm text-white [&>option]:bg-neutral-900";
const Label = ({ children }: { children: React.ReactNode }) => <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-neutral-400">{children}</label>;

export default function ClinicalIntakeForm({ onSubmit, loading }: { onSubmit: (d: IntakeData) => void; loading: boolean }) {
  const [d, setD] = useState<IntakeData>({
    age: 28, weight: 78, height: 172, gender: "Male", activity: ACTIVITY[2],
    conditions: [], city: "Lahore", country: "Pakistan", ethnicity: ETHNICITIES[0],
    goal: "Lose weight", goal_amount: "5kg", dietary_restrictions: [],
    start_date: new Date().toISOString().split("T")[0], end_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  });
  const set = <K extends keyof IntakeData>(k: K, v: IntakeData[K]) => setD((p) => ({ ...p, [k]: v }));
  const num = (k: "age" | "weight" | "height") => (e: React.ChangeEvent<HTMLInputElement>) => set(k, parseFloat(e.target.value) || 0);
  const toggle = (c: string) =>
    set("conditions", c === "None" ? [] : d.conditions.includes(c) ? d.conditions.filter((x) => x !== c) : [...d.conditions, c]);

  const [customCondition, setCustomCondition] = useState("");
  const addCustomCondition = () => {
    if (customCondition.trim() && !d.conditions.includes(customCondition.trim())) {
      set("conditions", [...d.conditions, customCondition.trim()]);
      setCustomCondition("");
    }
  };

  const [customDiet, setCustomDiet] = useState("");
  const addCustomDiet = () => {
    if (customDiet.trim() && !d.dietary_restrictions.includes(customDiet.trim())) {
      set("dietary_restrictions", [...d.dietary_restrictions, customDiet.trim()]);
      setCustomDiet("");
    }
  };
  const removeDiet = (r: string) => set("dietary_restrictions", d.dietary_restrictions.filter(x => x !== r));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(d); }} className="fade-up space-y-7 rounded-3xl glass-panel p-6 sm:p-8">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Patient Intake</h2>
        <p className="text-sm text-neutral-400 mt-1">Region and background shape what we recommend.</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label>Age</Label><input className={field} type="number" value={d.age} onChange={num("age")} /></div>
        <div><Label>Weight (kg)</Label><input className={field} type="number" value={d.weight} onChange={num("weight")} /></div>
        <div><Label>Height (cm)</Label><input className={field} type="number" value={d.height} onChange={num("height")} /></div>
      </div>
      <div>
        <Label>Gender</Label>
        <div className="grid grid-cols-2 gap-3">
          {["Male", "Female"].map((g) => (
            <button type="button" key={g} onClick={() => set("gender", g)}
              className={`rounded-xl border py-3 text-sm font-semibold transition-all duration-300 ${d.gender === g ? "border-lime-400/50 bg-lime-400/10 text-lime-300 shadow-[0_0_15px_rgba(163,230,53,0.15)]" : "border-white/10 bg-black/20 text-neutral-300 hover:bg-white/5 hover:border-white/20"}`}>{g}</button>
          ))}
        </div>
      </div>
      <div><Label>Activity level</Label>
        <select className={field} value={d.activity} onChange={(e) => set("activity", e.target.value)}>{ACTIVITY.map((a) => <option key={a}>{a}</option>)}</select></div>
      <div>
        <Label>Clinical conditions</Label>
        <div className="flex flex-wrap gap-2.5 mb-3">
          {CONDITIONS.map((c) => {
            const on = c === "None" ? d.conditions.length === 0 : d.conditions.includes(c);
            return <button type="button" key={c} onClick={() => toggle(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ${on ? "border-lime-400 bg-lime-400 text-neutral-900 shadow-[0_0_10px_rgba(163,230,53,0.3)]" : "border-white/10 bg-black/20 text-neutral-300 hover:border-white/30 hover:bg-white/5"}`}>{c}</button>;
          })}
          {d.conditions.filter(c => !CONDITIONS.includes(c)).map(c => (
            <button type="button" key={c} onClick={() => toggle(c)}
              className="rounded-full border border-lime-300 bg-lime-300/10 px-4 py-1.5 text-sm font-medium text-lime-200 transition hover:bg-lime-300/20">{c} ✕</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={`${field} py-2`} type="text" placeholder="Other condition..." value={customCondition} onChange={(e) => setCustomCondition(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomCondition())} />
          <button type="button" onClick={addCustomCondition} className="rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10">Add</button>
        </div>
      </div>
      <div>
        <Label>Dietary restrictions</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {d.dietary_restrictions.map(r => (
            <button type="button" key={r} onClick={() => removeDiet(r)} className="rounded-full border border-lime-300 bg-lime-300/10 px-4 py-1.5 text-sm font-medium text-lime-200 transition hover:bg-lime-300/20">{r} ✕</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={`${field} py-2`} type="text" placeholder="e.g. Halal, Vegan..." value={customDiet} onChange={(e) => setCustomDiet(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomDiet())} />
          <button type="button" onClick={addCustomDiet} className="rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10">Add</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>City</Label><input className={field} type="text" value={d.city} onChange={(e) => set("city", e.target.value)} /></div>
        <div><Label>Country</Label><input className={field} type="text" value={d.country} onChange={(e) => set("country", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Goal</Label><input className={field} type="text" placeholder="e.g. Lose weight" value={d.goal} onChange={(e) => set("goal", e.target.value)} /></div>
        <div><Label>Target</Label><input className={field} type="text" placeholder="e.g. 5kg" value={d.goal_amount} onChange={(e) => set("goal_amount", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Start Date</Label><input className={field} type="date" value={d.start_date} onChange={(e) => set("start_date", e.target.value)} /></div>
        <div><Label>End Date</Label><input className={field} type="date" value={d.end_date} onChange={(e) => set("end_date", e.target.value)} /></div>
      </div>
      <div><Label>Ethnic / cultural background</Label>
        <select className={field} value={d.ethnicity} onChange={(e) => set("ethnicity", e.target.value)}>{ETHNICITIES.map((a) => <option key={a}>{a}</option>)}</select></div>
      <button disabled={loading} className="glass-button flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-bold text-neutral-900 transition-all hover:brightness-110 disabled:opacity-70 disabled:hover:scale-100" style={{ background: G }}>
        {loading ? (
          <><Loader2 className="animate-spin" size={20} /> Analyzing patient profile…</>
        ) : (
          <><Sparkles size={20} /> Generate optimal plan</>
        )}
      </button>
    </form>
  );
}
