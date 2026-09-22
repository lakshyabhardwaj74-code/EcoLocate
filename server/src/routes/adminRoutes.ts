import { Router } from 'express';
import {
  getAdminStats,
  getUsersList,
  verifyFacility,
  exportAuditReportCSV,
  getFacilityMembers,
  toggleUserStatus,
  resetUserPassword,
} from '../controllers/adminController.js';
import { authenticateToken, requireRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);
router.use(requireRoles(['ADMIN']));

router.get('/stats', getAdminStats);
router.get('/users', getUsersList);
router.get('/facility-members', getFacilityMembers);
router.put('/facilities/:id/verify', verifyFacility);
router.put('/users/:id/status', toggleUserStatus);
router.put('/users/:id/reset-password', resetUserPassword);
router.get('/export-csv', exportAuditReportCSV);

export default router;
