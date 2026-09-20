import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, ArrowUpRight } from 'lucide-react';
import { Instructor } from '../../base44/entities/Instructor';

export default function CoachSpotlights() {
  const coaches = Instructor.getAll();

  return (
    <section className="py-20 bg-[#0b0f17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest font-semibold">
              EXPERT LEADERSHIP
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-1">
              MEET OUR <span className="text-gradient-gold">MASTER COACHES</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mt-2">
              Trainers who walk the talk. Certified internationally to help you smash plateaus and prevent injury.
            </p>
          </div>

          <Link
            to="/instructors"
            className="self-start md:self-auto px-5 py-2.5 rounded-xl glass-panel text-xs text-white font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <span>All Instructor Bios</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coaches.slice(0, 4).map((coach) => (
            <div
              key={coach.id}
              className="glass-card card-shine rounded-2xl overflow-hidden group border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={coach.photo}
                    alt={`Coach ${coach.name} — Goodlife Fitness`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] text-amber-400 font-bold flex items-center gap-1 border border-slate-800">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{coach.rating} ({coach.reviewsCount})</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                      {coach.experience} EXPERIENCE
                    </span>
                    <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                      {coach.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{coach.role}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {coach.specialties.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 italic line-clamp-2 pt-1">
                    "{coach.quote}"
                  </p>
                </div>
              </div>

              {/* Fixed: Using Calendar icon instead of Instagram icon for booking */}
              <div className="p-5 pt-0">
                <Link
                  to="/instructors"
                  className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-emerald-500/30 hover:border-emerald-500/50"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Private Session</span>
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
