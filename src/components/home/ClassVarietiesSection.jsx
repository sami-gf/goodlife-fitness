import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Flame, Dumbbell, Sparkles, HeartPulse, Activity, Zap, ArrowUpRight, X } from 'lucide-react';
import { StudioClass } from '../../base44/entities/StudioClass';

export default function ClassVarietiesSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalClass, setActiveModalClass] = useState(null);

  const categories = ['All', 'HIIT', 'Strength', 'Yoga', 'Boxing', 'Spin', 'Pilates'];
  const allClasses = StudioClass.getAll();

  const filteredClasses = selectedCategory === 'All'
    ? allClasses
    : allClasses.filter(c => c.category === selectedCategory);

  return (
    <section className="py-20 bg-[#0b0f17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest font-semibold mb-2">
              <Zap className="w-4 h-4" /> DIVERSE FITNESS DISCIPLINES
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              ENGINEERED FOR <span className="text-gradient-emerald">MAXIMUM RESULTS</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mt-2">
              From explosive HIIT cardio to high-tonnage strength training and restorative yoga flows, discover classes crafted by certified athletic trainers.
            </p>
          </div>

          <Link
            to="/schedule"
            className="self-start md:self-auto px-5 py-2.5 rounded-xl glass-panel text-xs text-white font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <span>Full Class Schedule</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => setActiveModalClass(item)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  {item.category}
                </span>

                <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  item.intensity === 'High' || item.intensity === 'Advanced'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                }`}>
                  {item.intensity} Intensity
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{item.day} • {item.time}</span>
                  <span className="text-emerald-400 font-bold">{item.room}</span>
                </div>

                <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <HeartPulse className="w-4 h-4 text-emerald-400" />
                    <span>{item.caloriesBurned}</span>
                  </div>
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    Book Spot <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {activeModalClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <button
              onClick={() => setActiveModalClass(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
              {activeModalClass.category} • {activeModalClass.room}
            </span>

            <h3 className="text-2xl font-black text-white">{activeModalClass.title}</h3>

            <p className="text-sm text-slate-300 leading-relaxed">{activeModalClass.description}</p>

            <div className="grid grid-cols-2 gap-3 py-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Instructor</span>
                <span className="font-bold text-white">{activeModalClass.instructorName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Schedule</span>
                <span className="font-bold text-emerald-400">{activeModalClass.day} ({activeModalClass.time})</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                to="/schedule"
                className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-center text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
              >
                Go to Schedule & Reserve
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
