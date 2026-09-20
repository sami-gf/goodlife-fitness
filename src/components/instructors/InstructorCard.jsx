import React, { useState } from 'react';
import { Star, Award, Calendar, ChevronDown, ChevronUp, CheckCircle, X } from 'lucide-react';

export default function InstructorCard({ instructor, onBookPrivateSession }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between group">
      <div>
        
        {/* Photo Header */}
        <div className="relative h-72 overflow-hidden">
          <img
            src={instructor.photo}
            alt={instructor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs text-amber-400 font-bold flex items-center gap-1 border border-slate-800">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{instructor.rating} ({instructor.reviewsCount})</span>
          </div>

          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
              {instructor.experience} PROFESSIONAL
            </span>
            <h3 className="text-xl font-black text-white">{instructor.name}</h3>
            <p className="text-xs text-slate-300 font-medium">{instructor.role}</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          <div className="flex flex-wrap gap-1.5">
            {instructor.specialties.map((spec, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300">
                {spec}
              </span>
            ))}
          </div>

          <p className={`text-xs text-slate-400 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {instructor.bio}
          </p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>{expanded ? 'Show Less' : 'Read Full Bio'}</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs italic text-slate-300">
            "{instructor.quote}"
          </div>

        </div>
      </div>

      <div className="p-6 pt-0 space-y-2">
        <button
          onClick={() => onBookPrivateSession(instructor)}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Book 1-on-1 Session</span>
        </button>
      </div>

    </div>
  );
}
