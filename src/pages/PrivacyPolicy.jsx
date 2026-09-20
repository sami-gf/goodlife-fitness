import React, { useEffect } from 'react';
import { Shield, Lock, Eye, FileText, Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-16 bg-[#0b0f17] min-h-screen text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
            <Shield className="w-3.5 h-3.5" /> LEGAL DOCUMENTATION
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400 font-mono">Last Updated: January 2026 • Goodlife Fitness (Ghattekulo, Kathmandu)</p>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white">1. Information We Collect</h3>
            <p>
              Goodlife Fitness collects personal information required for membership administration, biometric keycard entry security, class booking reservations, and safety protocols at our Ghattekulo, Kathmandu facility (Postal Code: 44600).
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
              <li>Full Name, Mobile Number (e.g. 9800548346), Email Address</li>
              <li>Billing information & NPR (Nepali Rupees) payment confirmation records</li>
              <li>Biometric keycard logs for 24/7 security entry</li>
              <li>Emergency contact information and basic health clearances</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white">2. How We Use Your Data</h3>
            <p>
              Your data is strictly utilized to facilitate seamless gym entry, manage class capacity limits, communicate promotional NPR membership discounts, and maintain facility hygiene standards.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-white">3. Data Protection & Third Parties</h3>
            <p>
              We do not sell or lease member information to third-party advertisers. All biometric encryption and digital payments comply with standard ISO security protocols.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-lg font-bold text-white">4. Contact Officer</h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Goodlife Fitness, Ghattekulo, Kathmandu, Nepal (Postal Code: 44600)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <a href="mailto:samir.bhandari666@gmail.com" className="text-emerald-400 hover:underline">samir.bhandari666@gmail.com</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href="tel:+9779800548346" className="text-white hover:text-emerald-400 font-mono font-bold">+977 9800548346</a>
              </p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
