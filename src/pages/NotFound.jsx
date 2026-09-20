import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, DollarSign, User, MapPin, Flame, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const quickLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/classes', label: 'Class Schedule', icon: Calendar },
    { to: '/pricing', label: 'NPR Pricing', icon: DollarSign },
    { to: '/instructors', label: 'Coaches', icon: User },
    { to: '/contact', label: 'Contact', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center px-4 relative overflow-hidden error-404-grid">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-amber-500/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-10 animate-fade-in-up">
        
        {/* Logo badge */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Flame className="w-5 h-5 text-emerald-400 fill-emerald-400" />
          </div>
          <span className="text-white font-black text-lg tracking-tight">
            GOODLIFE <span className="text-gradient-emerald">FITNESS</span>
          </span>
        </div>

        {/* 404 display */}
        <div>
          <div className="text-[140px] sm:text-[180px] font-black leading-none tracking-tighter">
            <span className="text-gradient-emerald">4</span>
            <span className="text-slate-800">0</span>
            <span className="text-gradient-emerald">4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white -mt-4">
            PAGE NOT FOUND
          </h1>
          <p className="text-slate-400 text-sm mt-3 max-w-sm mx-auto">
            Looks like this page went off the treadmill. Head back and explore what Goodlife Fitness has to offer.
          </p>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
          {quickLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all group"
            >
              <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{label}</span>
              <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>

        {/* Go home CTA */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 transition-transform"
        >
          <Home className="w-5 h-5" />
          Back to Homepage
        </Link>

        {/* Contact info */}
        <p className="text-xs text-slate-600 font-mono">
          Need help? Call{' '}
          <a href="tel:+9779800548346" className="text-emerald-400 font-bold hover:underline">
            9800548346
          </a>{' '}
          or visit us at Ghattekulo, Kathmandu (44600)
        </p>
      </div>
    </div>
  );
}
