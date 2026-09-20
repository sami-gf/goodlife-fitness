import React, { useState, useEffect } from 'react';
import { Cookie, X, ShieldCheck } from 'lucide-react';

const COOKIE_KEY = 'goodlife_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Delay showing for 1.5s after page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Your Privacy Matters
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl leading-relaxed">
              Goodlife Fitness uses cookies to enhance your browsing experience, remember your bookings, and analyze site traffic. 
              By continuing, you consent to our{' '}
              <a href="/privacy" className="text-emerald-400 hover:underline font-medium">Privacy Policy</a>
              {' '}and{' '}
              <a href="/terms" className="text-emerald-400 hover:underline font-medium">Terms of Service</a>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 pl-13 sm:pl-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            Accept All Cookies
          </button>
          <button
            onClick={handleDecline}
            className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Dismiss cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
