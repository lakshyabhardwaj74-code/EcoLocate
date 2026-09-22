"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facilityLogin = exports.facilityRegister = exports.adminLogin = exports.changePassword = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = __importDefault(require("../utils/prisma.js"));
const env_js_1 = require("../config/env.js");
const LOCKOUT_THRESHOLD = 5; // 5 failed attempts
const LOCKOUT_DURATION_MINUTES = 15; // 15 minute lockout
const dbUser = prisma_js_1.default.user;
// Strict password strength validator
function isPasswordStrong(password) {
    if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters long.' };
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        return { isValid: false, message: 'Password must contain both letters and numbers.' };
    }
    return { isValid: true };
}
// User Registration
const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
        }
        const cleanName = String(name).trim();
        const cleanEmail = String(email).trim().toLowerCase();
        // Strict Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
        }
        // Password strength check
        const pwdCheck = isPasswordStrong(password);
        if (!pwdCheck.isValid) {
            return res.status(400).json({ success: false, message: pwdCheck.message });
        }
        // Check existing user
        const existingUser = await dbUser.findUnique({ where: { email: cleanEmail } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }
        // Hash password with 10 salt rounds
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Default role restriction (strictly USER during public registration)
        const validRole = 'USER';
        const user = await dbUser.create({
            data: {
                name: cleanName,
                email: cleanEmail,
                password: hashedPassword,
                phone: phone ? String(phone).trim() : null,
                role: validRole,
                rewardPoints: 100, // Welcome pledge bonus
            },
        });
        // Create welcome reward transaction
        await prisma_js_1.default.rewardTransaction.create({
            data: {
                userId: user.id,
                points: 100,
                type: 'EARNED',
                title: 'Welcome Bonus',
                description: 'Pledge bonus for joining EcoCycle E-Waste Locator platform',
            },
        });
        // Sign JWT with unified config
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, env_js_1.config.JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({
            success: true,
            message: 'Account created successfully! 100 Welcome Points credited.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                rewardPoints: user.rewardPoints,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};
exports.register = register;
// User Login with Brute-Force Lockout Protection
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }
        const cleanEmail = String(email).trim().toLowerCase();
        const user = await dbUser.findUnique({ where: { email: cleanEmail } });
        if (!user) {
            // Fake bcrypt comparison to protect against timing attacks
            await bcryptjs_1.default.compare(password, '$2a$10$abcdefghijklmnopqrstuuNOPQRSTUVWXYZabcdefghijklmnopqr');
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        if (user.isActive === false) {
            return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact your platform administrator.' });
        }
        // Check Account Lockout status
        if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
            const remainingMinutes = Math.ceil((new Date(user.lockoutUntil).getTime() - Date.now()) / (60 * 1000));
            return res.status(423).json({
                success: false,
                message: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minute(s).`,
            });
        }
        // Verify Password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
            let updateData = { failedLoginAttempts: newFailedAttempts };
            if (newFailedAttempts >= LOCKOUT_THRESHOLD) {
                const lockoutTime = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
                updateData.lockoutUntil = lockoutTime;
                try {
                    await dbUser.update({ where: { id: user.id }, data: updateData });
                }
                catch (e) {
                    console.warn('Could not update lockout fields:', e);
                }
                return res.status(423).json({
                    success: false,
                    message: `Account locked for ${LOCKOUT_DURATION_MINUTES} minutes due to ${LOCKOUT_THRESHOLD} consecutive failed attempts.`,
                });
            }
            try {
                await dbUser.update({ where: { id: user.id }, data: updateData });
            }
            catch (e) {
                console.warn('Could not update failedLoginAttempts:', e);
            }
            const attemptsLeft = LOCKOUT_THRESHOLD - newFailedAttempts;
            return res.status(401).json({
                success: false,
                message: `Invalid email or password. ${attemptsLeft} attempt(s) remaining before temporary lockout.`,
            });
        }
        // Successful login: Reset failed attempts & update lastLoginAt safely
        try {
            await dbUser.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: 0,
                    lockoutUntil: null,
                    lastLoginAt: new Date(),
                },
            });
        }
        catch (e) {
            console.warn('Safe fallback: could not update lastLoginAt audit fields:', e);
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, env_js_1.config.JWT_SECRET, { expiresIn: '7d' });
        return res.json({
            success: true,
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                rewardPoints: user.rewardPoints,
                lastLoginAt: user.lastLoginAt || new Date(),
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};
exports.login = login;
// Get Current User Profile
const getMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized.' });
        }
        const user = await dbUser.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        return res.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                rewardPoints: user.rewardPoints,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        console.error('GetMe error:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};
exports.getMe = getMe;
// Change Password Route
const changePassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Current and new password are required.' });
        }
        const user = await dbUser.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password.' });
        }
        const pwdCheck = isPasswordStrong(newPassword);
        if (!pwdCheck.isValid) {
            return res.status(400).json({ success: false, message: pwdCheck.message });
        }
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await dbUser.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        return res.json({ success: true, message: 'Password updated successfully.' });
    }
    catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ success: false, message: 'Server error updating password.' });
    }
};
exports.changePassword = changePassword;
// Dedicated Administrator Login Controller (Strict Role Authorization)
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Administrator Email and Password are required.' });
        }
        const cleanEmail = String(email).trim().toLowerCase();
        const user = await dbUser.findUnique({ where: { email: cleanEmail } });
        if (!user) {
            await bcryptjs_1.default.compare(password, '$2a$10$abcdefghijklmnopqrstuuNOPQRSTUVWXYZabcdefghijklmnopqr');
            return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
        }
        // Strict role check on server: only ADMIN role permitted
        if (user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Access Denied: This portal is restricted exclusively to authorized platform administrators.',
            });
        }
        if (user.isActive === false) {
            return res.status(403).json({ success: false, message: 'Your administrator account has been deactivated.' });
        }
        // Check account lockout
        if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
            const remainingMinutes = Math.ceil((new Date(user.lockoutUntil).getTime() - Date.now()) / (60 * 1000));
            return res.status(423).json({
                success: false,
                message: `Admin account locked. Please try again in ${remainingMinutes} minute(s).`,
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
            let updateData = { failedLoginAttempts: newFailedAttempts };
            if (newFailedAttempts >= LOCKOUT_THRESHOLD) {
                updateData.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
            }
            try {
                await dbUser.update({ where: { id: user.id }, data: updateData });
            }
            catch (e) { }
            return res.status(401).json({
                success: false,
                message: 'Invalid administrator credentials.',
            });
        }
        // Successful Admin Login: Reset counters & record last login
        try {
            await dbUser.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: 0,
                    lockoutUntil: null,
                    lastLoginAt: new Date(),
                },
            });
        }
        catch (e) { }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, env_js_1.config.JWT_SECRET, { expiresIn: '7d' });
        return res.json({
            success: true,
            message: 'Administrator authentication successful.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                rewardPoints: user.rewardPoints,
                lastLoginAt: user.lastLoginAt || new Date(),
            },
        });
    }
    catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({ success: false, message: 'Server error during administrative authentication.' });
    }
};
exports.adminLogin = adminLogin;
// Facility Member Registration (Controlled Onboarding Application)
const facilityRegister = async (req, res) => {
    try {
        const { name, email, password, phone, facilityName, address, city, state, pincode, latitude, longitude, facilityPhone, facilityEmail, website, openingHours, acceptedCategories, recyclingServices, capacity } = req.body;
        if (!name || !email || !password || !facilityName || !address || !city || !state || !latitude || !longitude || !facilityPhone) {
            return res.status(400).json({ success: false, message: 'All required member and facility fields must be provided.' });
        }
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanFacilityEmail = String(facilityEmail || email).trim().toLowerCase();
        // Validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
        }
        const pwdCheck = isPasswordStrong(password);
        if (!pwdCheck.isValid) {
            return res.status(400).json({ success: false, message: pwdCheck.message });
        }
        const existingUser = await dbUser.findUnique({ where: { email: cleanEmail } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return res.status(400).json({ success: false, message: 'Invalid coordinates provided.' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create inactive user and pending facility atomically
        const result = await prisma_js_1.default.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: String(name).trim(),
                    email: cleanEmail,
                    password: hashedPassword,
                    phone: phone ? String(phone).trim() : null,
                    role: 'FACILITY_MEMBER',
                    isActive: false, // Must be activated by admin
                },
            });
            const facility = await tx.facility.create({
                data: {
                    name: String(facilityName).trim(),
                    address: String(address).trim(),
                    city: String(city).trim(),
                    state: String(state).trim(),
                    pincode: pincode ? String(pincode).trim() : '000000',
                    latitude: lat,
                    longitude: lng,
                    phone: String(facilityPhone).trim(),
                    email: cleanFacilityEmail,
                    website: website ? String(website).trim() : null,
                    openingHours: openingHours ? String(openingHours).trim() : 'Mon-Sat: 9:00 AM - 6:00 PM',
                    acceptedCategories: Array.isArray(acceptedCategories)
                        ? acceptedCategories.join(', ')
                        : String(acceptedCategories).trim(),
                    recyclingServices: recyclingServices ? String(recyclingServices).trim() : 'Collection & Recycling',
                    capacity: capacity ? String(capacity).trim() : '10,000 kg/month',
                    isVerified: false,
                    verificationStatus: 'PENDING',
                    managerId: user.id,
                },
            });
            return { user, facility };
        });
        return res.status(201).json({
            success: true,
            message: 'Facility registration application submitted successfully. Your account is pending administrator review.',
            data: result,
        });
    }
    catch (error) {
        console.error('Facility registration error:', error);
        return res.status(500).json({ success: false, message: 'Server error during facility registration.' });
    }
};
exports.facilityRegister = facilityRegister;
// Facility Member Login with Lockout Protection
const facilityLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }
        const cleanEmail = String(email).trim().toLowerCase();
        const user = await dbUser.findUnique({ where: { email: cleanEmail } });
        if (!user || user.role !== 'FACILITY_MEMBER') {
            await bcryptjs_1.default.compare(password, '$2a$10$abcdefghijklmnopqrstuuNOPQRSTUVWXYZabcdefghijklmnopqr');
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        // Check Account Lockout status
        if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
            const remainingMinutes = Math.ceil((new Date(user.lockoutUntil).getTime() - Date.now()) / (60 * 1000));
            return res.status(423).json({
                success: false,
                message: `Account is temporarily locked. Please try again in ${remainingMinutes} minute(s).`,
            });
        }
        // Verify Password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
            let updateData = { failedLoginAttempts: newFailedAttempts };
            if (newFailedAttempts >= LOCKOUT_THRESHOLD) {
                updateData.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
            }
            await dbUser.update({ where: { id: user.id }, data: updateData });
            const attemptsLeft = Math.max(0, LOCKOUT_THRESHOLD - newFailedAttempts);
            return res.status(401).json({
                success: false,
                message: `Invalid email or password. ${attemptsLeft} attempt(s) remaining before temporary lockout.`,
            });
        }
        // Verify Activation Status
        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: 'Your account is pending administrator activation or has been suspended. Please check back later.',
            });
        }
        // Successful login: Reset attempts & update audit fields
        await dbUser.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: 0,
                lockoutUntil: null,
                lastLoginAt: new Date(),
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, env_js_1.config.JWT_SECRET, { expiresIn: '7d' });
        return res.json({
            success: true,
            message: 'Facility member login successful.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                lastLoginAt: user.lastLoginAt || new Date(),
            },
        });
    }
    catch (error) {
        console.error('Facility login error:', error);
        return res.status(500).json({ success: false, message: 'Server error during facility member authentication.' });
    }
};
exports.facilityLogin = facilityLogin;
