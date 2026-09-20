import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, Flame, Dumbbell, Calendar, User, DollarSign, 
  MapPin, Phone, Mail, ArrowRight, ShieldCheck, Waves, Coffee, HeartPulse 
} from 'lucide-react';
import { StudioClass } from '../base44/entities/StudioClass';
import { Instructor } from '../base44/entities/Instructor';
import { Membership } from '../base44/entities/Membership';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Search dataset combining all site entities and pages
  const searchableItems = useMemo(() => {
    const items = [];

    // 1. Pages
    items.push(
      { id: 'p-home', title: 'Home Page', category: 'Page', path: '/', icon: Flame, desc: 'Overview, hero, latest offers, and fitness highlights' },
      { id: 'p-classes', title: 'Classes & Timetable', category: 'Page', path: '/classes', icon: Calendar, desc: 'Explore all studio classes & book workout spots' },
      { id: 'p-facilities', title: 'Luxury Facilities', category: 'Page', path: '/facilities', icon: Dumbbell, desc: 'Heavy iron pit, sauna, studio alpha & smoothie lounge' },
      { id: 'p-pricing', title: 'NPR Pricing & Membership Plans', category: 'Page', path: '/pricing', icon: DollarSign, desc: 'Flexible monthly, annual passes & custom add-on calculator' },
      { id: 'p-instructors', title: 'Certified Coaches & Trainers', category: 'Page', path: '/instructors', icon: User, desc: 'Meet our master trainers & book private 1-on-1 sessions' },
      { id: 'p-about', title: 'About Us & Member Stories', category: 'Page', path: '/about', icon: ShieldCheck, desc: 'Our story, 24/7 access benefits, and member transformations' },
      { id: 'p-contact', title: 'Contact & Location (Ghattekulo)', category: 'Page', path: '/contact', icon: MapPin, desc: 'Ghattekulo Kathmandu 44600, phone 9800548346, email & Instagram' }
    );

    // 2. Classes
    const classes = StudioClass.getAll();
    classes.forEach(c => {
      items.push({
        id: `cls-${c.id}`,
        title: c.title,
        category: 'Class',
        path: `/classes?search=${encodeURIComponent(c.title)}`,
        icon: HeartPulse,
        desc: `${c.day} • ${c.time} • Coach ${c.instructorName} • ${c.room}`
      });
    });

    // 3. Instructors
    const instructors = Instructor.getAll();
    instructors.forEach(inst => {
      items.push({
        id: `inst-${inst.id}`,
        title: inst.name,
        category: 'Coach',
        path: `/instructors?coach=${encodeURIComponent(inst.name)}`,
        icon: User,
        desc: `${inst.role} — ${inst.specialties.join(', ')}`
      });
    });

    // 4. Membership Plans
    const plans = Membership.getAll();
    plans.forEach(plan => {
      items.push({
        id: `plan-${plan.id}`,
        title: `${plan.name} (${Membership.formatNPR(plan.priceMonthlyNPR)}/mo)`,
        category: 'Membership',
        path: '/pricing',
        icon: DollarSign,
        desc: `${plan.tagline} — ${plan.features.slice(0, 2).join(' • ')}`
      });
    });

    // 5. Facilities
    items.push(
      { id: 'fac-iron', title: 'Heavy Iron Pit & Calisthenics Bay', category: 'Facility', path: '/facilities', icon: Dumbbell, desc: 'Rogue bars, competition power racks & 60kg dumbbells' },
      { id: 'fac-sauna', title: 'Thermal Sauna & Steam Sanctuary', category: 'Facility', path: '/facilities', icon: Waves, desc: 'Finnish cedar dry saunas, eucalyptus steam rooms & ice tubs' },
      { id: 'fac-alpha', title: 'Studio Alpha HIIT & Spin Arena', category: 'Facility', path: '/facilities', icon: Flame, desc: 'High-energy sound, sprint bikes & heavy combat bags' },
      { id: 'fac-smoothie', title: 'Smoothie Bar & Member Lounge', category: 'Facility', path: '/facilities', icon: Coffee, desc: 'Fresh whey protein shakes, espresso & high-speed Wi-Fi' }
    );

    // 6. Contact quick matches
    items.push(
      { id: 'c-phone', title: 'Call 9800548346 (Reception)', category: 'Contact', path: 'tel:+9779800548346', icon: Phone, desc: 'Direct 24/7 reception line for inquiries & bookings', isExternal: true },
      { id: 'c-email', title: 'Email: samir.bhandari666@gmail.com', category: 'Contact', path: 'mailto:samir.bhandari666@gmail.com', icon: Mail, desc: 'Official customer support & membership inquiries', isExternal: true },
      { id: 'c-insta', title: 'Instagram @Sami_chettri9', category: 'Social', path: 'https://instagram.com/Sami_chettri9', icon: Flame, desc: 'Follow workout highlights & daily coach tips', isExternal: true }
    );

    return items;
  }, []);

  // Filter items based on user query
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      // Return top recommended shortcuts if search is empty
      return searchableItems.slice(0, 8);
    }
    const q = query.toLowerCase();
    return searchableItems.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [query, searchableItems]);

  // Handle keyboard shortcut Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (item) => {
    onClose();
    if (item.isExternal) {
      window.location.href = item.path;
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Universal Site Search"
      >
        
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classes, coaches, pricing, sauna, contact, location..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
            aria-label="Search input"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Badges */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-slate-500 font-mono text-[10px] uppercase font-bold shrink-0">Quick Filter:</span>
          {['HIIT', 'Yoga', 'Heavy Lifting', 'Sauna', 'NPR Pricing', 'Coaches', 'Ghattekulo'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700/60 text-[11px] whitespace-nowrap transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-3 space-y-1.5 flex-grow">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-white">No results found for "{query}"</p>
              <p className="text-xs text-slate-400">Try searching for "Pricing", "Yoga", "Sauna", "Coach", or "9800548346"</p>
            </div>
          ) : (
            filteredResults.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="p-3.5 rounded-2xl bg-slate-950/40 hover:bg-slate-800/90 border border-slate-800/60 hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 group-hover:bg-emerald-500/20 border border-slate-800 group-hover:border-emerald-500/30 flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.desc}</p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </div>
              );
            })
          )}
        </div>

        {/* Search Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-5 font-mono">
          <span>Goodlife Fitness Universal Search</span>
          <span className="hidden sm:inline-block">Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">ESC</kbd> to close</span>
        </div>

      </div>
    </div>
  );
}
