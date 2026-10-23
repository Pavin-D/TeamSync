import { Router } from 'express';
import {
  getPersonalAnalyticsHandler,
  getPersonalParticipationHistoryHandler,
  getPersonalParticipationOverTimeHandler,
  getPersonalWinsOverTimeHandler,
  getCollegeAnalyticsHandler,
  getCollegeStudentsHandler,
  addCollegeStudentHandler,
  deleteCollegeStudentHandler,
  getCollegeStaffHandler,
  addCollegeStaffHandler,
  deleteCollegeStaffHandler,
  updateCollegeStaffHandler,
  getCollegeStudentDetailHandler,
  getCollegeDepartmentAnalyticsHandler,
  getCollegeEventAnalyticsHandler,
  getCollegeTeamAnalyticsHandler,
  getCollegeMentorshipAnalyticsHandler,
  getAdminPlatformAnalyticsHandler,
} from '../controllers/analytics.controller';
import { authMiddleware, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Protected Personal Analytics
router.get('/me/analytics', authMiddleware, getPersonalAnalyticsHandler);
router.get('/me/participation-history', authMiddleware, getPersonalParticipationHistoryHandler);
router.get('/me/analytics/participation-over-time', authMiddleware, getPersonalParticipationOverTimeHandler);
router.get('/me/analytics/wins-over-time', authMiddleware, getPersonalWinsOverTimeHandler);

// Protected College Analytics & Management (Multi-tenant isolated)
router.get('/colleges/:collegeId/analytics', authMiddleware, getCollegeAnalyticsHandler);
router.get('/colleges/:collegeId/students', authMiddleware, getCollegeStudentsHandler);
router.post('/colleges/:collegeId/students', authMiddleware, addCollegeStudentHandler);
router.delete('/colleges/:collegeId/students/:studentId', authMiddleware, deleteCollegeStudentHandler);

router.get('/colleges/:collegeId/staff', authMiddleware, getCollegeStaffHandler);
router.post('/colleges/:collegeId/staff', authMiddleware, addCollegeStaffHandler);
router.put('/colleges/:collegeId/staff/:staffId', authMiddleware, updateCollegeStaffHandler);
router.patch('/colleges/:collegeId/staff/:staffId', authMiddleware, updateCollegeStaffHandler);
router.delete('/colleges/:collegeId/staff/:staffId', authMiddleware, deleteCollegeStaffHandler);

router.get('/colleges/:collegeId/students/:studentId', authMiddleware, getCollegeStudentDetailHandler);
router.get('/colleges/:collegeId/departments/analytics', authMiddleware, getCollegeDepartmentAnalyticsHandler);
router.get('/colleges/:collegeId/events/analytics', authMiddleware, getCollegeEventAnalyticsHandler);
router.get('/colleges/:collegeId/teams/analytics', authMiddleware, getCollegeTeamAnalyticsHandler);
router.get('/colleges/:collegeId/mentorship', authMiddleware, getCollegeMentorshipAnalyticsHandler);

// Protected Admin Platform Analytics
router.get('/admin/analytics/platform', authMiddleware, requireRole('PLATFORM_ADMIN'), getAdminPlatformAnalyticsHandler);

export default router;
