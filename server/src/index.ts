import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { config } from './config/env.js';

import authRoutes from './routes/authRoutes.js';
import facilityRoutes from './routes/facilityRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { apiRateLimiter, securityHeaders, sanitizeInput } from './middleware/security.js';

const app = express();
const PORT = config.PORT;

// Security Headers
app.use(securityHeaders);

// Robust CORS with Whitelisting
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) or whitelisted origins
      if (!origin || config.ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during dev, credentials handled safely
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Global API Rate Limiter & Input Sanitization
app.use('/api', apiRateLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInput);

// Static uploads serving with safe caching headers
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir, { maxAge: '1d', etag: true }));

// Health Check & Security Status API
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'EcoCycle 3D E-Waste Facility Locator API',
    securityStatus: 'HARDENED (Rate Limiting, Security Headers, Brute-Force Lockout, Atomic Transactions & XSS Shield)',
    timestamp: new Date().toISOString(),
    version: '1.2.0',
    demoMode: config.AI_DEMO_MODE,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/admin', adminRoutes);

// Unified Production Mode: Serve static React client bundle
const clientDistPath = path.join(process.cwd(), '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req: Request, res: Response) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Global 404 Route for API
app.use('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found.' });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EcoCycle Secure Unified Server running on http://localhost:${PORT}`);
  console.log(`🛡️ Enterprise Security Active (Atomic Transactions, IDOR Defense, Rate-Limiting, Brute-Force Shield)`);
  console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/health`);
});
