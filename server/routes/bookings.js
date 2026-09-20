import express from 'express';
import { storage } from '../storage.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// ─── POST /api/bookings ────────────────────────────────────────────────────────
// Reserve a spot in a fitness class
router.post('/', async (req, res) => {
  try {
    const {
      memberName,
      memberEmail,
      memberPhone,
      classId,
      className,
      classDay,
      classTime,
      classRoom,
      instructorName,
      category,
    } = req.body;

    if (!memberName || !memberEmail || !classId || !className) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and class details are required.',
      });
    }

    const { duplicate, booking } = await storage.createBooking({
      memberName,
      memberEmail,
      memberPhone,
      classId,
      className,
      classDay,
      classTime,
      classRoom,
      instructorName,
      category,
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active spot reserved for this class on this day.',
        data: booking,
      });
    }

    return res.status(201).json({
      success: true,
      message: `Spot confirmed for ${className} on ${classDay} at ${classTime}!`,
      data: booking,
    });
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ success: false, message: 'Could not save booking. Try again.' });
  }
});

// ─── GET /api/bookings ─────────────────────────────────────────────────────────
// Get class bookings (Filtered by member email for public, or full list for admin)
router.get('/', async (req, res) => {
  try {
    const { email, classId, status } = req.query;

    if (typeof email === 'string' && email.trim().length > 3) {
      const bookings = await storage.getBookings({ email, classId, status });
      return res.json({ success: true, count: bookings.length, data: bookings });
    }

    // Viewing all bookings requires admin
    return requireAdmin(req, res, async () => {
      const allBookings = await storage.getBookings({ classId, status });
      return res.json({ success: true, count: allBookings.length, data: allBookings });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── PATCH /api/bookings/:id ───────────────────────────────────────────────────
// Update booking status (e.g., mark 'attended' or 'cancelled')
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await storage.updateBooking(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    return res.json({ success: true, message: 'Booking status updated.', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── DELETE /api/bookings/:id ──────────────────────────────────────────────────
// Cancel a booking
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await storage.deleteBooking(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    return res.json({ success: true, message: 'Booking cancelled.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

export default router;
