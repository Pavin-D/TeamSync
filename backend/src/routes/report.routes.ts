import { Router } from 'express';
import {
  createReportHandler,
  getUserReportSummaryHandler,
  getMySubmittedReportsHandler,
  getAdminReportsHandler,
  getAdminReportStatsHandler,
  getTopReportedUsersHandler,
  reviewAdminReportHandler,
} from '../controllers/report.controller';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';
import { rateLimitMiddleware } from '../middleware/rateLimit.middleware';

const router = Router();

// Protected User Report Endpoints
router.post('/reports', authMiddleware, rateLimitMiddleware, createReportHandler);
router.get('/me/reports', authMiddleware, getMySubmittedReportsHandler);
router.get('/users/:userId/report-summary', authMiddleware, getUserReportSummaryHandler);

// Protected Admin Moderation Endpoints
router.get('/admin/reports', authMiddleware, requireRole('PLATFORM_ADMIN'), getAdminReportsHandler);
router.get('/admin/reports/stats', authMiddleware, requireRole('PLATFORM_ADMIN'), getAdminReportStatsHandler);
router.get('/admin/reports/top-reported-users', authMiddleware, requireRole('PLATFORM_ADMIN'), getTopReportedUsersHandler);
router.patch('/admin/reports/:reportId', authMiddleware, requireRole('PLATFORM_ADMIN'), reviewAdminReportHandler);

export default router;
