import React, { useState } from 'react';
import { Dumbbell, Flame, Sparkles, Waves, Coffee, ShieldCheck, ChevronRight } from 'lucide-react';

export default function FacilitySection() {
  const [activeFacility, setActiveFacility] = useState(0);

  const facilities = [
    {
      id: 'iron-pit',
      title: 'Heavy Iron Pit & Calisthenics Rig',
      icon: Dumbbell,
      tagline: 'Rogue Bars, Dumbbells up to 60kg & Eleiko Plates',
      description: 'Built for raw strength athletes. Features 6 Olympic deadlift platforms, competition power racks, calibrated steel plates, heavy dumbbells, and specialized bar shafts.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
      stats: '6 Power Racks • 60kg Dumbbells • Rubber Turf'
    },
    {
      id: 'studio-alpha',
      title: 'Studio Alpha HIIT & Spin Arena',
      icon: Flame,
      tagline: 'Immersive sound system, dynamic neon lighting & ventilation',
      description: 'High-energy studio fitted with wood spring flooring, Schwinn IC4 spin bikes, heavy boxing bags, battle ropes, and air-purification HVAC.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
      stats: '30+ Spin Bikes • Heavy Bags • Surround Sound'
    },
    {
      id: 'thermal-spa',
      title: 'Thermal Sauna & Steam Sanctuary',
      icon: Waves,
      tagline: 'Finnish Cedar Sauna & Eucalyptus Steam Rooms',
      description: 'Post-workout recovery re-imagined. Relax tight fascia, improve peripheral circulation, and soothe sore muscles in our sanitized thermal saunas.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop',
      stats: 'Cedar Dry Sauna • Steam Room • Ice Tubs'
    },
    {
      id: 'smoothie-bar',
      title: 'Smoothie Bar & VIP Member Lounge',
      icon: Coffee,
      tagline: 'Fresh Whey Protein Shakes, BCAA Hydration & WiFi',
      description: 'Refuel immediately post-session with custom protein shakes, cold-pressed juices, espresso, and high-speed Wi-Fi lounge tables for remote working.',
      image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=1200&auto=format&fit=crop',
      stats: 'Whey Protein Bar • Cold Brew • Ultra WiFi'
    }
  ];

  const current = facilities[activeFacility];

  return (
    <section className="py-20 bg-[#0b0f17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-semibold">
            LUXURY ATHLETIC SPACES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            WORLD-CLASS <span className="text-gradient-emerald">FACILITIES</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Take an interactive tour of our 15,000+ sq. ft. modern gym premises.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            const isSelected = activeFacility === idx;
            return (
              <button
                key={fac.id}
                onClick={() => setActiveFacility(idx)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/60 shadow-xl shadow-emerald-500/10 scale-102'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                </div>
                <h4 className={`text-base font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {fac.title.split('&')[0]}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{fac.stats}</p>
              </button>
            );
          })}
        </div>

        <div className="relative rounded-3xl overflow-hidden glass-card border border-slate-800 min-h-[420px] flex items-end p-6 sm:p-10 group">
          <img
            src={current.image}
            alt={current.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider">
              {current.stats}
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white">{current.title}</h3>
            <p className="text-slate-200 text-sm leading-relaxed">{current.description}</p>
          </div>
        </div>

      </div>
    </section>
  );
}
