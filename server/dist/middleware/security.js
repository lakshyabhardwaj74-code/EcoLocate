"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = exports.securityHeaders = exports.apiRateLimiter = exports.aiRateLimiter = exports.transactionRateLimiter = exports.authRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Helper to check if IP is localhost
const isLocalhost = (ip) => {
    if (!ip)
        return false;
    return ip === '127.0.0.1' || ip === '::1' || ip.includes('127.0.0.1') || ip === '::ffff:127.0.0.1';
};
// Auth Rate Limiter (Brute-Force Protection)
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 attempts per 15 mins for external IPs
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => isLocalhost(req.ip),
    message: {
        success: false,
        message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
    },
});
// Sensitive Transactions Rate Limiter (Redemptions / Pickups)
exports.transactionRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => isLocalhost(req.ip),
    message: {
        success: false,
        message: 'Too many transaction requests. Please slow down.',
    },
});
// AI Scanner Rate Limiter
exports.aiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 40,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => isLocalhost(req.ip),
    message: {
        success: false,
        message: 'Too many AI analysis requests. Please try again in a few moments.',
    },
});
// General API Rate Limiter
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => isLocalhost(req.ip),
    message: {
        success: false,
        message: 'Too many API requests from this IP. Please slow down.',
    },
});
// Custom HTTP Security Headers
const securityHeaders = (_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(self), geolocation=(self), microphone=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
};
exports.securityHeaders = securityHeaders;
// Deep Input Sanitization Middleware to Prevent XSS and Injection
function sanitizeValue(value) {
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
        const cleanObj = {};
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
const sanitizeInput = (req, _res, next) => {
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
exports.sanitizeInput = sanitizeInput;
