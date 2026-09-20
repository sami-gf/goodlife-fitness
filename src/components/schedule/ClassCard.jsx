import React from 'react';
import { Clock, MapPin, HeartPulse, User, Users, CheckCircle, Flame } from 'lucide-react';

export default function ClassCard({ classData, onSelectBooking, isAlreadyBooked }) {
  const spotsLeft = classData.capacity - classData.bookedCount;
  const isFull = spotsLeft <= 0;

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between group">
      
      <div>
        {/* Top Image Banner */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={classData.image}
            alt={classData.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-emerald-400 font-bold uppercase">
              {classData.category}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
              isFull
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : spotsLeft <= 3
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isFull ? 'FULL SPOT' : `${spotsLeft} SPOTS LEFT`}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> {classData.day} • {classData.time}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          
          <div>
            <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
              {classData.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{classData.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs py-1">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <User className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-500 block">Coach</span>
                <span className="font-bold text-slate-200 truncate">{classData.instructorName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-500 block">Location</span>
                <span className="font-bold text-slate-200 truncate">{classData.room}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-1 text-slate-300">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" /> {classData.caloriesBurned}
            </span>
            <span className="text-slate-400 font-mono">Intensity: <strong className="text-amber-400">{classData.intensity}</strong></span>
          </div>

        </div>
      </div>

      {/* Booking Action */}
      <div className="p-6 pt-0">
        {isAlreadyBooked ? (
          <button
            disabled
            className="w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Spot Reserved
          </button>
        ) : (
          <button
            disabled={isFull}
            onClick={() => onSelectBooking(classData)}
            className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              isFull
                ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
            }`}
          >
            {isFull ? 'Class Fully Booked' : 'Reserve Spot Now'}
          </button>
        )}
      </div>

    </div>
  );
}
