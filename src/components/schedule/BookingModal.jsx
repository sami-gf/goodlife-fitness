import React, { useState } from 'react';
import { X, CheckCircle, Calendar, Clock, MapPin, User, ShieldCheck } from 'lucide-react';
import { Booking } from '../../base44/entities/Booking';
import { User as UserEntity } from '../../base44/entities/User';
import { bookClass } from '../../services/api';

export default function BookingModal({ classData, onClose, onBookingSuccess }) {
  const defaultUser = UserEntity.getProfile();

  const [name, setName] = useState(defaultUser.name || '');
  const [email, setEmail] = useState(defaultUser.email || '');
  const [phone, setPhone] = useState(defaultUser.phone || '');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const newBooking = Booking.createBooking(classData, { name, email, phone });
      bookClass({
        memberName: name,
        memberEmail: email,
        memberPhone: phone,
        classId: classData.id,
        className: classData.title || classData.classTitle,
        classDay: classData.day,
        classTime: classData.time,
        classRoom: classData.room,
        instructorName: classData.instructorName,
        category: classData.category,
      }).catch(console.error);

      setIsSubmitting(false);
      onBookingSuccess(newBooking);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to book slot.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
            RESERVE CLASS SPOT
          </span>
          <h3 className="text-2xl font-black text-white mt-1">{classData.title}</h3>
          <p className="text-xs text-slate-400">Confirmation details will be sent to your email.</p>
        </div>

        {/* Class Overview Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-mono text-emerald-400">
              <Calendar className="w-3.5 h-3.5" /> {classData.day}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-amber-400">
              <Clock className="w-3.5 h-3.5" /> {classData.time}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
            <span>Coach: <strong className="text-white">{classData.instructorName}</strong></span>
            <span>Room: <strong className="text-white">{classData.room}</strong></span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+977 9801234567"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Confirming...' : 'Confirm Class Booking'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
