import express from 'express';
import { storage } from '../storage.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

/**
 * GET /api/analytics
 * Returns comprehensive CRM & Business Analytics for Gym Owners
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const analytics = await storage.calculateAnalytics();
    return res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Analytics calculation error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate CRM analytics',
      error: err.message,
    });
  }
});

/**
 * GET /api/analytics/activity
 * Returns recent CRM activity feed
 */
router.get('/activity', requireAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 25;
    const logs = await storage.getAuditLogs(limit);
    return res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not fetch activity log' });
  }
});

export default router;
