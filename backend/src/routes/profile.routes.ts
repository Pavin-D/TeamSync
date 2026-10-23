import { Router } from 'express';
import {
  getStudentProfileHandler,
  updateStudentProfileHandler,
  getProfessionalProfileHandler,
  updateProfessionalProfileHandler,
  updateUserHandler,
  getPublicUserProfileHandler,
  getUserSkillsHandler,
} from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

// Student Profile Endpoints
router.get('/students/me', authMiddleware, roleMiddleware(['STUDENT', 'PLATFORM_ADMIN']), getStudentProfileHandler);
router.patch('/students/me', authMiddleware, roleMiddleware(['STUDENT']), updateStudentProfileHandler);

// Professional Profile Endpoints
router.get('/professionals/me', authMiddleware, roleMiddleware(['PROFESSIONAL', 'PLATFORM_ADMIN']), getProfessionalProfileHandler);
router.patch('/professionals/me', authMiddleware, roleMiddleware(['PROFESSIONAL']), updateProfessionalProfileHandler);

// Common User Updates & Skills
router.patch('/users/me', authMiddleware, updateUserHandler);
router.get('/users/me/skills', authMiddleware, getUserSkillsHandler);

// Discoverable Public User Profile (omits private phone, email, and verification documents)
router.get('/users/:userId', getPublicUserProfileHandler);

export default router;
