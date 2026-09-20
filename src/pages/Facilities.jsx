import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import { Dumbbell, Flame, Waves, Coffee, ShieldCheck, CheckCircle2, Sparkles, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Facilities({ onOpenJoinModal }) {
  const [activeFacilityIndex, setActiveFacilityIndex] = useState(0);

  const facilityList = [
    {
      id: 'iron-pit',
      title: 'Heavy Iron Pit & Calisthenics Rig',
      tagline: 'Rogue Bars, Power Racks & Dumbbells up to 60kg',
      badge: 'STRENGTH ZONE',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
      description: 'Engineered for dedicated strength athletes and powerlifters. Features 6 Olympic deadlift platforms with Eleiko calibrated plates, competition squat cages, specialized barbells (Safety Squat, Swiss bar, Trap bar), and dumbbells from 2.5kg up to 60kg.',
      highlights: [
        '6 Dedicated Olympic Lifting & Deadlift Platforms',
        'Heavy Cast Iron & Urethane Dumbbells (2.5kg to 60kg)',
        'Rogue Monster Power Racks with Band Pegs',
        'Specialized Barbells (Texas Power Bar, Buffalo Bar)',
        'Calisthenics Rig & Heavy Sled Turf Lane'
      ],
      specs: '10,000 sq. ft. • Shock-Absorbing Rubber Floor • Chalk Friendly'
    },
    {
      id: 'thermal-sauna',
      title: 'Thermal Sauna & Steam Sanctuary',
      tagline: 'Finnish Cedar Dry Sauna & Eucalyptus Steam Rooms',
      badge: 'RECOVERY SPA',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop',
      description: 'Accelerate muscle recovery and lower cortisol. Our thermal spa area features custom-built Finnish cedar dry saunas running at 85°C-90°C, aromatherapy eucalyptus steam rooms, and ice bath plunge tubs for post-workout contrast therapy.',
      highlights: [
        'High-Temperature Natural Finnish Cedar Dry Sauna',
        'Eucalyptus Steam Chamber for Respiratory Relief',
        'Ice Bath Plunge Tub for Contrast Therapy',
        'Private Luxury Showers & Sanitized Towel Service',
        'Included Free with Pro Standard & VIP Platinum Plans'
      ],
      specs: 'Sanitized Hourly • Private Lockers • Filtered Water'
    },
    {
      id: 'studio-alpha',
      title: 'Studio Alpha HIIT & Spin Arena',
      tagline: 'Immersive Sound System, Dynamic Lighting & Air Purification',
      badge: 'STUDIO ARENA',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
      description: 'Home to our legendary group classes. Built with sprung hardwood flooring to protect joint health, Schwinn IC4 magnetic resistance spin bikes, heavy leather boxing bags, TRX suspension anchors, and high-flow HEPA air conditioning.',
      highlights: [
        'Sprung Hardwood Floor to Prevent Knee Strain',
        '25+ Heavy Leather Punching Bags & Speed Balls',
        'Schwinn IC4 Magnetic Resistance Rhythm Spin Bikes',
        'Concert-Grade Acoustic Sound & Dynamic Lighting',
        'Daily Instructor-Led HIIT, Yoga, and Spin Classes'
      ],
      specs: 'Climate Controlled • HEPA Air Flow • 30 Person Capacity'
    },
    {
      id: 'smoothie-lounge',
      title: 'Smoothie Bar & VIP Member Lounge',
      tagline: 'Fresh Whey Protein Shakes, Espresso & Ultra-Fast Wi-Fi',
      badge: 'NUTRITION & SOCIAL',
      image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=1200&auto=format&fit=crop',
      description: 'Refuel your muscles immediately post-workout. Our nutrition bar serves made-to-order whey protein smoothies, BCAA hydration coolers, cold brew coffee, and healthy meal preps. Includes a quiet lounge space with high-speed Wi-Fi and charging outlets.',
      highlights: [
        'Made-to-Order 100% Whey Protein Shakes & Smoothies',
        'Electrolyte & BCAA Intra-Workout Refreshers',
        'Espresso Bar with Colombian & Nepali Coffee Beans',
        'High-Speed Wi-Fi Workstations for Remote Workers',
        'VIP Member Discounts on Shakes & Supplements'
      ],
      specs: 'Open 6 AM - 10 PM • Comfortable Seating • Power Outlets'
    }
  ];

  const current = facilityList[activeFacilityIndex];

  return (
    <div className="py-12 bg-[#0b0f17] min-h-screen relative">
      <SEOHead 
        title="Luxury Facilities & Amenities" 
        description="Explore Goodlife Fitness luxury facilities in Ghattekulo, Kathmandu (44600). Heavy Iron Pit, Finnish Cedar Sauna, Studio Alpha, and Smoothie Lounge. 24/7 access."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> WORLD-CLASS ATHLETIC SPACES
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white">
            OUR LUXURY <span className="text-gradient-emerald">FACILITIES</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Take a virtual tour of our state-of-the-art 15,000+ sq. ft. fitness premises located in Ghattekulo, Kathmandu (44600).
          </p>
        </div>

        {/* Facility Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {facilityList.map((fac, idx) => (
            <button
              key={fac.id}
              onClick={() => setActiveFacilityIndex(idx)}
              className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                activeFacilityIndex === idx
                  ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-102'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span className={`text-[10px] font-mono font-bold block mb-1 ${
                activeFacilityIndex === idx ? 'text-emerald-400' : 'text-slate-500'
              }`}>
                {fac.badge}
              </span>
              <h3 className={`text-sm sm:text-base font-bold ${
                activeFacilityIndex === idx ? 'text-white' : 'text-slate-300'
              }`}>
                {fac.title.split('&')[0]}
              </h3>
            </button>
          ))}
        </div>

        {/* Featured Big Showcase */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Image Box */}
            <div className="lg:col-span-6 relative h-80 sm:h-[450px] rounded-3xl overflow-hidden group shadow-2xl">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-emerald-400 font-bold">
                {current.badge}
              </div>

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs text-slate-300 font-mono">
                <span className="text-emerald-400 font-bold">SPECS: </span> {current.specs}
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-emerald-400 font-mono text-xs uppercase font-bold tracking-widest block mb-1">
                  GOODLIFE GHATTEKULO (44600)
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">{current.title}</h2>
                <p className="text-sm text-slate-400 mt-1 font-medium">{current.tagline}</p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <h4 className="text-xs font-mono text-white font-bold uppercase tracking-wider">Key Highlights:</h4>
                {current.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onOpenJoinModal}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:scale-105 transition-transform flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Day Pass to Try (NPR 1,200)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/pricing"
                  className="px-6 py-3.5 rounded-xl glass-panel text-white font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>View All Plans</span>
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Facility Rules & Hygiene Standards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <Clock className="w-6 h-6 text-emerald-400" />
            <h4 className="text-base font-bold text-white">24/7 Access Year-Round</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Biometric doors and keycard sensors ensure verified members can train 24 hours a day, 7 days a week.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h4 className="text-base font-bold text-white">Sanitized Every Hour</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Disinfectant stations and air purifiers are active 24/7. Saunas and locker rooms undergo scheduled hourly sanitization.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <MapPin className="w-6 h-6 text-teal-400" />
            <h4 className="text-base font-bold text-white">Ghattekulo Main Branch</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Convenient location in Kathmandu (Postal Code 44600) with safe two-wheeler and four-wheeler parking spaces.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
