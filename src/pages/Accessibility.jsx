import React, { useEffect } from 'react';
import { Accessibility as AccessibilityIcon, Heart, CheckCircle2, Mail, MapPin } from 'lucide-react';

export default function Accessibility() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-16 bg-[#0b0f17] min-h-screen text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-semibold">
            <AccessibilityIcon className="w-3.5 h-3.5" /> ACCESSIBILITY COMMITMENT
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">Accessibility Statement</h1>
          <p className="text-xs text-slate-400 font-mono">Goodlife Fitness • Ghattekulo, Kathmandu (44600)</p>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white">Digital Web Standards</h3>
            <p>
              Goodlife Fitness is committed to providing a digital platform accessible to all individuals, including those with sight, motor, or cognitive impairments. We continuously align with WCAG 2.1 AA guidelines.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white">Physical Facility Accessibility</h3>
            <p>
              Our flagship facility in Ghattekulo, Kathmandu includes wheelchair-accessible ramps, wide-aisle strength machine spacing, accessible shower cubicles, and dedicated trainer assistance.
            </p>
          </section>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs text-emerald-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Need specific assistance? Contact <a href="mailto:samir.bhandari666@gmail.com" className="underline font-bold">samir.bhandari666@gmail.com</a> or call <a href="tel:+9779800548346" className="font-mono font-bold text-white">9800548346</a>.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
