import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '../components/SocialIcons';
import { sendContactMessage } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Membership Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    sendContactMessage(formData).catch(console.error);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Membership Inquiry',
        message: ''
      });
    }, 4000);
  };

  return (
    <div className="py-12 bg-[#0b0f17] min-h-screen relative">
      <SEOHead 
        title="Contact & Location — Ghattekulo, Kathmandu" 
        description="Contact Goodlife Fitness in Ghattekulo, Kathmandu (44600). Call 9800548346, email samir.bhandari666@gmail.com, or visit our 24/7 gym facility."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
            <MapPin className="w-3.5 h-3.5" /> GHATTEKULO, KATHMANDU (44600)
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white">
            GET IN TOUCH WITH <span className="text-gradient-emerald">GOODLIFE</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Have questions about NPR membership plans, group classes, or private coaching? We are here to help.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Location */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Physical Location</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Goodlife Fitness<br />
              Ghattekulo, Kathmandu, Nepal<br />
              <strong className="text-emerald-400 font-mono">Postal Code: 44600</strong>
            </p>
          </div>

          {/* Phone */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Direct Phone Line</h3>
            <p className="text-xs text-slate-400">Call our Ghattekulo reception:</p>
            <a 
              href="tel:+9779800548346" 
              className="inline-block text-base font-black text-emerald-400 font-mono hover:underline"
            >
              +977 9800548346
            </a>
          </div>

          {/* Email */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Official Email</h3>
            <p className="text-xs text-slate-400">Support & inquiries:</p>
            <a 
              href="mailto:samir.bhandari666@gmail.com" 
              className="inline-block text-xs font-bold text-amber-400 font-mono hover:underline break-all"
            >
              samir.bhandari666@gmail.com
            </a>
          </div>

          {/* Instagram */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Instagram Community</h3>
            <p className="text-xs text-slate-400">Follow workouts & updates:</p>
            <a 
              href="https://instagram.com/Sami_chettri9" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block text-sm font-bold text-pink-400 font-mono hover:underline"
            >
              @Sami_chettri9
            </a>
          </div>

        </div>

        {/* Main Form & Opening Hours Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                MESSAGE RECEPTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Send Us an Inquiry</h2>
              <p className="text-xs text-slate-400">We respond promptly via phone or email within 2 hours.</p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-3 bg-slate-950/60 rounded-2xl border border-emerald-500/30 p-6 animate-in fade-in">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white">Thank You, {formData.name || 'Friend'}!</h3>
                <p className="text-sm text-slate-300">Your message has been delivered to samir.bhandari666@gmail.com. Our concierge will reach out to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Samir Bhandari"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="samir.bhandari666@gmail.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9800548346"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Topic</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="General Membership Inquiry">General Membership & NPR Plans</option>
                    <option value="Personal Training Booking">1-on-1 Personal Trainer Booking</option>
                    <option value="Studio Class Reservation">Group Studio Class Reservation</option>
                    <option value="Corporate / Student Discount">Corporate / Student Discounts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message Details</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your fitness background and what questions you have..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Reception</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Hours & Direction Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Opening Hours */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <Clock className="w-4 h-4" /> Operating Hours
              </div>
              <h3 className="text-xl font-black text-white">Always Open For You</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Biometric Member Entry</span>
                  <span className="text-emerald-400 font-mono font-bold">24 Hours / 7 Days</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Staffed Reception Desk</span>
                  <span className="text-white font-mono">06:00 AM – 09:30 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Thermal Sauna & Steam</span>
                  <span className="text-amber-400 font-mono">06:30 AM – 09:00 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Protein Smoothie Bar</span>
                  <span className="text-teal-400 font-mono">06:30 AM – 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Directions & Parking */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                <ShieldCheck className="w-4 h-4" /> Directions & Parking
              </div>
              <h4 className="text-lg font-bold text-white">Visiting Ghattekulo Branch</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Located near the main Ghattekulo chowk in Kathmandu (Postal Code 44600). We have dedicated underground two-wheeler parking and valet assistance for four-wheelers.
              </p>
              <div className="pt-2 text-xs text-slate-400 font-mono">
                Need phone assistance finding us? Call <a href="tel:+9779800548346" className="text-emerald-400 font-bold">9800548346</a>
              </div>
            </div>

          </div>

        </div>

        {/* Interactive Map Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">FIND US ON THE MAP</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Ghattekulo, Kathmandu — <span className="text-gradient-emerald">Postal 44600</span>
            </h2>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl" style={{ height: '420px' }}>
            {/* OpenStreetMap embed — Ghattekulo, Kathmandu */}
            <iframe
              title="Goodlife Fitness Location — Ghattekulo, Kathmandu"
              src="https://www.openstreetmap.org/export/embed.html?bbox=85.3200%2C27.6950%2C85.3450%2C27.7100&layer=mapnik&marker=27.7025%2C85.3331"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              loading="lazy"
              referrerPolicy="no-referrer"
              aria-label="Map showing Goodlife Fitness location at Ghattekulo, Kathmandu"
              style={{ filter: 'invert(0.88) hue-rotate(180deg) brightness(0.85) contrast(1.1)', border: 'none' }}
            />
            {/* Overlay label */}
            <div className="absolute top-4 left-4 px-4 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700 flex items-center gap-2 pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-white">Goodlife Fitness — Ghattekulo Branch</span>
            </div>
            <a
              href="https://www.openstreetmap.org/?mlat=27.7025&mlon=85.3331#map=16/27.7025/85.3331"
              target="_blank"
              rel="noreferrer noopener"
              className="absolute bottom-4 right-4 px-3 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
            >
              Open Full Map ↗
            </a>
          </div>
        </div>

        {/* WhatsApp Quick CTA */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 text-center space-y-4 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-green-400" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white">Prefer to Chat on WhatsApp?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Message us directly on WhatsApp for instant replies about membership plans, class schedules, or to book a free facility tour.
          </p>
          <a
            href="https://wa.me/9779800548346?text=Hello%20Goodlife%20Fitness!%20I%20would%20like%20to%20know%20more%20about%20your%20gym."
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-green-500/30 hover:scale-105 transition-transform"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-slate-950" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp Now
          </a>
          <p className="text-xs text-slate-600 font-mono">wa.me/9779800548346</p>
        </div>

      </div>
    </div>
  );
}
