"use client";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import type { IntakeData } from "@/lib/mock";
import { ACCENT } from "@/lib/theme";

const G = ACCENT;
const CONDITIONS = ["Diabetes", "Hypertension", "PCOS", "Thyroid", "High cholesterol", "Kidney disease", "None"];
const LOCATIONS = ["Abbottabad, Pakistan (mild, 22°C)", "Karachi, Pakistan (hot humid, 34°C)", "Lahore, Pakistan (hot, 40°C)", "Islamabad, Pakistan (warm, 30°C)", "London, UK (cold, 8°C)", "Dubai, UAE (very hot, 42°C)"];
const ETHNICITIES = ["South Asian - Punjabi", "South Asian - Pashtun", "South Asian - Sindhi", "South Asian - Other", "Middle Eastern", "African", "East Asian", "European", "Other"];
const ACTIVITY = ["Sedentary", "Lightly active", "Moderately active", "Very active", "Athlete"];

const field = "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-lime-300 focus:ring-4 focus:ring-lime-300/10 [&>option]:bg-neutral-900";
const Label = ({ children }: { children: React.ReactNode }) => <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-400">{children}</label>;

export default function ClinicalIntakeForm({ onSubmit, loading }: { onSubmit: (d: IntakeData) => void; loading: boolean }) {
  const [d, setD] = useState<IntakeData>({
    age: 28, weight: 78, height: 172, gender: "Male", activity: ACTIVITY[2],
    conditions: [], location: LOCATIONS[2], ethnicity: ETHNICITIES[0],
  });
  const set = <K extends keyof IntakeData>(k: K, v: IntakeData[K]) => setD((p) => ({ ...p, [k]: v }));
  const num = (k: "age" | "weight" | "height") => (e: React.ChangeEvent<HTMLInputElement>) => set(k, parseFloat(e.target.value) || 0);
  const toggle = (c: string) =>
    set("conditions", c === "None" ? [] : d.conditions.includes(c) ? d.conditions.filter((x) => x !== c) : [...d.conditions, c]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(d); }} className="fade-up space-y-6 rounded-3xl border border-white/10 bg-[#111113] p-7">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Patient intake</h2>
        <p className="text-sm text-neutral-500">Region and background shape what we recommend.</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label>Age</Label><input className={field} type="number" value={d.age} onChange={num("age")} /></div>
        <div><Label>Weight (kg)</Label><input className={field} type="number" value={d.weight} onChange={num("weight")} /></div>
        <div><Label>Height (cm)</Label><input className={field} type="number" value={d.height} onChange={num("height")} /></div>
      </div>
      <div>
        <Label>Gender</Label>
        <div className="grid grid-cols-2 gap-2">
          {["Male", "Female"].map((g) => (
            <button type="button" key={g} onClick={() => set("gender", g)}
              className={`rounded-xl border py-3 text-sm font-semibold transition ${d.gender === g ? "border-lime-300 bg-lime-300/10 text-lime-200" : "border-white/10 text-neutral-300 hover:bg-white/5"}`}>{g}</button>
          ))}
        </div>
      </div>
      <div><Label>Activity level</Label>
        <select className={field} value={d.activity} onChange={(e) => set("activity", e.target.value)}>{ACTIVITY.map((a) => <option key={a}>{a}</option>)}</select></div>
      <div>
        <Label>Clinical conditions</Label>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((c) => {
            const on = c === "None" ? d.conditions.length === 0 : d.conditions.includes(c);
            return <button type="button" key={c} onClick={() => toggle(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${on ? "border-lime-300 bg-lime-300 text-neutral-900" : "border-white/10 text-neutral-300 hover:border-lime-300/50"}`}>{c}</button>;
          })}
        </div>
      </div>
      <div><Label>Climate location</Label>
        <select className={field} value={d.location} onChange={(e) => set("location", e.target.value)}>{LOCATIONS.map((a) => <option key={a}>{a}</option>)}</select></div>
      <div><Label>Ethnic / cultural background</Label>
        <select className={field} value={d.ethnicity} onChange={(e) => set("ethnicity", e.target.value)}>{ETHNICITIES.map((a) => <option key={a}>{a}</option>)}</select></div>
      <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-bold text-neutral-900 shadow-lg transition hover:scale-[1.01] active:scale-[.99] disabled:opacity-70" style={{ background: G }}>
        {loading ? <><Loader2 className="animate-spin" size={18} /> Building plan…</> : <><Sparkles size={18} /> Generate plan</>}
      </button>
    </form>
  );
}
