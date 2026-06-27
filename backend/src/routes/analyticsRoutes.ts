import { Router } from 'express';
import { AnalyticsController, DashboardController } from '../controllers/analyticsController';

const router = Router();

router.get('/', AnalyticsController.getAnalytics);
router.get('/dashboard', DashboardController.getStats);

export default router;
