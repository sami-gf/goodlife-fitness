import React from 'react';
import { Flame } from 'lucide-react';

export default function DecorativeSection() {
  const tickerItems = [
    "GOODLIFE FITNESS",
    "GHATTEKULO KATHMANDU (44600)",
    "CALL: 9800548346",
    "24/7 ACCESS",
    "NPR NEPALI RUPEES PLANS",
    "HIIT & STRENGTH PITS",
    "FINNISH CEDAR SAUNAS",
    "INSTAGRAM: @SAMI_CHETTRI9",
    "SMOOTHIE BAR & SHAKES",
    "FREE DAY PASS TRIAL",
  ];

  // Duplicate just once for seamless loop
  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div
      className="py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 overflow-hidden text-slate-950 font-black font-mono tracking-widest text-xs sm:text-sm uppercase shadow-xl select-none"
      aria-hidden="true"
    >
      <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
        {doubled.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 shrink-0">
            <span>{item}</span>
            <Flame className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
