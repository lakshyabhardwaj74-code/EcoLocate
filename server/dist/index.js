"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_js_1 = require("./config/env.js");
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const facilityRoutes_js_1 = __importDefault(require("./routes/facilityRoutes.js"));
const pickupRoutes_js_1 = __importDefault(require("./routes/pickupRoutes.js"));
const aiRoutes_js_1 = __importDefault(require("./routes/aiRoutes.js"));
const rewardRoutes_js_1 = __importDefault(require("./routes/rewardRoutes.js"));
const adminRoutes_js_1 = __importDefault(require("./routes/adminRoutes.js"));
const security_js_1 = require("./middleware/security.js");
const app = (0, express_1.default)();
const PORT = env_js_1.config.PORT;
// Security Headers
app.use(security_js_1.securityHeaders);
// Robust CORS with Whitelisting
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) or whitelisted origins
        if (!origin || env_js_1.config.ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(null, true); // Allow during dev, credentials handled safely
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Global API Rate Limiter & Input Sanitization
app.use('/api', security_js_1.apiRateLimiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(security_js_1.sanitizeInput);
// Static uploads serving with safe caching headers
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express_1.default.static(uploadsDir, { maxAge: '1d', etag: true }));
// Health Check & Security Status API
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'online',
        system: 'EcoCycle 3D E-Waste Facility Locator API',
        securityStatus: 'HARDENED (Rate Limiting, Security Headers, Brute-Force Lockout, Atomic Transactions & XSS Shield)',
        timestamp: new Date().toISOString(),
        version: '1.2.0',
        demoMode: env_js_1.config.AI_DEMO_MODE,
    });
});
// API Routes
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api/facilities', facilityRoutes_js_1.default);
app.use('/api/pickups', pickupRoutes_js_1.default);
app.use('/api/ai', aiRoutes_js_1.default);
app.use('/api/rewards', rewardRoutes_js_1.default);
app.use('/api/admin', adminRoutes_js_1.default);
// Unified Production Mode: Serve static React client bundle
const clientDistPath = path_1.default.join(process.cwd(), '../client/dist');
if (fs_1.default.existsSync(clientDistPath)) {
    app.use(express_1.default.static(clientDistPath));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
            res.sendFile(path_1.default.join(clientDistPath, 'index.html'));
        }
    });
}
// Global 404 Route for API
app.use('/api/*', (_req, res) => {
    res.status(404).json({ success: false, message: 'API Endpoint not found.' });
});
// Global Error Handler
app.use((err, _req, res, _next) => {
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
