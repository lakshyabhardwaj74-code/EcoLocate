import { Router } from 'express';
import {
  register,
  login,
  adminLogin,
  getMe,
  changePassword,
  facilityLogin,
  facilityRegister,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/security.js';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/admin-login', authRateLimiter, adminLogin);
router.post('/facility-login', authRateLimiter, facilityLogin);
router.post('/facility-register', authRateLimiter, facilityRegister);
router.get('/me', authenticateToken, getMe);
router.put('/change-password', authenticateToken, changePassword);

export default router;

