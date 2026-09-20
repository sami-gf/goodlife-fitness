import React, { useState } from 'react';
import { Clock, Award, Waves, Smartphone, Utensils, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';

export default function BenefitsCarousel() {
  const [activeTab, setActiveTab] = useState(0);

  const benefits = [
    {
      id: 'access',
      title: '24/7 Keycard Access',
      icon: Clock,
      tagline: 'Train on your own schedule, day or night.',
      description: 'Never miss a session. With biometrics & high-security keycard access, Goodlife facilities remain fully accessible 24 hours a day, 365 days a year across Kathmandu and Pokhara branches.',
      bullets: [
        'Secure biometric & app unlock doors',
        '24/7 HD CCTV monitoring & security',
        'Off-peak quiet hours for focused lifting',
        'Multi-location keycard roaming'
      ],
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'coaches',
      title: 'Certified Master Trainers',
      icon: Award,
      tagline: 'Science-backed strength & body conditioning.',
      description: 'Our coaching staff holds international certifications (CSCS, ACE, NASM, 500hr RYT). Whether your goal is body re-composition, powerlifting, or mobility, we deliver results safely.',
      bullets: [
        '1-on-1 personalized biomechanics assessment',
        'Customized progressive overload programs',
        'Technique correction for compound lifts',
        'Monthly body composition scan (InBody)'
      ],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'spa',
      title: 'Thermal Sauna & Recovery Spa',
      icon: Waves,
      tagline: 'Accelerated muscle repair & mental relaxation.',
      description: 'Enhance growth hormone release and relieve joint soreness with our luxury Finnish cedar saunas, steam rooms, and post-workout contrast showers included in Pro & VIP plans.',
      bullets: [
        'High-temperature cedar dry saunas',
        'Eucalyptus infused steam rooms',
        'Ice bath contrast recovery tubs',
        'Clean, private locker rooms & showers'
      ],
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'app',
      title: 'Smart Mobile Tracker App',
      icon: Smartphone,
      tagline: 'Track workouts, reserve slots, measure gains.',
      description: 'Use the Goodlife app to view live gym capacity, book studio class seats, log personal records, and sync smartwatch metrics effortlessly.',
      bullets: [
        'Real-time crowd meter for peak hours',
        'Instant class booking & waitlist alerts',
        'Workout logger & PR history tracking',
        'Digital keycard pass integration'
      ],
      image: 'https://images.unsplash.com/photo-1510519138161-58446231f11f?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'nutrition',
      title: 'Tailored Nutrition Plans',
      icon: Utensils,
      tagline: 'Fuel your body with calculated macros.',
      description: 'Exercise is only half the battle. Get personalized macronutrient targets, recipe suggestions, and smoothie bar discounts crafted for your specific metabolic footprint.',
      bullets: [
        'Caloric deficit / surplus calculations',
        'High-protein meal plan recommendations',
        'Smoothie bar protein shake perks',
        'Supplement stack guidance'
      ],
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop'
    }
  ];

  const currentBenefit = benefits[activeTab];

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-semibold">
            THE GOODLIFE ADVANTAGE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            WHY MEMBERS CHOOSE <span className="text-gradient-emerald">GOODLIFE</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need for an unmatched fitness lifestyle under one roof.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={b.id}
                onClick={() => setActiveTab(idx)}
                className={`p-4 rounded-2xl flex flex-col items-center text-center gap-2 transition-all duration-300 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/20 font-bold scale-105'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-6 h-6 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span className="text-xs tracking-wide">{b.title}</span>
              </button>
            );
          })}
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 relative h-72 sm:h-96 rounded-2xl overflow-hidden group">
              <img
                src={currentBenefit.image}
                alt={currentBenefit.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">{currentBenefit.tagline}</span>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                  FEATURE SPOTLIGHT #{activeTab + 1}
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-white mt-1">
                  {currentBenefit.title}
                </h3>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {currentBenefit.description}
              </p>

              <div className="space-y-2.5 pt-2">
                {currentBenefit.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
