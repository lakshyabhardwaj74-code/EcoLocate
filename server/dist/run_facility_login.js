"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = __importDefault(require("./utils/prisma.js"));
const env_js_1 = require("./config/env.js");
const dbUser = prisma_js_1.default.user;
async function test() {
    try {
        const email = 'manager.blr@ecocycle.in';
        const password = 'password123';
        const cleanEmail = String(email).trim().toLowerCase();
        const user = await dbUser.findUnique({ where: { email: cleanEmail } });
        console.log("USER FOUND:", !!user);
        if (!user)
            return;
        console.log("USER ROLE:", user.role);
        console.log("USER PASSWORD HASH:", user.password);
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        console.log("PASSWORD MATCH:", isMatch);
        console.log("ATTEMPTING DB UPDATE...");
        try {
            await dbUser.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: 0,
                    lockoutUntil: null,
                    lastLoginAt: new Date(),
                },
            });
            console.log("DB UPDATE SUCCESSFUL!");
        }
        catch (e) {
            console.error("DB UPDATE FAILED ERROR:", e);
        }
        console.log("SIGNING TOKEN...");
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, env_js_1.config.JWT_SECRET, { expiresIn: '7d' });
        console.log("TOKEN SIGNED SUCCESS:", !!token);
    }
    catch (err) {
        console.error("GENERIC ERROR IN FLOW:", err);
    }
}
test()
    .catch(e => console.error(e))
    .finally(() => prisma_js_1.default.$disconnect());
