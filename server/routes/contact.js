import express from 'express';
import { storage } from '../storage.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// ─── POST /api/contact ─────────────────────────────────────────────────────────
// Save a contact form inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message must not exceed 2000 characters.',
      });
    }

    const inquiry = await storage.createInquiry({
      name,
      email,
      phone,
      subject,
      message,
    });

    console.log(`📩 New contact message from ${name} <${email}> — Subject: ${subject}`);

    return res.status(201).json({
      success: true,
      message: `Thank you, ${name}! We received your inquiry and our team will contact you shortly.`,
      data: inquiry,
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

// ─── GET /api/contact ──────────────────────────────────────────────────────────
// List all contact inquiries (Protected: Admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const messages = await storage.getInquiries();
    return res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── PATCH /api/contact/:id ────────────────────────────────────────────────────
// Update inquiry (e.g., mark as read or replied)
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await storage.updateInquiry(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }
    return res.json({ success: true, message: 'Inquiry updated.', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── DELETE /api/contact/:id ───────────────────────────────────────────────────
// Delete an inquiry
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await storage.deleteInquiry(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    }
    return res.json({ success: true, message: 'Inquiry deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

export default router;
