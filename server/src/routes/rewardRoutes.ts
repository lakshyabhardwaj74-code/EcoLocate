import { Router } from 'express';
import {
  getRewardCatalog,
  getUserRewards,
  redeemReward,
  getLeaderboard,
} from '../controllers/rewardController.js';
import { authenticateToken } from '../middleware/auth.js';
import { transactionRateLimiter } from '../middleware/security.js';

const router = Router();

router.get('/catalog', getRewardCatalog);
router.get('/user', authenticateToken, getUserRewards);
router.post('/redeem', authenticateToken, transactionRateLimiter, redeemReward);
router.get('/leaderboard', getLeaderboard);

export default router;
