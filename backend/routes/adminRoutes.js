import express from 'express';
import {
  getStats,
  getMonthlyRevenue,
  getRecentOrders,
  getStatsOverview,
} from '../controllers/adminStatsController.js';
import { getActivityLogs } from '../controllers/activityLogController.js';
import { getUsers } from '../controllers/adminUserController.js';
import { getAdminMe } from '../controllers/adminAuthController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { adminLogin } from '../controllers/adminAuthController.js';
import { validate } from '../middleware/validate.js';
import { adminLoginSchema } from '../validators/authValidators.js';

const router = express.Router();

router.post('/login', validate(adminLoginSchema), adminLogin);

router.use(protectAdmin);

router.get('/me', getAdminMe);
router.get('/stats/overview', getStatsOverview);
router.get('/activity-logs', getActivityLogs);
router.get('/users', getUsers);
router.get('/stats/revenue/monthly', getMonthlyRevenue);
router.get('/stats/orders/recent', getRecentOrders);
router.get('/stats', getStats);

export default router;
