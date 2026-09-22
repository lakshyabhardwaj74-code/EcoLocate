"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoles = exports.optionalAuthenticate = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_js_1.config.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuthenticate = (req, _res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_js_1.config.JWT_SECRET);
            req.user = decoded;
        }
        catch {
            // Ignore error for optional authentication
        }
    }
    next();
};
exports.optionalAuthenticate = optionalAuthenticate;
const requireRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Requires one of roles: ${roles.join(', ')}`,
            });
        }
        next();
    };
};
exports.requireRoles = requireRoles;
