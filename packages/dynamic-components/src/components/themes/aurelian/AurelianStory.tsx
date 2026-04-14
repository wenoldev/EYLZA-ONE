import React from 'react';

interface Stat {
  value: string;
  label: string;
}

interface AurelianStoryProps {
  badge?: string;
  title?: string;
  paragraphs?: string[];
  image?: string;
  stats?: Stat[];
}

const AurelianStory: React.FC<AurelianStoryProps> = ({
  badge = "Uncompromising Mastery",
  title = "Forged in Silence, Worn with Intention.",
  paragraphs = [
    "At Aurum Atelier, we believe jewelry is more than an accessory—it is an archival record of a moment. Our masters spend hundreds of hours on a single piece, ensuring every facet reflects our century-long commitment to excellence.",
    "Every stone is ethically sourced, every ounce of gold is reclaimed, and every design begins as a hand-drawn sketch in our Milan studio. We don't just craft jewelry; we curate legacy."
  ],
  image = "https://lh3.googleusercontent.com/aida-public/AB6AXuBM10BvZPlAk-eBvddUKi-UG-CpkbgF_eTq1ZQcObgCd6zBOBbtsyD0soRwx1dktKT61ER6umzh9kWWzuWz9EFUeHfm3n9imFiZAjynI2reB-bG9JyhAJNfgMZIirEcWEZAmy4Cvz7fZEjNX7vi9PI1aQjf8hwK6JlPi90CQFxgHXid99o8n_ry0MSUe5X7HsAQ9vYBKqQ5vu2_gEqvjAOLv-zUp0unHrEFrNrH711W_kgk-tyho1eu6gTedRawOgAqs2118-be1QQ",
  stats = [
    { value: "100+", label: "Years of Heritage" },
    { value: "Milan", label: "Design Origin" },
    { value: "Zero", label: "Carbon Footprint" }
  ]
}) => {
  return (
    <section className="bg-stone-50 py-32 px-6 md:px-12 overflow-hidden border-y border-stone-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="aspect-[4/5] bg-stone-200 overflow-hidden relative z-10 shadow-2xl">
            <img 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
              src={image}
              alt="Artisan at work"
            />
          </div>
          {/* Decorative Element */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 border-l border-t border-primary/20 hidden md:block z-0 animate-pulse"></div>
        </div>
        <div>
          <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-primary mb-6 block font-bold">
            {badge}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">
            {title.split('<br/>').map((part, index) => (
              <React.Fragment key={index}>
                {index > 0 && <br />}
                {part}
              </React.Fragment>
            ))}
          </h2>
          <div className="space-y-6 text-stone-500 leading-relaxed font-sans text-sm md:text-base">
            {paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          <div className="mt-12 pt-12 border-t border-stone-200 flex gap-8 md:gap-12 flex-wrap">
            {stats.map((stat, idx) => (
              <div key={idx} className="min-w-[80px]">
                <span className="block text-2xl font-serif italic text-stone-900">{stat.value}</span>
                <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold whitespace-nowrap">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AurelianStory;
