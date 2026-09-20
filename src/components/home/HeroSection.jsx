import React from 'react';
import { Link } from 'react-router-dom';

import { Play, Flame, ShieldCheck, Trophy, ArrowRight, Clock, Star } from 'lucide-react';
import TypewriterText from '../TypewriterText';

export default function HeroSection({ onOpenJoinModal }) {
  const words = [
    "UNLEASH YOUR POTENTIAL",
    "REDEFINE YOUR LIMITS",
    "TRANSFORM YOUR LIFE",
    "DOMINATE EVERY GOAL"
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-8 pb-16">
      {/* Background Visual Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop"
          alt=""
          role="presentation"
          loading="lazy"
          className="w-full h-full object-cover object-center opacity-25 filter brightness-75 contrast-125 scale-105 animate-pulse-glow"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/70 to-[#0b0f17]/40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Main Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <Flame className="w-4 h-4 fill-emerald-400" />
              <span>GHATTEKULO, KATHMANDU (44600) • 24/7 ELITE GYM</span>
            </div>


            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                BUILT FOR GREATNESS.
              </h1>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] overflow-hidden">
                <TypewriterText words={words} />
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Step into state-of-the-art strength pits, intense group HIIT studios, and luxury recovery thermal spas. Experience elite coaching tailored for real results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenJoinModal}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/30 hover:scale-105 hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>CLAIM FREE DAY PASS</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/schedule"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel text-white font-bold text-base hover:bg-slate-800/80 border-slate-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Clock className="w-5 h-5 text-emerald-400" />
                <span>VIEW CLASS SCHEDULE</span>
              </Link>
            </div>

            {/* Stats Counter Row */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <h4 className="text-2xl sm:text-3xl font-black text-white">24/7</h4>
                <p className="text-xs text-slate-400">Gym Access</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-black text-emerald-400">15+</h4>
                <p className="text-xs text-slate-400">Pro Trainers</p>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-black text-amber-400">4.9 ★</h4>
                <p className="text-xs text-slate-400">Member Rating</p>
              </div>
            </div>

          </div>

          {/* Right Visual Feature Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-3xl blur-xl opacity-30 animate-pulse-glow" />
              
              <div className="relative glass-card rounded-3xl p-6 sm:p-8 space-y-6">
                
                <div className="relative h-64 rounded-2xl overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"
                    alt="Class action"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    LIVE TODAY
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">NEXT CLASS • 05:30 PM</span>
                    <h4 className="text-lg font-extrabold text-white">Iron Pit: Heavy Lifting</h4>
                    <p className="text-xs text-slate-300">With Master Coach Aarav Sharma</p>
                  </div>
                </div>

                {/* Quick Info Badges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Clean & Sanitized Equipment
                    </span>
                    <span className="text-emerald-400 font-bold">100% Certified</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      Nepal Fitness Championship Partner
                    </span>
                    <span className="text-amber-400 font-bold">Official Gym</span>
                  </div>
                </div>

                <button
                  onClick={onOpenJoinModal}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Reserve Spot for Today</span>
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
