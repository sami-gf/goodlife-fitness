import express from 'express';
import { storage } from '../storage.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

/**
 * GET /api/export/members
 * Exports all members and leads as a CSV file
 */
router.get('/members', requireAdmin, async (req, res) => {
  try {
    const csv = await storage.exportMembersCSV();
    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="goodlife-members-${dateStr}.csv"`);
    return res.status(200).send(csv);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Export failed.' });
  }
});

/**
 * GET /api/export/financials
 * Exports payment and revenue transactions as a CSV file
 */
router.get('/financials', requireAdmin, async (req, res) => {
  try {
    const csv = await storage.exportFinancialsCSV();
    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="goodlife-financials-${dateStr}.csv"`);
    return res.status(200).send(csv);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Export failed.' });
  }
});

export default router;
