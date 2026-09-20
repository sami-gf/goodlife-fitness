import express from 'express';
import { storage } from '../storage.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// ─── POST /api/members ─────────────────────────────────────────────────────────
// Register a new member / lead (from Join Modal, Pricing page, or Front Desk Walk-in)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      planId,
      branch,
      goal,
      preferredTime,
      status,
      paymentStatus,
      paymentMethod,
      notes,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone number are required.',
      });
    }

    // Save to persistent storage engine
    const newMember = await storage.createMember({
      name,
      email,
      phone,
      planId: planId || 'pro-standard',
      branch: branch || 'Ghattekulo Main Branch (Kathmandu 44600)',
      goal: goal || 'General Health & Fitness',
      preferredTime: preferredTime || 'Morning (6:00 AM - 9:00 AM)',
      status: status || 'pending',
      paymentStatus: paymentStatus || 'Pending',
      paymentMethod: paymentMethod || 'Unpaid',
      notes: notes || '',
    });

    return res.status(201).json({
      success: true,
      message: `Welcome to Goodlife Fitness, ${newMember.name}! Your registration is confirmed.`,
      data: newMember,
    });
  } catch (err) {
    console.error('Member registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error saving member registration.' });
  }
});

// ─── GET /api/members ──────────────────────────────────────────────────────────
// List members with search and pipeline filters (Protected: Admin)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { search, status, paymentStatus, page, limit } = req.query;
    const result = await storage.getMembers({
      search: search || '',
      status: status || '',
      paymentStatus: paymentStatus || '',
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 200,
    });

    return res.json({
      success: true,
      count: result.members.length,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      data: result.members,
    });
  } catch (err) {
    console.error('Get members error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching members.' });
  }
});

// ─── GET /api/members/:id ──────────────────────────────────────────────────────
// Get single member profile by ID
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const member = await storage.getMemberById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found.' });
    }
    return res.json({ success: true, data: member });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── PATCH /api/members/:id ────────────────────────────────────────────────────
// Update member status, payment, plan, notes, or details
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await storage.updateMember(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Member profile not found.' });
    }
    return res.json({
      success: true,
      message: `Member record for ${updated.name} updated successfully.`,
      data: updated,
    });
  } catch (err) {
    console.error('Update member error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating member.' });
  }
});

// Backwards compatibility endpoint: PATCH /api/members/:id/status
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await storage.updateMember(req.params.id, { status });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Member profile not found.' });
    }
    return res.json({ success: true, message: 'Status updated.', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── POST /api/members/:id/notes ───────────────────────────────────────────────
// Add an interaction note to member history
router.post('/:id/notes', requireAdmin, async (req, res) => {
  try {
    const { text, author } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Note text cannot be empty.' });
    }
    const updated = await storage.addMemberNote(req.params.id, text, author || 'Admin');
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Member profile not found.' });
    }
    return res.json({ success: true, message: 'Note recorded.', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── DELETE /api/members/:id ───────────────────────────────────────────────────
// Remove member profile from CRM
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await storage.deleteMember(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Member profile not found.' });
    }
    return res.json({ success: true, message: 'Member profile removed from CRM.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

export default router;
