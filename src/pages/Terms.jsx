import React, { useEffect } from 'react';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-16 bg-[#0b0f17] min-h-screen text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
            <FileText className="w-3.5 h-3.5" /> TERMS OF SERVICE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">Terms & Conditions</h1>
          <p className="text-xs text-slate-400 font-mono">Effective Date: January 2026 • Goodlife Fitness (Ghattekulo, Kathmandu 44600)</p>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white">1. Membership Conduct & Etiquette</h3>
            <p>
              Members are required to re-rack weights after use, wipe down machines with provided sanitizing wipes, and wear proper athletic footwear at all times inside our Ghattekulo gym premises.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white">2. 24/7 Keycard Usage & Security</h3>
            <p>
              Keycards are strictly non-transferable. Tailgating or permitting non-members entry without prior guest registration incurs a penalty fine of NPR 5,000 and potential membership termination.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white">3. Cancellation & NPR Billing Policy</h3>
            <p>
              Monthly memberships require a 7-day cancellation notification prior to the billing date. Annual passes paid in NPR are non-refundable after a 14-day trial period.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white">4. Inquiries & Support</h3>
            <p className="text-xs text-slate-400">
              For billing questions, email samir.bhandari666@gmail.com or call reception at +977 9800548346.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
