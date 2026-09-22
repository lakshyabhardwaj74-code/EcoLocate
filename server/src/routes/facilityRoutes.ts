import { Router } from 'express';
import {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  addReview,
  getManagedFacilityStats,
} from '../controllers/facilityController.js';
import { authenticateToken, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', getFacilities);
router.get('/managed/stats', authenticateToken, requireRoles(['FACILITY_MEMBER']), getManagedFacilityStats);
router.get('/:id', getFacilityById);
router.post('/', authenticateToken, requireRoles(['ADMIN', 'FACILITY_MEMBER']), createFacility);
router.put('/:id', authenticateToken, requireRoles(['ADMIN', 'FACILITY_MEMBER']), updateFacility);
router.post('/:id/reviews', authenticateToken, addReview);

export default router;
