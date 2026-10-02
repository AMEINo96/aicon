"use client";
import { useState, useEffect } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { type IntakeData } from "@/lib/mock";

const ETHNICITIES = ["South Asian", "Middle Eastern", "East Asian", "Mediterranean", "Western", "African", "Latin American"];
const CONDITIONS_PRESET = ["Diabetes", "Hypertension", "PCOS"];

const toLocalDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const today = toLocalDateInputValue(new Date());
const lastForecastDate = (() => {
  const date = new Date();
  date.setDate(date.getDate() + 15);
  return toLocalDateInputValue(date);
})();

export default function ClinicalIntakeForm({ onSubmit, loading, plannerMode, onInputChange }: { onSubmit: (d: IntakeData) => void; loading: boolean; plannerMode: IntakeData["planner_mode"]; onInputChange: () => void }) {
  const [d, setD] = useState<IntakeData>({
    planner_mode: "ai",
    age: 32, weight: 85, height: 175, gender: "male", activity: "sedentary",
    goal: "Lose weight", goal_amount: "5kg", ethnicity: "South Asian",
    conditions: [], allergies: [], dietary_restrictions: [],
    plan_day_number: 1, past_meals: [], city: "Lahore", country: "Pakistan", start_date: today, end_date: ""
  });

  const [customCond, setCustomCond] = useState("");
  const [customDiet, setCustomDiet] = useState("");
  const [customAllergy, setCustomAllergy] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("patientProfile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) setD({ ...parsed, start_date: today });
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("patientProfile", JSON.stringify(d));
  }, [d]);

  const set = (k: keyof IntakeData, v: string | number | string[]) => {
    setD({ ...d, [k]: v });
    onInputChange();
  };

  const toggleArray = (key: "conditions" | "allergies" | "dietary_restrictions", val: string) => {
    if (d[key].includes(val)) set(key, d[key].filter(x => x !== val));
    else set(key, [...d[key], val]);
  };

  const addCustom = (val: string, key: "conditions" | "allergies" | "dietary_restrictions", setter: (v: string) => void) => {
    if (val.trim() && !d[key].includes(val.trim())) {
      set(key, [...d[key], val.trim()]);
      setter("");
    }
  };

  const includePending = (items: string[], draft: string) => {
    const value = draft.trim();
    return value && !items.includes(value) ? [...items, value] : items;
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const submitted = {
        ...d,
        planner_mode: plannerMode,
        conditions: includePending(d.conditions, customCond),
        dietary_restrictions: includePending(d.dietary_restrictions, customDiet),
        allergies: includePending(d.allergies, customAllergy),
      };
      setD(submitted);
      setCustomCond("");
      setCustomDiet("");
      setCustomAllergy("");
      onSubmit(submitted);
    }} className="flex flex-col gap-8 pb-10">
      
      {/* PATIENT */}
      <section className="bg-surface rounded-xl border border-border p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-forest mb-4 border-b border-border pb-2">1. PATIENT PROFILE</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="clinical-label">Age</label><input className="clinical-input" type="number" value={d.age} onChange={e => set("age", +e.target.value)} /></div>
          <div>
            <label className="clinical-label">Gender</label>
            <select className="clinical-input" value={d.gender} onChange={e => set("gender", e.target.value)}>
              <option value="male">Male</option><option value="female">Female</option>
            </select>
          </div>
          <div><label className="clinical-label">Weight (kg)</label><input className="clinical-input" type="number" value={d.weight} onChange={e => set("weight", +e.target.value)} /></div>
          <div><label className="clinical-label">Height (cm)</label><input className="clinical-input" type="number" value={d.height} onChange={e => set("height", +e.target.value)} /></div>
        </div>
      </section>

      {/* LIFESTYLE */}
      <section className="bg-surface rounded-xl border border-border p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-forest mb-4 border-b border-border pb-2">2. LIFESTYLE & GOALS</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="clinical-label">Activity Level</label>
            <select className="clinical-input" value={d.activity} onChange={e => set("activity", e.target.value)}>
              <option value="sedentary">Sedentary (office job)</option>
              <option value="lightly active">Lightly Active</option>
              <option value="moderately active">Moderately Active</option>
              <option value="very active">Very Active</option>
              <option value="athlete">Athlete</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="clinical-label">Primary Goal</label><input className="clinical-input" type="text" value={d.goal} onChange={e => set("goal", e.target.value)} /></div>
            <div><label className="clinical-label">Target (Optional)</label><input className="clinical-input" type="text" value={d.goal_amount} onChange={e => set("goal_amount", e.target.value)} /></div>
          </div>
        </div>
      </section>

      {/* HEALTH */}
      <section className="bg-surface rounded-xl border border-border p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-forest mb-4 border-b border-border pb-2">3. CLINICAL & DIETARY</h3>
        <div className="flex flex-col gap-5">
          {/* Conditions */}
          <div>
            <label className="clinical-label">Conditions</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {CONDITIONS_PRESET.map(c => (
                <button type="button" key={c} onClick={() => toggleArray("conditions", c)} 
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${d.conditions.includes(c) ? "bg-forest text-white border-forest" : "bg-surface-2 text-muted-foreground border-transparent hover:border-border"}`}>
                  {c}
                </button>
              ))}
              {d.conditions.filter(c => !CONDITIONS_PRESET.includes(c)).map(c => (
                <button type="button" key={c} onClick={() => toggleArray("conditions", c)} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-forest text-white border border-forest flex items-center gap-1">
                  {c} <X size={12} />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="clinical-input" type="text" placeholder="Add condition..." value={customCond} onChange={e => { setCustomCond(e.target.value); onInputChange(); }} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom(customCond, "conditions", setCustomCond))} />
              <button type="button" onClick={() => addCustom(customCond, "conditions", setCustomCond)} className="bg-surface-2 border border-border px-3 rounded-md text-muted-foreground hover:text-foreground"><Plus size={16}/></button>
            </div>
          </div>
          
          {/* Dietary Restrictions */}
          <div>
            <label className="clinical-label">Dietary Restrictions</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {d.dietary_restrictions.map(r => (
                <button type="button" key={r} onClick={() => toggleArray("dietary_restrictions", r)} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-forest text-white border border-forest flex items-center gap-1">
                  {r} <X size={12} />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="clinical-input" type="text" placeholder="e.g. Halal, Vegan..." value={customDiet} onChange={e => { setCustomDiet(e.target.value); onInputChange(); }} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom(customDiet, "dietary_restrictions", setCustomDiet))} />
              <button type="button" onClick={() => addCustom(customDiet, "dietary_restrictions", setCustomDiet)} className="bg-surface-2 border border-border px-3 rounded-md text-muted-foreground hover:text-foreground"><Plus size={16}/></button>
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="clinical-label">Explicit Allergies</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {d.allergies.map(a => (
                <button type="button" key={a} onClick={() => toggleArray("allergies", a)} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-heat text-white border border-heat flex items-center gap-1">
                  {a} <X size={12} />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="clinical-input" type="text" placeholder="e.g. Peanuts, Shellfish..." value={customAllergy} onChange={e => { setCustomAllergy(e.target.value); onInputChange(); }} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom(customAllergy, "allergies", setCustomAllergy))} />
              <button type="button" onClick={() => addCustom(customAllergy, "allergies", setCustomAllergy)} className="bg-surface-2 border border-border px-3 rounded-md text-muted-foreground hover:text-foreground"><Plus size={16}/></button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEXT */}
      <section className="bg-surface rounded-xl border border-border p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-forest mb-4 border-b border-border pb-2">4. CLIMATE & CULTURE</h3>
        <div className="mb-4">
          <label className="clinical-label" htmlFor="plan-start-date">Plan start date</label>
          <input
            id="plan-start-date"
            className="clinical-input"
            type="date"
            value={d.start_date}
            min={today}
            max={lastForecastDate}
            onChange={e => set("start_date", e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">Choose a date from today through the next 15 days, based on the available weather forecast.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="clinical-label">City</label><input className="clinical-input" type="text" value={d.city} onChange={e => set("city", e.target.value)} /></div>
          <div><label className="clinical-label">Country</label><input className="clinical-input" type="text" value={d.country} onChange={e => set("country", e.target.value)} /></div>
        </div>
        <div>
          <label className="clinical-label">Culture / Ethnicity</label>
          <select className="clinical-input" value={d.ethnicity} onChange={e => set("ethnicity", e.target.value)}>
            {ETHNICITIES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </section>

      {/* SUBMIT */}
      <div className="text-center text-sm font-medium text-forest">
        Day {d.plan_day_number} of your journey
      </div>
      <button disabled={loading} className="w-full bg-forest text-white py-3.5 rounded-md font-semibold flex items-center justify-center gap-2 transition-all hover:bg-opacity-90 disabled:opacity-70">
        {loading ? <><Loader2 className="animate-spin" size={18} /> Generating your today's meal plan...</> : "Generate your today's meal plan"}
      </button>
    </form>
  );
}
