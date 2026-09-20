import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, ChevronRight, PhoneCall, MapPin, Search } from 'lucide-react';
import FooterLogo from './FooterLogo';

export default function Header({ onOpenJoinModal, onOpenSearch }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Classes', path: '/classes' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Instructors', path: '/instructors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/classes' && (location.pathname === '/classes' || location.pathname === '/schedule')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Top Bar Status Strip */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/20 text-xs py-2 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              24/7 ACCESS ACTIVE
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-300 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Ghattekulo, Kathmandu (Postal: 44600)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-amber-400 font-medium text-xs hidden md:flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Annual Pass 20% Off (NPR)
            </span>
            <a 
              href="tel:+9779800548346" 
              className="flex items-center gap-1.5 text-slate-200 hover:text-emerald-400 font-mono font-bold text-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              9800548346
            </a>
          </div>

        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-2xl py-2.5' 
          : 'bg-slate-950/75 backdrop-blur-sm py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="shrink-0">
            <FooterLogo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 glass-panel px-3 py-1.5 rounded-full border-slate-800">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-slate-400 hover:text-white text-xs transition-all cursor-pointer shadow-sm"
              title="Quick search across all classes, trainers, facilities (⌘K)"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline-block font-medium">Search</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700/60">
                ⌘K
              </kbd>
            </button>

            {/* NPR Currency Tag */}
            <div className="hidden sm:block px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-amber-400 font-mono font-bold">
              NPR (Rs.)
            </div>

            {/* Join CTA */}
            <button
              onClick={onOpenJoinModal}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 hover:scale-105 transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Join Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-slate-950/95 border-b border-slate-800 backdrop-blur-xl px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive(link.path)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span>Search site contents...</span>
                </span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-emerald-400">⌘K</kbd>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Location:</span>
                <span className="text-emerald-400 font-medium">Ghattekulo, Kathmandu (44600)</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Call Us:</span>
                <a href="tel:+9779800548346" className="text-white font-mono font-bold">9800548346</a>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenJoinModal();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-center shadow-lg cursor-pointer"
              >
                Join Goodlife Fitness
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
