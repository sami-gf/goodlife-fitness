import React from 'react';
import { Check, Sparkles, Flame, Shield } from 'lucide-react';
import { Membership } from '../../base44/entities/Membership';

export default function PlanCard({ plan, isAnnual, onSelectPlan }) {
  const price = isAnnual ? plan.priceAnnualNPR : plan.priceMonthlyNPR;
  const isVIP = plan.id === 'vip-elite';

  return (
    <div className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
      plan.popular
        ? 'glass-card border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-105 z-10'
        : isVIP
        ? 'glass-card border-2 border-amber-500/80 shadow-2xl shadow-amber-500/10'
        : 'glass-card border border-slate-800'
    }`}>

      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
          {plan.badge}
        </div>
      )}

      {isVIP && !plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
          {plan.badge}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-black text-white">{plan.name}</h3>
          {plan.category === 'pass' && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
              Single Pass
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 mb-6">{plan.tagline}</p>

        {/* NPR Pricing Display */}
        <div className="mb-6 pb-6 border-b border-slate-800">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-emerald-400">NPR</span>
            <span className="text-4xl font-black text-white tracking-tight">
              {price.toLocaleString('en-NP')}
            </span>
            <span className="text-xs text-slate-400">
              {plan.category === 'pass' ? '/ day' : isAnnual ? '/ mo (annual)' : '/ month'}
            </span>
          </div>

          {isAnnual && plan.category !== 'pass' && (
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
              Save 20% compared to monthly
            </span>
          )}
        </div>

        {/* Features Checklist */}
        <div className="space-y-3 mb-8">
          {plan.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs text-slate-300">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                plan.popular ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-emerald-400'
              }`}>
                <Check className="w-3 h-3" />
              </div>
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={() => onSelectPlan(plan)}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg ${
            plan.popular
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/25 hover:scale-102'
              : isVIP
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-amber-500/20 hover:scale-102'
              : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-800'
          }`}
        >
          {plan.ctaText}
        </button>
      </div>

    </div>
  );
}
