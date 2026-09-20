import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '../SocialIcons';
import FooterLogo from './FooterLogo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 relative overflow-hidden">
      {/* Background Gradient Spotlights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <FooterLogo />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mt-3">
              Goodlife Fitness — Nepal’s premier 24/7 fitness facility featuring world-class resistance equipment, Olympic lifting pits, luxury thermal saunas, and elite certified trainers.
            </p>
            
            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              <a 
                href="https://instagram.com/Sami_chettri9" 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-2 text-slate-300 hover:text-pink-400 hover:border-pink-500/40 transition-all text-xs font-medium"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span>@Sami_chettri9</span>
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-mono">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home Page</Link></li>
              <li><Link to="/schedule" className="hover:text-emerald-400 transition-colors">Class Timetable</Link></li>
              <li><Link to="/pricing" className="hover:text-emerald-400 transition-colors">NPR Membership Plans</Link></li>
              <li><Link to="/instructors" className="hover:text-emerald-400 transition-colors">Certified Coaches</Link></li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-mono">Legal & Standards</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/accessibility" className="hover:text-emerald-400 transition-colors">Accessibility Statement</Link></li>
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 pt-1">
                  <span>Owner CRM Portal</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-amber-400 font-mono">
                    Admin
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-mono">Contact & Location</h4>
            
            <div className="text-xs space-y-2.5">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> 
                <span>Ghattekulo, Kathmandu, Nepal<br /><span className="text-emerald-400 font-mono font-semibold">Postal Code: 44600</span></span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" /> 
                <a href="tel:+9779800548346" className="hover:text-emerald-400 font-mono font-bold text-white transition-colors">
                  +977 9800548346
                </a>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" /> 
                <a href="mailto:samir.bhandari666@gmail.com" className="hover:text-emerald-400 font-mono text-white break-all transition-colors">
                  samir.bhandari666@gmail.com
                </a>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 pt-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed successfully!
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Goodlife Fitness. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <span>Ghattekulo, Kathmandu (44600)</span>
            <span>•</span>
            <a href="mailto:samir.bhandari666@gmail.com" className="hover:text-emerald-400">samir.bhandari666@gmail.com</a>
            <span>•</span>
            <a href="tel:+9779800548346" className="text-emerald-400 font-mono font-bold">9800548346</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
