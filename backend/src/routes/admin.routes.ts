import { Router } from 'express';
import {
  getPlatformAnalyticsHandler,
  getAdminUsersHandler,
  getAdminUserDetailHandler,
  createAdminUserHandler,
  updateAdminUserHandler,
  updateUserStatusHandler,
  getAdminCollegesHandler,
  createAdminCollegeHandler,
  updateAdminCollegeHandler,
  deleteAdminCollegeHandler,
  verifyAdminCollegeHandler,
  getAdminTeamsHandler,
  getAdminTeamDetailHandler,
  updateAdminTeamHandler,
  deleteAdminTeamHandler,
  getAdminEventsHandler,
  getAdminEventDetailHandler,
  createAdminEventHandler,
  updateAdminEventHandler,
  deleteAdminEventHandler,
  getAdminAuditLogsHandler,
  getPlatformSettingsHandler,
  updatePlatformSettingsHandler,
  getSystemHealthHandler,
} from '../controllers/admin.controller';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Protect all admin endpoints with authMiddleware + requireRole('PLATFORM_ADMIN')
router.use(authMiddleware);
router.use(requireRole('PLATFORM_ADMIN'));

router.get('/analytics/platform', getPlatformAnalyticsHandler);

// Users Management
router.get('/users', getAdminUsersHandler);
router.post('/users', createAdminUserHandler);
router.get('/users/:userId', getAdminUserDetailHandler);
router.patch('/users/:userId', updateAdminUserHandler);
router.patch('/users/:userId/status', updateUserStatusHandler);
router.delete('/users/:userId', updateUserStatusHandler);

// Colleges Management
router.get('/colleges', getAdminCollegesHandler);
router.post('/colleges', createAdminCollegeHandler);
router.patch('/colleges/:collegeId', updateAdminCollegeHandler);
router.patch('/colleges/:collegeId/verify', verifyAdminCollegeHandler);
router.delete('/colleges/:collegeId', deleteAdminCollegeHandler);

// Teams Management
router.get('/teams', getAdminTeamsHandler);
router.get('/teams/:teamId', getAdminTeamDetailHandler);
router.patch('/teams/:teamId', updateAdminTeamHandler);
router.delete('/teams/:teamId', deleteAdminTeamHandler);

// Events Management
router.get('/events', getAdminEventsHandler);
router.post('/events', createAdminEventHandler);
router.get('/events/:eventId', getAdminEventDetailHandler);
router.patch('/events/:eventId', updateAdminEventHandler);
router.delete('/events/:eventId', deleteAdminEventHandler);

// Audit & System
router.get('/audit-logs', getAdminAuditLogsHandler);
router.get('/settings', getPlatformSettingsHandler);
router.patch('/settings', updatePlatformSettingsHandler);
router.get('/health', getSystemHealthHandler);

export default router;
