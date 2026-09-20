import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Clock, ArrowRight, Check } from 'lucide-react';
import { Membership } from '../../base44/entities/Membership';

const OFFER_END_KEY = 'goodlife_offer_end';

function getOfferEndTime() {
  const saved = localStorage.getItem(OFFER_END_KEY);
  if (saved) return parseInt(saved, 10);
  // Set 18 hours from now if not set
  const end = Date.now() + 18 * 60 * 60 * 1000;
  localStorage.setItem(OFFER_END_KEY, String(end));
  return end;
}

export default function SpecialOfferSection({ onOpenJoinModal }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 0, seconds: 0 });

  useEffect(() => {
    const endTime = getOfferEndTime();

    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border-y border-emerald-500/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" /> SPECIAL LIMITED TIME PROMO
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Save 20% On Annual Memberships + Free PT Intro
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Lock in <span className="text-emerald-400 font-semibold">{Membership.formatNPR(3840)}/month</span> (billed annually) instead of {Membership.formatNPR(4800)}/month. Includes full sauna & studio class access.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-3 bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="flex items-center gap-2 font-mono text-center">
                <div>
                  <span className="text-lg font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="block text-[9px] text-slate-400 uppercase">HRS</span>
                </div>
                <span className="text-slate-600 font-bold">:</span>
                <div>
                  <span className="text-lg font-black text-emerald-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="block text-[9px] text-slate-400 uppercase">MIN</span>
                </div>
                <span className="text-slate-600 font-bold">:</span>
                <div>
                  <span className="text-lg font-black text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="block text-[9px] text-slate-400 uppercase">SEC</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenJoinModal}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
            >
              <span>CLAIM NPR DISCOUNT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
