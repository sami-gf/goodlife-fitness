import React from 'react';
import SEOHead from '../components/SEOHead';
import BenefitsCarousel from '../components/home/BenefitsCarousel';
import TestimonialsSection from '../components/home/TestimonialsSection';
import { ShieldCheck, Target, Award, MapPin, Phone, Mail, ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About({ onOpenJoinModal }) {
  return (
    <div className="py-12 bg-[#0b0f17] min-h-screen relative space-y-16">
      <SEOHead 
        title="About Us & Member Stories" 
        description="Learn about Goodlife Fitness in Ghattekulo, Kathmandu (44600). Our story, 24/7 access benefits, certified coaches, and member transformations."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
            <Flame className="w-3.5 h-3.5 fill-emerald-400" /> THE GOODLIFE MISSION
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white">
            REDEFINING FITNESS IN <span className="text-gradient-emerald">KATHMANDU</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Located in Ghattekulo (Postal Code 44600), Goodlife Fitness is dedicated to providing world-class training infrastructure, transparent NPR pricing, and elite coaching for everyone.
          </p>
        </div>

        {/* Story Grid */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Strength, Science & Uncompromising Quality
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Founded with a bold vision to elevate fitness standards across Nepal, Goodlife Fitness combines imported competition-grade equipment with internationally certified personal trainers and luxury recovery amenities.
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                Whether you are stepping into a gym for the first time or training for national powerlifting meets, our community provides the supportive, non-intimidating environment you need to excel.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400 font-bold block text-lg">24/7/365</span>
                  <span className="text-slate-400">Unrestricted Access</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-bold block text-lg">15,000+</span>
                  <span className="text-slate-400">Sq. Ft. Facility</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-teal-400 font-bold block text-lg">100% NPR</span>
                  <span className="text-slate-400">Clear Pricing</span>
                </div>
              </div>
            </div>

            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop"
                alt="Gym community"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-mono text-emerald-400 font-bold">ESTABLISHED IN KATHMANDU</span>
                <p className="text-sm font-semibold">Ghattekulo Main Branch • Postal Code: 44600</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* The 5 Key Benefits Carousel Component */}
      <BenefitsCarousel />

      {/* Member Testimonials Component */}
      <TestimonialsSection />

      {/* CTA Box */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-emerald-500/30 text-center space-y-6">
          <h3 className="text-3xl sm:text-4xl font-black text-white">Ready to Transform Your Lifestyle?</h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Join hundreds of members achieving their fitness goals daily at Goodlife Fitness in Ghattekulo, Kathmandu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenJoinModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-xl hover:scale-105 transition-transform cursor-pointer"
            >
              Sign Up Now (NPR Plans)
            </button>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-white font-bold text-sm hover:bg-slate-800 transition-colors"
            >
              Visit Ghattekulo Branch
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
