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

      {/* SECTION 1: Asymmetrical Hero */}
      <section className="mx-auto max-w-7xl px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-forest leading-[1.1] mb-6">
              Nutrition that understands your climate.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Personalized meal plans built around your health goals, local foods, cultural habits, and the conditions outside your window.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3.5 rounded-md font-semibold hover:bg-opacity-90 transition-all">
                Enter Nutritionist Workspace <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-2 shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&q=80&w=1200" 
              alt="Fresh, healthy South Asian cuisine"
              className="object-cover w-full h-full"
            />
            {/* Overlay module */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-72 bg-surface/95 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Context</div>
                  <div className="text-forest font-semibold flex items-center gap-1 mt-0.5"><MapPin size={14}/> Lahore</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Temp</div>
                  <div className="text-heat font-bold flex items-center gap-1 mt-0.5"><Thermometer size={14}/> 38°C</div>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Plan Response</div>
                <div className="flex justify-between text-sm font-medium text-forest">
                  <span>Hydration</span> <span className="text-climate">↑</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-forest">
                  <span>Cooling foods</span> <span className="text-climate">↑</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-forest">
                  <span>Heavy meals</span> <span className="text-heat">↓</span>
                </div>
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
