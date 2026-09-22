import { Router } from 'express';
import {
  createPickup,
  getPickups,
  getPickupById,
  updatePickupStatus,
} from '../controllers/pickupController.js';
import { authenticateToken, requireRoles } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, createPickup);
router.get('/', authenticateToken, getPickups);
router.get('/:id', getPickupById);
router.put('/:id/status', authenticateToken, requireRoles(['ADMIN', 'FACILITY_MEMBER']), updatePickupStatus);

export default router;
