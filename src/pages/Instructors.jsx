import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import InstructorCard from '../components/instructors/InstructorCard';
import { Instructor } from '../base44/entities/Instructor';
import { Award, Star, CheckCircle, X, Calendar, Clock, Sparkles } from 'lucide-react';

export default function Instructors() {
  const [searchParams] = useSearchParams();
  const coachParam = searchParams.get('coach') || '';

  const allInstructors = Instructor.getAll();
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [bookingCoach, setBookingCoach] = useState(null);
  const [sessionBooked, setSessionBooked] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    notes: ''
  });

  useEffect(() => {
    if (coachParam) {
      const match = allInstructors.find(i => i.name.toLowerCase().includes(coachParam.toLowerCase()));
      if (match) setBookingCoach(match);
    }
  }, [coachParam, allInstructors]);

  const specialtiesList = ['All', 'HIIT', 'Strength & Power', 'Power Yoga', 'Boxing Club', 'Spin Burn', 'CrossFit Matrix'];

  const filteredInstructors = selectedSpecialty === 'All'
    ? allInstructors
    : allInstructors.filter(inst => inst.specialties.includes(selectedSpecialty));

  const handleSessionSubmit = (e) => {
    e.preventDefault();
    setSessionBooked(true);
    setTimeout(() => {
      setBookingCoach(null);
      setSessionBooked(false);
      setBookingForm({ name: '', email: '', phone: '', preferredDate: '', notes: '' });
    }, 2500);
  };

  return (
    <div className="py-12 bg-[#0b0f17] min-h-screen relative">
      <SEOHead 
        title="Certified Master Trainers & Coaches" 
        description="Meet Goodlife Fitness master coaches in Ghattekulo, Kathmandu (44600). Certified CSCS, ACE, and 500-hr RYT trainers. Book private 1-on-1 personal coaching sessions."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
            <Award className="w-3.5 h-3.5" /> ELITE ATHLETIC COACHING STAFF
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white">
            MEET OUR <span className="text-gradient-gold">MASTER TRAINERS</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Internationally certified coaches in Ghattekulo, Kathmandu dedicated to personalizing your training regimen for peak athletic performance.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {specialtiesList.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredInstructors.map((coach) => (
            <InstructorCard
              key={coach.id}
              instructor={coach}
              onBookPrivateSession={(c) => setBookingCoach(c)}
            />
          ))}
        </div>

      </div>

      {/* Private Session Booking Modal */}
      {bookingCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <button
              onClick={() => setBookingCoach(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                1-ON-1 PERSONAL COACHING
              </span>
              <h3 className="text-2xl font-black text-white mt-1">Book Session with {bookingCoach.name}</h3>
              <p className="text-xs text-slate-400">{bookingCoach.role} • Ghattekulo Branch</p>
            </div>

            {sessionBooked ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white">Private Session Requested!</h4>
                <p className="text-xs text-slate-300">{bookingCoach.name} will review your request and confirm via phone.</p>
              </div>
            ) : (
              <form onSubmit={handleSessionSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    placeholder="e.g. Samir Bhandari"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="samir.bhandari666@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      placeholder="9800548346"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Date & Goal</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="e.g. Tomorrow 5 PM — Powerlifting form check"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    Send Session Request
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
