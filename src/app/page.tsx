import Link from "next/link";
import { ArrowRight, Thermometer, ShieldCheck, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Editorial Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link href="/" className="editorial-title text-xl">ClimaDiet</Link>
          <nav className="flex items-center gap-6 text-sm font-semibold text-muted-foreground">
            <Link href="/dashboard" className="text-forest hover:text-opacity-80">Dashboard</Link>
          </nav>
        </div>
      </header>

      {/* SECTION 1: Editorial Hero */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Left: Copy */}
          <div className="max-w-lg pt-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-forest leading-[1.12] mb-4">
              Nutrition that understands your climate.
            </h1>
            <p className="text-base text-[#5A5A5A] mb-6 leading-relaxed">
              Personalized meal plans built around your health goals, local foods, cultural habits, and the conditions outside your window.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3.5 rounded-md font-semibold text-sm hover:bg-forest/90 transition-all">
              Open Nutritionist Workspace <ArrowRight size={16} />
            </Link>
          </div>
          
          {/* Right: Image + Panel below */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-surface-2 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&q=80&w=1200" 
                alt="Fresh, healthy South Asian cuisine"
                className="object-cover w-full h-full"
              />
            </div>
            {/* Context panel — separate from image for clarity */}
            <div className="bg-[#F5F4F0] border border-[#E0DED8] p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-forest" />
                  <span className="text-sm font-semibold text-forest">Lahore</span>
                  <span className="text-xs text-[#5A5A5A]">·</span>
                  <span className="text-sm font-bold text-heat flex items-center gap-1"><Thermometer size={13} /> 39°C</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#888]">Climate Signal</span>
              </div>
              <div className="flex gap-3 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-md bg-white border border-[#E0DED8] text-forest">Hydration ↑</span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-[#E0DED8] text-forest">Cooling foods ↑</span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-[#E0DED8] text-heat">Heavy meals ↓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: One patient. Four signals. */}
      <section className="bg-surface py-20 lg:py-32 border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="editorial-title text-3xl md:text-4xl mb-4">One patient. Four signals.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A clinical meal plan is more than just hitting a caloric target. We synthesize four critical dimensions to generate realistic, safe, and culturally relevant recommendations.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Health", desc: "BMI, TDEE, underlying conditions, and allergies." },
              { title: "Climate", desc: "Local real-time weather and temperature trends." },
              { title: "Culture", desc: "Ethnic background and dietary preferences." },
              { title: "Nutrition", desc: "Deterministic macronutrient and calorie targets." }
            ].map((s, i) => (
              <div key={i} className="clinical-card flex flex-col items-start border-t-4 border-t-forest">
                <h3 className="text-lg font-bold text-forest mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: The same calorie target... */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-12">
            <h2 className="editorial-title text-3xl md:text-4xl mb-4">The same target looks very different.</h2>
            <p className="text-muted-foreground">A 2,000 kcal diet shouldn&apos;t look the same in London as it does in Dubai.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { city: "Lahore", temp: "38°C", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800", note: "Cooling Daal & Raita" },
              { city: "London", temp: "8°C", img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=800", note: "Warm Lentil Stew" },
              { city: "Dubai", temp: "42°C", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800", note: "Hydrating Watermelon Salad" },
            ].map((c) => (
              <div key={c.city} className="group relative rounded-xl overflow-hidden aspect-[3/4] bg-surface-2 border border-border">
                <img src={c.img} alt={c.note} className="object-cover w-full h-full image-zoom-hover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex justify-between items-end mb-2">
                    <div className="font-bold text-2xl">{c.city}</div>
                    <div className="font-mono text-lg">{c.temp}</div>
                  </div>
                  <div className="text-sm font-medium text-white/80">{c.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Trust / Clinical safety */}
      <section className="bg-surface py-20 border-t border-border">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <ShieldCheck size={48} className="mx-auto text-sage mb-6" />
          <h2 className="editorial-title text-3xl mb-6">Decision-support for qualified nutritionists.</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            ClimaDiet does not rely on LLMs to calculate nutritional targets. Deterministic Python calculations establish BMR and Macros, while automated checks ensure the generated plan strictly adheres to all dietary constraints and explicit allergens.
          </p>
          <div className="inline-flex flex-wrap justify-center gap-3">
            {["Nutrition targets", "Dietary restrictions", "Explicit allergens", "Meal count"].map(check => (
              <span key={check} className="px-4 py-2 bg-surface-2 rounded-full text-xs font-bold uppercase tracking-wider text-forest border border-border">
                ✓ {check} checked
              </span>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p>ClimaDiet. Clinical nutrition decision-support system.</p>
      </footer>
    </main>
  );
}
