"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_js_1 = __importDefault(require("./utils/prisma.js"));
async function main() {
    const users = await prisma_js_1.default.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            isActive: true
        }
    });
    console.log("USERS:", JSON.stringify(users, null, 2));
    const facilities = await prisma_js_1.default.facility.findMany({
        select: {
            id: true,
            name: true,
            verificationStatus: true,
            managerId: true
        }
    });
    console.log("FACILITIES:", JSON.stringify(facilities, null, 2));
}
main()
    .catch(e => console.error(e))
    .finally(() => prisma_js_1.default.$disconnect());
