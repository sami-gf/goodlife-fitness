import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import HeroSection from '../components/home/HeroSection';
import DecorativeSection from '../components/home/DecorativeSection';
import SpecialOfferSection from '../components/home/SpecialOfferSection';
import ClassVarietiesSection from '../components/home/ClassVarietiesSection';
import BenefitsCarousel from '../components/home/BenefitsCarousel';
import CoachSpotlights from '../components/home/CoachSpotlights';
import FacilitySection from '../components/home/FacilitySection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import BmiCalculator from '../components/home/BmiCalculator';
import { 
  Calendar, Dumbbell, DollarSign, User, ShieldCheck, MapPin, 
  ArrowRight, Flame, Sparkles, CheckCircle2 
} from 'lucide-react';

export default function Home({ onOpenJoinModal, onOpenSearch }) {
  const portalCards = [
    {
      title: 'Class Timetable',
      desc: 'Book HIIT, Power Yoga, Heavy Lifting, Boxing & Spin',
      path: '/classes',
      icon: Calendar,
      badge: 'Live Booking',
      accent: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
    },
    {
      title: 'Luxury Facilities',
      desc: 'Tour our 15,000 sq. ft. Iron Pit, Cedar Sauna & Smoothie Bar',
      path: '/facilities',
      icon: Dumbbell,
      badge: 'Virtual Tour',
      accent: 'border-teal-500/40 text-teal-400 bg-teal-500/10'
    },
    {
      title: 'NPR Pricing Plans',
      desc: 'Flexible Day Passes, Monthly & Annual Passes (20% Off)',
      path: '/pricing',
      icon: DollarSign,
      badge: 'Transparent NPR',
      accent: 'border-amber-500/40 text-amber-400 bg-amber-500/10'
    },
    {
      title: 'Master Coaches',
      desc: 'Meet CSCS certified trainers & book private 1-on-1 sessions',
      path: '/instructors',
      icon: User,
      badge: 'Pro Coaching',
      accent: 'border-pink-500/40 text-pink-400 bg-pink-500/10'
    },
    {
      title: 'About Goodlife',
      desc: 'Our mission, 24/7 access benefits & member transformations',
      path: '/about',
      icon: ShieldCheck,
      badge: 'Our Story',
      accent: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10'
    },
    {
      title: 'Contact & Location',
      desc: 'Ghattekulo Kathmandu (44600), Phone 9800548346 & Instagram',
      path: '/contact',
      icon: MapPin,
      badge: 'Visit Us',
      accent: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
    }
  ];

  return (
    <div className="space-y-0">
      <SEOHead 
        title="Goodlife Fitness — Premier 24/7 Gym | Ghattekulo, Kathmandu (44600)" 
        description="Experience 24/7 gym access, Olympic heavy iron pits, luxury Finnish cedar saunas, and certified trainers in Ghattekulo, Kathmandu (44600). NPR memberships & live class bookings."
      />

      {/* Main Hero */}
      <HeroSection onOpenJoinModal={onOpenJoinModal} />

      {/* Marquee Ticker */}
      <DecorativeSection />

      {/* Quick Discovery Navigation Portal */}
      <section className="py-16 bg-[#0b0f17] relative border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-emerald-400 font-mono text-xs uppercase font-bold tracking-widest block mb-1">
                ONE-CLICK EXPLORATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                EXPLORE <span className="text-gradient-emerald">GOODLIFE FITNESS</span>
              </h2>
            </div>

            <button
              onClick={onOpenSearch}
              className="px-5 py-2.5 rounded-xl glass-panel text-xs text-slate-300 hover:text-white flex items-center gap-2 border border-slate-700 hover:border-emerald-500 cursor-pointer self-start sm:self-auto transition-all"
            >
              <span>Instant Site Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-emerald-400 font-mono">⌘K</kbd>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portalCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  to={card.path}
                  className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-800 hover:border-emerald-500/50 flex flex-col justify-between group transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.accent}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">
                    <span>Explore Section</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* Limited Time Promo Offer */}
      <SpecialOfferSection onOpenJoinModal={onOpenJoinModal} />

      {/* Class Varieties Grid Preview */}
      <ClassVarietiesSection />

      {/* Key Advantages Tabs */}
      <BenefitsCarousel />

      {/* Interactive BMI & Goal Calculator Lead Magnet */}
      <BmiCalculator onOpenJoinModal={onOpenJoinModal} />

      {/* Coach Spotlights */}
      <CoachSpotlights />

      {/* Luxury Facility Tour */}
      <FacilitySection />

      {/* Member Testimonials */}
      <TestimonialsSection />

    </div>
  );
}
