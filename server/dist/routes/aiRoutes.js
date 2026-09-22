"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const aiController_js_1 = require("../controllers/aiController.js");
const auth_js_1 = require("../middleware/auth.js");
const security_js_1 = require("../middleware/security.js");
const uploadDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Strictly allow safe image extensions and MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const fileFilter = (_req, file, cb) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are permitted.'));
    }
};
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        // Sanitize file extension and generate secure timestamp random hash
        const ext = path_1.default.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/gi, '');
        const cleanExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : '.jpg';
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `scan-${uniqueSuffix}${cleanExt}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 Megabytes Max
        files: 1,
    },
    fileFilter,
});
const handleMulterError = (err, _req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'File size exceeds maximum limit of 5MB.' });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }
    else if (err) {
        return res.status(400).json({ success: false, message: err.message || 'File upload failed.' });
    }
    next();
};
const router = (0, express_1.Router)();
router.post('/analyze', security_js_1.aiRateLimiter, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return handleMulterError(err, req, res, next);
        }
        next();
    });
}, auth_js_1.optionalAuthenticate, aiController_js_1.analyzeImage);
router.get('/history', auth_js_1.authenticateToken, aiController_js_1.getScanHistory);
exports.default = router;
