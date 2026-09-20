import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      id: 1,
      name: 'Prashant Thapa',
      role: 'Member since 2024',
      location: 'Kathmandu Central',
      rating: 5,
      achievement: 'Lost 14 kg & gained 6 kg lean muscle',
      comment: 'Goodlife is unlike any standard local gym. The 24/7 keycard access means I can lift at 10 PM after my coding shifts. Clean saunas and world-class Rogue iron equipment!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Sneha Adhikari',
      role: 'Pro Member',
      location: 'Pokhara Lakeside',
      rating: 5,
      achievement: 'Completed 60+ Spin & Power Yoga Classes',
      comment: 'The rhythm spin classes with Sujata are unbelievable. Music is loud, energy is electric, and the app makes slot booking completely seamless. Worth every rupee!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Bikash Karki',
      role: 'VIP Member',
      location: 'Kathmandu Central',
      rating: 5,
      achievement: 'Increased Squat PR from 90kg to 165kg',
      comment: 'Coach Aarav’s heavy lifting technique coaching completely saved my lower back and took my squat to competitive levels. The steam room after heavy leg day is pure luxury.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
    }
  ];

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-amber-400 font-mono text-xs uppercase tracking-widest font-semibold">
            REAL MEMBER SUCCESS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            TRANSFORMATIONS THAT <span className="text-gradient-emerald">SPEAK VOLUMES</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Read authentic reviews from members training daily at Goodlife Fitness across Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="glass-card rounded-3xl p-8 border border-slate-800 flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors" />

              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{rev.achievement}</span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-4">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover border border-emerald-500/40"
                />
                <div>
                  <h4 className="text-base font-bold text-white">{rev.name}</h4>
                  <p className="text-xs text-slate-400">{rev.role} • {rev.location}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
