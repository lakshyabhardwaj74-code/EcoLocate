import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Helper to check if IP is localhost
const isLocalhost = (ip?: string) => {
  if (!ip) return false;
  return ip === '127.0.0.1' || ip === '::1' || ip.includes('127.0.0.1') || ip === '::ffff:127.0.0.1';
};

// Auth Rate Limiter (Brute-Force Protection)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per 15 mins for external IPs
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => isLocalhost(req.ip),
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
  },
});

// Sensitive Transactions Rate Limiter (Redemptions / Pickups)
export const transactionRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => isLocalhost(req.ip),
  message: {
    success: false,
    message: 'Too many transaction requests. Please slow down.',
  },
});

// AI Scanner Rate Limiter
export const aiRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => isLocalhost(req.ip),
  message: {
    success: false,
    message: 'Too many AI analysis requests. Please try again in a few moments.',
  },
});

// General API Rate Limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => isLocalhost(req.ip),
  message: {
    success: false,
    message: 'Too many API requests from this IP. Please slow down.',
  },
});

// Custom HTTP Security Headers
export const securityHeaders = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), geolocation=(self), microphone=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
};

// Deep Input Sanitization Middleware to Prevent XSS and Injection
function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/on\w+\s*=\s*[^"'\s>]+/gi, '')
      .trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (typeof value === 'object' && value !== null) {
    const cleanObj: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      // Prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      cleanObj[key] = sanitizeValue(value[key]);
    }
    return cleanObj;
  }
  return value;
}

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};
