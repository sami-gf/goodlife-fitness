import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import GlobalSearchModal from './GlobalSearchModal';
import CookieConsent from './CookieConsent';
import WhatsAppButton from './WhatsAppButton';
import { ArrowUp, X, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { Membership } from '../base44/entities/Membership';
import { registerMember } from '../services/api';

// ─── Simple Input Sanitizer ───────────────────────────────────────────────────
function sanitizeInput(str) {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ─── Rate limiter (max 3 form submissions per 60s) ───────────────────────────
const submissionLog = [];
function isRateLimited() {
  const now = Date.now();
  const windowMs = 60 * 1000;
  // Purge old entries
  while (submissionLog.length > 0 && now - submissionLog[0] > windowMs) {
    submissionLog.shift();
  }
  if (submissionLog.length >= 3) return true;
  submissionLog.push(now);
  return false;
}

export default function Layout({ children }) {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('pro-standard');
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: 'Fat Loss & Conditioning',
    preferredTime: 'Morning (6:00 AM - 9:00 AM)',
    branch: 'Ghattekulo Main Branch (Kathmandu 44600)'
  });

  // Page transition on route change
  useEffect(() => {
    setIsTransitioning(true);
    const t = setTimeout(() => setIsTransitioning(false), 350);
    return () => clearTimeout(t);
  }, [location.pathname]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Back-to-top visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global keyboard shortcut: ⌘K opens search
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setJoinModalOpen(false);
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showToast = useCallback((msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4500);
  }, []);

  const openJoinModal = useCallback((plan) => {
    if (plan?.id) setSelectedPlanId(plan.id);
    setJoinModalOpen(true);
    setFormSubmitted(false);
  }, []);

  // ─── Form submit with immediate local persistence & validation ─────────────
  const handleJoinSubmit = (e) => {
    e.preventDefault();

    const cleanName = sanitizeInput(formData.name.trim());
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanPhone = formData.phone.trim().replace(/[^\d+]/g, '');

    if (cleanName.length < 2) {
      showToast('Please enter your full name (at least 2 letters).', 'error');
      return;
    }
    if (!/^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i.test(cleanEmail)) {
      showToast('Please enter a valid email address (e.g. name@gmail.com).', 'error');
      return;
    }
    if (cleanPhone.length < 7) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    setFormSubmitted(true);

    // Save INSTANTLY to local storage & sync to database
    registerMember({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      planId: selectedPlanId,
      goal: formData.goal,
      preferredTime: formData.preferredTime,
      branch: formData.branch,
    });

    showToast(`Welcome to Goodlife Fitness, ${cleanName}! Your registration is saved.`);
    setTimeout(() => {
      setJoinModalOpen(false);
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        goal: 'Fat Loss & Conditioning',
        preferredTime: 'Morning (6:00 AM - 9:00 AM)',
        branch: 'Ghattekulo Main Branch (Kathmandu 44600)'
      });
    }, 2000);
  };

  const memberships = Membership.getAll();

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">

      {/* Skip to main content (Accessibility) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navbar */}
      <Header
        onOpenJoinModal={() => openJoinModal()}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Page Content with transition */}
      <main
        id="main-content"
        className={`flex-grow ${isTransitioning ? 'opacity-0' : 'page-transition opacity-100'}`}
        style={{ transition: 'opacity 0.3s ease' }}
      >
        {React.cloneElement(children, {
          onOpenJoinModal: openJoinModal,
          onOpenSearch: () => setSearchModalOpen(true)
        })}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-emerald-500 text-slate-950 font-bold shadow-xl shadow-emerald-500/30 hover:scale-110 transition-all duration-300 group cursor-pointer"
          aria-label="Scroll back to top"
          title="Back to top"
        >
          <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-4 sm:left-6 z-50 max-w-sm sm:max-w-md bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300 ${
            toastType === 'error'
              ? 'border border-rose-500/40'
              : 'border border-emerald-500/40'
          }`}
          role="alert"
          aria-live="polite"
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            toastType === 'error'
              ? 'bg-rose-500/20 text-rose-400'
              : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h5 className={`font-bold text-sm ${toastType === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {toastType === 'error' ? 'Notice' : 'Success'}
            </h5>
            <p className="text-xs text-slate-300 break-words">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Join Membership Modal */}
      {joinModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setJoinModalOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="join-modal-title"
        >
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/8 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={() => setJoinModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/70 hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close join modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest font-semibold mb-1">
                <Sparkles className="w-4 h-4" /> Start Your Journey
              </div>
              <h3 id="join-modal-title" className="text-2xl font-black text-white">
                Join Goodlife Fitness
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Ghattekulo, Kathmandu (44600) • 24/7 Access • Secure Form
              </p>

              {formSubmitted ? (
                <div className="py-10 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Welcome Aboard! 🎉</h4>
                  <p className="text-sm text-slate-300 max-w-xs mx-auto">
                    Your membership has been reserved. Our team will call you at{' '}
                    <span className="text-emerald-400 font-mono font-bold">9800548346</span>{' '}
                    within 1 hour.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleJoinSubmit} className="space-y-4">
                  {/* Plan selector */}
                  <div>
                    <label htmlFor="join-plan" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Select Membership Plan (NPR)
                    </label>
                    <select
                      id="join-plan"
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      {memberships.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} — {Membership.formatNPR(m.priceMonthlyNPR)}/month
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="join-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="join-name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={60}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Samir Bhandari"
                      autoComplete="name"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="join-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="join-email"
                        type="email"
                        required
                        maxLength={100}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        autoComplete="email"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="join-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Nepal Phone <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="join-phone"
                        type="tel"
                        required
                        maxLength={15}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="98XXXXXXXX"
                        autoComplete="tel"
                        pattern="[0-9+\s\-]{10,15}"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Goal & Preferred Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="join-goal" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Primary Fitness Goal
                      </label>
                      <select
                        id="join-goal"
                        value={formData.goal}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                        <option value="Muscle Hypertrophy & Strength">Muscle Hypertrophy & Strength</option>
                        <option value="Tactical Boxing & Combat">Tactical Boxing & Combat</option>
                        <option value="General Health & Endurance">General Health & Endurance</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="join-time" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Preferred Training Time
                      </label>
                      <select
                        id="join-time"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="Morning (6:00 AM - 9:00 AM)">Morning (6:00 AM - 9:00 AM)</option>
                        <option value="Day (11:00 AM - 3:00 PM)">Day (11:00 AM - 3:00 PM)</option>
                        <option value="Evening (5:00 PM - 9:00 PM)">Evening (5:00 PM - 9:00 PM)</option>
                        <option value="Late Night / 24/7 Access">Late Night / 24/7 Access</option>
                      </select>
                    </div>
                  </div>

                  {/* Location (readonly) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Facility Branch</label>
                    <input
                      type="text"
                      readOnly
                      value="Ghattekulo, Kathmandu (Postal Code: 44600)"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-emerald-400 font-medium cursor-default"
                      aria-readonly="true"
                    />
                  </div>

                  {/* Security note */}
                  <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-500/60" />
                    Your data is encrypted and never shared with third parties.
                  </p>

                  {/* Submit */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      🔥 Complete NPR Registration
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
