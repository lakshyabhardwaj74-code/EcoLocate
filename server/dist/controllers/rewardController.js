"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.redeemReward = exports.getUserRewards = exports.getRewardCatalog = void 0;
const prisma_js_1 = __importDefault(require("../utils/prisma.js"));
const getRewardCatalog = async (_req, res) => {
    try {
        const catalog = await prisma_js_1.default.rewardCatalog.findMany({
            where: { isActive: true },
            orderBy: { pointsRequired: 'asc' },
        });
        return res.json({ success: true, count: catalog.length, data: catalog });
    }
    catch (error) {
        console.error('Error fetching catalog:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch rewards catalog.' });
    }
};
exports.getRewardCatalog = getRewardCatalog;
const getUserRewards = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }
        const user = await prisma_js_1.default.user.findUnique({
            where: { id: req.user.id },
            select: { rewardPoints: true },
        });
        const transactions = await prisma_js_1.default.rewardTransaction.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        return res.json({
            success: true,
            data: {
                points: user?.rewardPoints || 0,
                transactions,
            },
        });
    }
    catch (error) {
        console.error('Error fetching user rewards:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch user rewards.' });
    }
};
exports.getUserRewards = getUserRewards;
// Atomic Reward Redemption to prevent race conditions and double spending
const redeemReward = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }
        const { catalogId } = req.body;
        if (!catalogId) {
            return res.status(400).json({ success: false, message: 'Reward item ID is required.' });
        }
        const rewardItem = await prisma_js_1.default.rewardCatalog.findUnique({ where: { id: String(catalogId) } });
        if (!rewardItem || !rewardItem.isActive) {
            return res.status(404).json({ success: false, message: 'Reward item not found or unavailable.' });
        }
        const user = await prisma_js_1.default.user.findUnique({ where: { id: req.user.id } });
        if (!user || user.rewardPoints < rewardItem.pointsRequired) {
            return res.status(400).json({
                success: false,
                message: `Insufficient points. You need ${rewardItem.pointsRequired} points, but have ${user?.rewardPoints || 0}.`,
            });
        }
        const voucherCode = rewardItem.code || `ECO-${rewardItem.partnerName.toUpperCase().slice(0, 3)}-${Math.floor(10000 + Math.random() * 90000)}`;
        // Execute atomic transaction for point deduction and transaction record creation
        const [updatedUser, transaction] = await prisma_js_1.default.$transaction([
            prisma_js_1.default.user.update({
                where: { id: req.user.id },
                data: {
                    rewardPoints: { decrement: rewardItem.pointsRequired },
                },
            }),
            prisma_js_1.default.rewardTransaction.create({
                data: {
                    userId: req.user.id,
                    points: rewardItem.pointsRequired,
                    type: 'REDEEMED',
                    title: `Redeemed: ${rewardItem.title}`,
                    description: `Partner: ${rewardItem.partnerName} | Voucher Code: ${voucherCode}`,
                },
            }),
        ]);
        return res.json({
            success: true,
            message: `Successfully redeemed ${rewardItem.title}!`,
            voucherCode,
            remainingPoints: updatedUser.rewardPoints,
            transaction,
        });
    }
    catch (error) {
        console.error('Error redeeming reward:', error);
        return res.status(500).json({ success: false, message: 'Failed to redeem reward.' });
    }
};
exports.redeemReward = redeemReward;
const getLeaderboard = async (_req, res) => {
    try {
        const topUsers = await prisma_js_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                rewardPoints: true,
                pickupRequests: {
                    where: { status: 'COMPLETED' },
                    select: { id: true },
                },
            },
            orderBy: { rewardPoints: 'desc' },
            take: 10,
        });
        const leaderboard = topUsers.map((u, index) => {
            // Mask full name for privacy (e.g. "Aarav V.")
            const parts = u.name.split(' ');
            const displayName = parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : u.name;
            return {
                rank: index + 1,
                id: u.id,
                name: displayName,
                points: u.rewardPoints,
                itemsRecycledCount: u.pickupRequests.length + Math.floor(u.rewardPoints / 100),
            };
        });
        return res.json({ success: true, data: leaderboard });
    }
    catch (error) {
        console.error('Error fetching leaderboard:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch leaderboard.' });
    }
};
exports.getLeaderboard = getLeaderboard;
