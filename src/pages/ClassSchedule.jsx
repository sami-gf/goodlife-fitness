import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import ScheduleFilter from '../components/schedule/ScheduleFilter';
import ClassCard from '../components/schedule/ClassCard';
import BookingModal from '../components/schedule/BookingModal';
import { StudioClass } from '../base44/entities/StudioClass';
import { Booking } from '../base44/entities/Booking';
import { Calendar, CheckCircle2, Trash2, Clock, Sparkles, MapPin, Zap } from 'lucide-react';

export default function ClassSchedule() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const allClasses = StudioClass.getAll();
  const [selectedDay, setSelectedDay] = useState('All Days');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedIntensity, setSelectedIntensity] = useState('All Intensities');
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const [activeModalClass, setActiveModalClass] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    setUserBookings(Booking.getBookings());
    if (searchParams.get('search')) {
      setSearchQuery(searchParams.get('search'));
    }
  }, [searchParams]);

  const handleBookingSuccess = (newBooking) => {
    setActiveModalClass(null);
    setUserBookings(Booking.getBookings());
    setToastMsg(`Spot reserved for ${newBooking.classTitle} on ${newBooking.day}!`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleCancelBooking = (bookingId) => {
    const updated = Booking.cancelBooking(bookingId);
    setUserBookings(updated);
    setToastMsg('Booking cancelled.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredClasses = allClasses.filter((c) => {
    if (selectedDay !== 'All Days' && c.day !== selectedDay) return false;
    if (selectedCategory !== 'All Categories' && c.category !== selectedCategory) return false;
    if (selectedIntensity !== 'All Intensities' && c.intensity !== selectedIntensity) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const titleMatch = c.title.toLowerCase().includes(q);
      const coachMatch = c.instructorName.toLowerCase().includes(q);
      const roomMatch = c.room.toLowerCase().includes(q);
      const catMatch = c.category.toLowerCase().includes(q);
      if (!titleMatch && !coachMatch && !roomMatch && !catMatch) return false;
    }
    return true;
  });

  const bookedClassIds = userBookings.map(b => b.classId);

  return (
    <div className="py-12 bg-[#0b0f17] min-h-screen relative">
      <SEOHead 
        title="Class Schedule & Timetable" 
        description="View live class schedule at Goodlife Fitness Ghattekulo, Kathmandu (44600). Reserve spots for HIIT, Power Yoga, Heavy Lifting, Boxing, and Spin classes."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
            <Calendar className="w-3.5 h-3.5" /> GHATTEKULO (44600) TIMETABLE
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white">
            STUDIO <span className="text-gradient-emerald">CLASS SCHEDULE</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Book high-intensity group classes led by certified master coaches. Real-time slot reservation & instant confirmation.
          </p>
        </div>

        {/* User My Reservations Banner (If any active bookings) */}
        {userBookings.length > 0 && (
          <div className="p-6 rounded-3xl glass-card border border-emerald-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>My Active Reservations ({userBookings.length})</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">GHATTEKULO ACCESS PASS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userBookings.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{b.classTitle}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{b.day} • {b.time}</p>
                    <p className="text-[10px] text-emerald-400 font-mono mt-1">Coach {b.instructorName} • {b.room}</p>
                  </div>
                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Cancel reservation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Section */}
        <ScheduleFilter
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedIntensity={selectedIntensity}
          setSelectedIntensity={setSelectedIntensity}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Toast Alert */}
        {toastMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Showing <strong>{filteredClasses.length}</strong> available classes</span>
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Ghattekulo, Kathmandu (44600)
          </span>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <div className="py-16 text-center space-y-3 glass-card rounded-3xl">
            <Clock className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-xl font-bold text-white">No Classes Found</h3>
            <p className="text-xs text-slate-400">Try adjusting your filters or search query.</p>
            <button
              onClick={() => {
                setSelectedDay('All Days');
                setSelectedCategory('All Categories');
                setSelectedIntensity('All Intensities');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-emerald-400 hover:bg-slate-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((item) => (
              <ClassCard
                key={item.id}
                classData={item}
                onSelectBooking={(cls) => setActiveModalClass(cls)}
                isAlreadyBooked={bookedClassIds.includes(item.id)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Booking Modal */}
      {activeModalClass && (
        <BookingModal
          classData={activeModalClass}
          onClose={() => setActiveModalClass(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
