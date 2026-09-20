import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { rateLimit } from 'express-rate-limit';
import connectDB, { getMongoDetails } from './db.js';
import membersRouter from './routes/members.js';
import bookingsRouter from './routes/bookings.js';
import contactRouter from './routes/contact.js';
import analyticsRouter from './routes/analytics.js';
import exportRouter from './routes/export.js';
import { storage } from './storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

// ─── Optional MongoDB Connection (Does not block app startup) ─────────────────
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// ─── Security & Helmet ────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false, // Allows seamless frontend scripts in production
}));

// ─── Flexible Cross-Origin Resource Sharing (CORS) ────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => callback(null, true), // Permissive to allow cloud & local access
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-admin-key', 'Authorization'],
  })
);

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const publicSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions from this IP. Please try again in a few minutes.' },
});

// ─── Request Parsers & Logger ──────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(morgan('dev'));

// ─── Serve Built Frontend Static Files ─────────────────────────────────────────
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// ─── Health Check & Server Status ──────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    const stats = await storage.calculateAnalytics();
    const mongoInfo = getMongoDetails();
    return res.json({
      success: true,
      status: 'Goodlife Fitness Enterprise Backend Active 🏋️',
      version: '2.1.0',
      port: PORT,
      timestamp: new Date().toISOString(),
      database: {
        mongoConnected: mongoInfo.connected,
        clusterHost: mongoInfo.host,
        dbName: mongoInfo.name,
        storageEngine: mongoInfo.connected ? 'MongoDB Atlas (Cloud Active)' : 'High-Availability Local JSON Database',
        lastSyncedAt: stats.storageInfo?.lastSyncedAt || null,
      },
      storage: {
        type: mongoInfo.connected ? 'MongoDB Atlas + Resilient Local Mirror' : 'Local High-Availability Store',
        totalMembers: stats.kpi.totalLeads,
        activeMembers: stats.kpi.activeMembers,
        projectedMRR: stats.kpi.projectedMRR,
      },
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (err) {
    const mongoInfo = getMongoDetails();
    return res.json({
      success: true,
      status: 'Goodlife Fitness API is running 🏋️',
      database: {
        mongoConnected: mongoInfo.connected,
        clusterHost: mongoInfo.host,
      },
      timestamp: new Date().toISOString(),
    });
  }
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/analytics', analyticsRouter);
app.use('/api/export', exportRouter);
app.use('/api/members', membersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/contact', contactRouter);

// ─── Frontend SPA Routing (Catch-all for non-API routes) ──────────────────────
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexHtml = path.join(distPath, 'index.html');
    if (fs.existsSync(indexHtml)) {
      return res.sendFile(indexHtml);
    }
  }
  next();
});

// ─── 404 Handler for Unmatched API Routes ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found on Goodlife API.` });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('🔴 Global Server Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n========================================================`);
  console.log(`🚀 GOODLIFE FITNESS ENTERPRISE BACKEND ONLINE`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`📊 CRM Analytics: http://localhost:${PORT}/api/analytics`);
  console.log(`👥 Members API:  http://localhost:${PORT}/api/members`);
  console.log(`📅 Bookings API: http://localhost:${PORT}/api/bookings`);
  console.log(`📩 Contact API:  http://localhost:${PORT}/api/contact`);
  console.log(`💾 Storage: High-Availability Persistent JSON Database`);
  console.log(`========================================================\n`);
});

export default app;
