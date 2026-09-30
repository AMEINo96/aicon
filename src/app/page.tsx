import type React from "react";
import Link from "next/link";
import { ACCENT } from "@/lib/theme";
import {
  Thermometer, MapPin, Users, HeartPulse, Sun, ChefHat, ShieldCheck, Droplets, Calculator,
  Globe, Utensils, Stethoscope, ChevronDown, Leaf, ClipboardList,
} from "lucide-react";

const G = ACCENT; // accent lime

const personal = [
  { t: "Climate-aware", d: "40°C in Lahore is not 8°C in London", i: Thermometer, bg: "bg-white/[0.05]" },
  { t: "Region-aware", d: "Foods that are local, available and affordable", i: MapPin, bg: "bg-white/[0.05]" },
  { t: "Culture-aware", d: "Respects ethnic and cultural eating habits", i: Users, bg: "bg-white/[0.05]" },
  { t: "Condition-safe", d: "Checked against diabetes, BP, PCOS and more", i: HeartPulse, bg: "bg-white/[0.05]" },
];
const CARD_VISUALS: React.ReactNode[] = [
  <div key="a" className="flex h-full flex-col justify-center gap-2 text-sm">
    {[["Lahore · 40°C", "Cooling & hydrating"], ["London · 8°C", "Warm & filling"]].map(([a, b]) => (
      <div key={a} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2"><b>{a}</b><span className="text-neutral-500">{b}</span></div>
    ))}
  </div>,
  <div key="b" className="flex h-full flex-wrap content-center gap-2 text-sm">
    {["Daal", "Daliya", "Sattu", "Raita", "Chana", "Roti"].map((f) => <span key={f} className="rounded-full bg-white/10 px-3 py-1.5 font-medium">{f}</span>)}
  </div>,
  <div key="c" className="flex h-full flex-col justify-center gap-2 text-sm">
    {["Diabetes: low GI only", "Hypertension: low sodium", "PCOS: balanced carbs"].map((c) => (
      <div key={c} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2"><ShieldCheck size={16} style={{ color: G }} />{c}</div>
    ))}
  </div>,
];
const plans = [
  { t: "Climate-smart Meal Plans", d: "Hydrating and cooling in the heat, warming in the cold", i: Sun },
  { t: "Local Foods & Recipes", d: "Daal, daliya, sattu, raita and more, not imported diets", i: ChefHat },
  { t: "Clinically Safe Advice", d: "Every suggestion respects the patient's conditions", i: ShieldCheck },
];
const stats = [
  { v: "6", l: "climate locations", i: Thermometer },
  { v: "9", l: "cultural backgrounds", i: Globe },
  { v: "6", l: "clinical conditions", i: Stethoscope },
  { v: "5", l: "activity levels", i: Calculator },
];
const features = [
  ["Climate Check", Thermometer], ["Hydration Guidance", Droplets], ["Local Food Swaps", Utensils],
  ["Calorie & TDEE", Calculator], ["Macro Breakdown", ClipboardList], ["Heat-safe Plans", Sun],
  ["Diabetes Friendly", HeartPulse], ["Cultural Foods", Globe], ["Nutritionist Review", Stethoscope],
] as const;
const examples = [
  ["Lahore, 40°C", "Cooling, hydrating choices: lemon-mint water, sattu drink, raita and light grilled protein. No heavy caffeine loading."],
  ["London, 8°C", "Warm meals and hot drinks suit the cold. Standard Western weight-loss advice is a better fit here."],
  ["Dubai, 42°C", "Focus on electrolytes, water-rich foods and lighter meals; avoid dehydrating routines."],
];
const faqs = [
  ["Why does region matter for a diet plan?", "Most diet advice is written for cold, Western countries. Heat, humidity, local foods and cultural eating habits all change what is safe and realistic."],
  ["How does ClimaDiet use ethnic and cultural background?", "It helps suggest familiar, available foods and accounts for known differences in nutrition risk between populations, without relying on stereotypes."],
  ["Does it replace a nutritionist?", "No. It is a decision-support tool. A qualified nutritionist reviews and prescribes the final plan."],
  ["What does it calculate?", "Your daily energy needs (TDEE), a protein, carb and fat split, and a list of climate-suitable foods with the reasoning."],
  ["Is it safe with medical conditions?", "Conditions such as diabetes are part of the intake, and suggestions are filtered accordingly. Always confirm with your practitioner."],
];
const MENUS = [
  ["Solutions", [["Climate-aware", "#solutions"], ["Region-aware", "#solutions"], ["Culture-aware", "#solutions"], ["Condition-safe", "#solutions"]]],
  ["Features", [["Climate meal plans", "#plans"], ["Everything included", "#features"], ["Try the patient intake", "/dashboard"]]],
  ["Resources", [["Regional examples", "#examples"], ["FAQ", "#faq"], ["Contact", "#footer"]]],
];
const cols = [
  ["Product", ["Patient Intake", "Macro Scorecard", "Climate Meal Plans", "Cultural Food Swaps"]],
  ["Regions", ["Pakistan", "Middle East", "United Kingdom", "More coming soon"]],
  ["Conditions", ["Diabetes", "Hypertension", "PCOS", "Thyroid"]],
  ["Company", ["About Us", "Contact Us", "Terms of Service", "Privacy Policy"]],
];

function Phone({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto w-[270px] overflow-hidden rounded-[2.5rem] border-[8px] border-neutral-800 bg-[#141416] shadow-2xl ${className}`}>
      <div className="grid h-32 place-items-center bg-gradient-to-br from-lime-900/60 to-neutral-900 text-6xl">🥣</div>
      <div className="space-y-2 p-4 text-left">
        <p className="text-center text-base font-bold text-white">Vegetable Daliya</p>
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div><p className="text-[11px] text-neutral-400">Total Calories</p><p className="text-2xl font-medium text-white">385 <span className="text-xs text-neutral-400">Kcal</span></p></div>
          <div className="grid h-12 w-12 place-items-center rounded-full border-4 text-[10px] font-semibold text-white" style={{ borderColor: G }}>17%</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          {[["Protein", "19%"], ["Fat", "28%"], ["Carbs", "70%"]].map(([a, b]) => (
            <div key={a} className="rounded-xl border border-white/10 bg-white/[0.04] py-2 text-neutral-400"><b className="block text-sm text-white">{b}</b>{a}</div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-[11px] text-neutral-300"><b style={{ color: G }}>Why this meal?</b><br />Slow-release carbs suit a diabetes-safe plan in the heat.</div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0b0b0d] text-neutral-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0b0d]/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold"><Leaf style={{ color: G }} /> ClimaDiet</Link>
          <div className="hidden gap-2 text-sm font-medium text-neutral-400 md:flex">
            {MENUS.map(([label, items]) => (
              <div key={label as string} className="group relative">
                <button className="flex items-center gap-1 rounded-full px-4 py-2 hover:bg-white/10 hover:text-white">{label as string}<ChevronDown size={14} className="transition group-hover:rotate-180 group-focus-within:rotate-180" /></button>
                <div className="invisible absolute left-0 top-full z-40 w-56 translate-y-1 rounded-2xl border border-white/10 bg-[#151518] p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {(items as string[][]).map(([t, href]) => (
                    <a key={t} href={href} className="block rounded-xl px-3 py-2 text-neutral-300 hover:bg-white/10 hover:text-white">{t}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Link href="/dashboard" className="rounded-full px-4 py-2 hover:bg-white/10">Log In</Link>
            <Link href="/dashboard" className="rounded-full px-5 py-2 text-neutral-900" style={{ background: G }}>Get Started</Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 text-center">
        <h1 className="mx-auto max-w-3xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
          Diet Plans That Fit <span style={{ color: G }}>Where You Live</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
          AI nutrition plans based on your climate, region, cultural background and health conditions, so a 40°C summer never gets a cold-country prescription.
        </p>
        <div className="mt-8 flex items-center justify-center gap-8 text-sm">
          <div><b className="block text-2xl">Climate</b>heat, cold, humidity</div>
          <div className="h-10 w-px bg-white/10" />
          <div><b className="block text-2xl">Culture</b>local foods and habits</div>
        </div>
        <Link href="/dashboard" className="mt-8 inline-block rounded-full px-10 py-4 text-lg font-bold text-neutral-900 shadow-lg" style={{ background: G }}>Get Started</Link>
        <div className="mt-14 rounded-[2rem] bg-gradient-to-b from-white/[0.06] to-transparent px-4 pb-0 pt-10"><Phone /></div>
        <p className="mt-10 text-sm font-medium text-neutral-500">Built for nutritionists and their clients</p>
      </section>

      <section id="solutions" className="scroll-mt-16 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-4xl font-extrabold md:text-5xl">Nutrition Advice,<br />Made Local</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {personal.map(({ t, d, i: I, bg }) => (
              <div key={t} className={`flex h-80 flex-col justify-between rounded-3xl border border-white/10 p-6 ${bg}`}>
                <div><h3 className="text-xl font-bold">{t}</h3><p className="mt-1 text-sm text-neutral-400">{d}</p></div>
                <div className="grid h-32 place-items-center rounded-2xl bg-black/30"><I size={44} style={{ color: G }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="scroll-mt-16 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-4xl font-extrabold md:text-5xl">Meal Plans<br />Tailored for You</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {plans.map(({ t, d, i: I }, n) => (
              <div key={t} className="rounded-3xl border border-white/10 bg-white/[0.02] p-7">
                <I size={30} style={{ color: G }} />
                <h3 className="mt-6 text-xl font-bold">{t}</h3><p className="mt-1 text-neutral-400">{d}</p>
                <div className="mt-6 h-40 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.12] p-4">{CARD_VISUALS[n]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: G }}>
        <div className="mx-auto max-w-6xl px-5 text-center text-neutral-900">
          <h2 className="text-3xl font-extrabold md:text-4xl">What the plan takes into account</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ v, l, i: I }) => (
              <div key={l}><I className="mx-auto" size={32} /><b className="mt-3 block text-5xl">{v}</b><span className="opacity-90">{l}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-16 overflow-hidden py-20">
        <h2 className="text-center text-4xl font-extrabold">Everything a nutritionist needs</h2>
        <div className="mt-10 flex w-max animate-marquee gap-4">
          {[...features, ...features].map(([n, I], k) => (
            <div key={k} className="flex w-56 flex-col items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center font-semibold">
              <I size={34} style={{ color: G }} />{n}
            </div>
          ))}
        </div>
      </section>

      <section id="examples" className="scroll-mt-16 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-4xl font-extrabold md:text-5xl">Same goal,<br />different prescription</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {examples.map(([place, text]) => (
              <figure key={place} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <figcaption className="flex items-center gap-2 font-bold"><MapPin size={18} style={{ color: G }} />{place}</figcaption>
                <blockquote className="mt-3 text-neutral-300">{text}</blockquote>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-neutral-400">Illustrative examples of how advice changes by region.</p>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-16 px-5 py-20">
        <h2 className="text-center text-4xl font-extrabold">Frequently asked questions</h2>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {faqs.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold">{q}<ChevronDown className="chev transition-transform" /></summary>
              <p className="mt-3 text-neutral-600">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer id="footer" className="border-t border-white/10 bg-white/[0.02] py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:grid-cols-2 lg:grid-cols-4">
          {cols.map(([h, items]) => (
            <div key={h as string}>
              <h4 className="font-bold">{h as string}</h4>
              <ul className="mt-3 space-y-2 text-sm text-neutral-400">{(items as string[]).map((x) => <li key={x} className="hover:text-white">{x}</li>)}</ul>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-6xl px-5 text-sm text-neutral-500">© {new Date().getFullYear()} ClimaDiet. All rights reserved.</p>
      </footer>
    </div>
  );
}
