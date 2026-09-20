/**
 * Booking Entity & Local Storage State Handler (Goodlife Fitness)
 */

const STORAGE_KEY = 'goodlife_user_bookings';

export class Booking {
  static getBookings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static createBooking(classData, userDetails) {
    const currentBookings = this.getBookings();
    
    // Check if already booked
    const exists = currentBookings.some(b => b.classId === classData.id && b.userEmail === userDetails.email);
    if (exists) {
      throw new Error('You have already reserved a spot in this class!');
    }

    const newBooking = {
      id: `bkg-${Date.now()}`,
      classId: classData.id,
      classTitle: classData.title || classData.classTitle,
      instructorName: classData.instructorName,
      day: classData.day,
      time: classData.time,
      room: classData.room,
      userName: userDetails.name,
      userEmail: userDetails.email,
      phone: userDetails.phone || '',
      bookedAt: new Date().toISOString(),
      status: 'Confirmed'
    };

    const updated = [newBooking, ...currentBookings];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newBooking;
  }

  static cancelBooking(bookingId) {
    const currentBookings = this.getBookings();
    const updated = currentBookings.filter(b => b.id !== bookingId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
}
