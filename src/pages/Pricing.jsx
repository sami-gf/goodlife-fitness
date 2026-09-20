import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import PlanCard from '../components/pricing/PlanCard';
import { Membership, ADD_ONS } from '../base44/entities/Membership';
import { Sparkles, CheckCircle, HelpCircle, Calculator, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export default function Pricing({ onOpenJoinModal }) {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);

  const plans = Membership.getAll();


  const toggleAddon = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const calculateAddonTotal = () => {
    return selectedAddons.reduce((sum, id) => {
      const addon = ADD_ONS.find(a => a.id === id);
      return sum + (addon ? addon.priceNPR : 0);
    }, 0);
  };

  const faqs = [
    {
      q: 'Where is Goodlife Fitness located?',
      a: 'We are located at Ghattekulo, Kathmandu, Nepal (Postal Code: 44600). Open 24/7 with dedicated parking and biometric keycard access.'
    },
    {
      q: 'Are there any hidden sign-up or lock-in contract fees?',
      a: 'Zero hidden fees. We believe in transparent NPR (Nepali Rupees) pricing. Monthly plans can be cancelled anytime with a 7-day advance notice.'
    },
    {
      q: 'What payment methods do you accept in Nepal?',
      a: 'We accept eSewa, Khalti, ConnectIPS, Visa/Mastercard debit/credit cards, and cash payments at our Ghattekulo reception.'
    },
    {
      q: 'What is included in the Day Pass (NPR 1,200)?',
      a: 'The Day Pass grants single-day full access to all cardio, strength, sauna facilities, lockers, and showers.'
    }
  ];


  return (
    <div className="py-12 bg-[#0b0f17] min-h-screen relative">
      <SEOHead 
        title="NPR Pricing & Membership Plans" 
        description="Transparent membership plans in Nepali Rupees (NPR) at Goodlife Fitness Ghattekulo, Kathmandu (44600). Day Pass, Monthly, and Annual 20% discount plans."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> TRANSPARENT NPR PRICING
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white">
            INVEST IN YOUR <span className="text-gradient-emerald">BEST SELF</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Choose from flexible monthly or annual memberships in Nepalese Rupees (NPR). No hidden charges.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="pt-6 flex items-center justify-center gap-4">
            <span className={`text-xs font-bold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>Monthly Billing</span>
            
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 rounded-full bg-slate-900 border border-slate-800 p-1 transition-colors"
            >
              <div className={`w-6 h-6 rounded-full bg-emerald-500 shadow-md transition-transform duration-300 ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>

            <span className={`text-xs font-bold flex items-center gap-1.5 ${isAnnual ? 'text-emerald-400' : 'text-slate-400'}`}>
              Annual Billing
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Membership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isAnnual={isAnnual}
              onSelectPlan={() => onOpenJoinModal(plan)}
            />
          ))}
        </div>

        {/* Add-on Cost Estimator Section */}
        <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4" /> Add-On Customizer
              </span>
              <h3 className="text-2xl font-black text-white mt-1">Customize Your Membership</h3>
              <p className="text-xs text-slate-400">Select optional add-on services to see real-time NPR totals.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-500 uppercase block font-mono">Estimated Add-Ons Total</span>
              <span className="text-2xl font-black text-emerald-400">
                {Membership.formatNPR(calculateAddonTotal())} <span className="text-xs text-slate-400 font-normal">/mo</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ADD_ONS.map((addon) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs text-white">{addon.name}</h4>
                    <span className="text-xs text-emerald-400 font-mono font-semibold">
                      +{Membership.formatNPR(addon.priceNPR)}/mo
                    </span>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-slate-700'
                  }`}>
                    {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400">Got questions before joining? We've got answers.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between gap-4"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Accepted Payment Methods & Nepal Trust Badges */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 p-8 text-center space-y-6 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> SECURE NPR TRANSACTIONS
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Accepted Digital & Cash Payment Methods in Nepal
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Pay seamlessly online or visit our Ghattekulo reception. Instant receipt and biometric access key generation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'eSewa', sub: 'Digital Wallet', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
              { name: 'Khalti', sub: 'Digital Wallet', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
              { name: 'Fonepay', sub: 'Instant QR', color: 'border-rose-500/40 text-rose-400 bg-rose-500/10' },
              { name: 'ConnectIPS', sub: 'Bank Transfer', color: 'border-sky-500/40 text-sky-400 bg-sky-500/10' },
              { name: 'Visa / Master', sub: 'Debit & Credit', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
              { name: 'Counter Cash', sub: 'Ghattekulo Desk', color: 'border-slate-700 text-slate-300 bg-slate-800/40' },
            ].map((p, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border ${p.color} flex flex-col items-center justify-center transition-all hover:scale-105`}
              >
                <span className="font-black text-xs">{p.name}</span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">{p.sub}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Transparent NPR billing • Zero hidden maintenance fees
            </span>
            <button
              onClick={() => onOpenJoinModal && onOpenJoinModal({ id: 'pro-standard' })}
              className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Get Started with NPR Plan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
