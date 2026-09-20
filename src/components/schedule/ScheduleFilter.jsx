import React from 'react';
import { Search, Filter, Calendar, Zap, Layers } from 'lucide-react';

export default function ScheduleFilter({
  selectedDay,
  setSelectedDay,
  selectedCategory,
  setSelectedCategory,
  selectedIntensity,
  setSelectedIntensity,
  searchQuery,
  setSearchQuery
}) {
  const days = ['All Days', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const categories = ['All Categories', 'HIIT', 'Strength', 'Yoga', 'Boxing', 'Spin', 'CrossFit', 'Pilates'];
  const intensities = ['All Intensities', 'Low', 'Moderate', 'High', 'Advanced'];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
      
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by class title, instructor (e.g. Aarav), or room..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Day Picker Pills */}
      <div>
        <label className="block text-xs font-mono text-slate-400 font-semibold uppercase mb-2.5 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Select Day of Week
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedDay === d
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Category & Intensity Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-mono text-slate-400 font-semibold uppercase mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> Discipline
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 font-semibold uppercase mb-1.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Intensity Level
          </label>
          <select
            value={selectedIntensity}
            onChange={(e) => setSelectedIntensity(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            {intensities.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
}
