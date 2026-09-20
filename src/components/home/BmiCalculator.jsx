import React, { useState, useMemo } from 'react';
import { Calculator, Flame, Dumbbell, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function BmiCalculator({ onOpenJoinModal }) {
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [goal, setGoal] = useState('fatloss'); // 'fatloss' | 'muscle' | 'endurance'

  // BMI calculation
  const bmiData = useMemo(() => {
    const hMeter = heightCm / 100;
    const val = (weightKg / (hMeter * hMeter)).toFixed(1);
    const num = parseFloat(val);

    let category = 'Healthy Weight';
    let colorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    let recommendedClass = 'HIIT Surge 45';
    let recommendedPlan = 'Pro Standard (NPR 4,500)';

    if (num < 18.5) {
      category = 'Underweight';
      colorClass = 'text-sky-400 border-sky-500/30 bg-sky-500/10';
      recommendedClass = 'Iron Forge Strength';
      recommendedPlan = 'VIP Elite (NPR 7,500)';
    } else if (num >= 18.5 && num < 25) {
      category = 'Optimal Fitness Zone';
      colorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      recommendedClass = goal === 'muscle' ? 'Iron Forge Strength' : 'Combat HIIT 60';
      recommendedPlan = 'Pro Standard (NPR 4,500)';
    } else if (num >= 25 && num < 30) {
      category = 'Overweight';
      colorClass = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      recommendedClass = 'HIIT Surge 45 & Cardio Matrix';
      recommendedPlan = 'Pro Standard (NPR 4,500)';
    } else {
      category = 'High BMI';
      colorClass = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      recommendedClass = 'Functional Metabolic Conditioning';
      recommendedPlan = 'VIP Elite (NPR 7,500)';
    }

    // Rough calorie baseline
    let calorieBase = Math.round(weightKg * 24 * 1.2);
    if (goal === 'fatloss') calorieBase -= 400;
    if (goal === 'muscle') calorieBase += 350;

    return {
      bmi: val,
      category,
      colorClass,
      recommendedClass,
      recommendedPlan,
      targetCalories: calorieBase,
    };
  }, [heightCm, weightKg, goal]);

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            Interactive Fitness Index
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Calculate Your Body Metric & Goal
          </h2>
          <p className="text-sm text-slate-400">
            Get an instant scientific BMI score, daily target calorie estimate, and personalized Goodlife training program recommendation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Left: Input sliders */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-sm">
            
            {/* Height */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Height</span>
                <span className="text-emerald-400 font-mono text-sm">{heightCm} cm</span>
              </div>
              <input
                type="range"
                min={130}
                max={220}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>130 cm</span>
                <span>175 cm</span>
                <span>220 cm</span>
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Body Weight</span>
                <span className="text-emerald-400 font-mono text-sm">{weightKg} kg</span>
              </div>
              <input
                type="range"
                min={40}
                max={150}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>40 kg</span>
                <span>75 kg</span>
                <span>150 kg</span>
              </div>
            </div>

            {/* Fitness Goal */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">Primary Objective</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'fatloss', label: 'Fat Loss', icon: Flame },
                  { id: 'muscle', label: 'Muscle Gain', icon: Dumbbell },
                  { id: 'endurance', label: 'Endurance', icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = goal === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGoal(item.id)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right: Results Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">YOUR METRIC SCORE</span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-white font-mono">{bmiData.bmi}</span>
                <span className="text-xs text-slate-400 font-mono">BMI Index</span>
              </div>
              <div className="pt-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${bmiData.colorClass}`}>
                  {bmiData.category}
                </span>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-800/80 pt-4 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Daily Target Calories:</span>
                <span className="font-mono font-bold text-white text-sm">{bmiData.targetCalories} kcal</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Recommended Class:</span>
                <span className="font-bold text-emerald-400">{bmiData.recommendedClass}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Best Matching Plan:</span>
                <span className="font-mono font-bold text-amber-400">{bmiData.recommendedPlan}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenJoinModal}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Claim 1-Day Free Trial For Your Goal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Ghattekulo Facility • 100% Free Trial • No Commitment
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
