import React from 'react';
import { Flame } from 'lucide-react';

export default function FooterLogo({ className = "w-8 h-8" }) {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300">
        <Flame className="w-6 h-6 text-slate-950 fill-slate-950 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute inset-0 rounded-xl border border-white/20" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-wider text-white uppercase font-sans flex items-center gap-1">
          GOODLIFE <span className="text-emerald-400">FITNESS</span>
        </span>
        <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold -mt-1">
          GHATTEKULO, KATHMANDU (44600)
        </span>
      </div>
    </div>
  );
}
