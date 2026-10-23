import { Router } from 'express';
import { getCurrentUser, getStudentDashboardHandler } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/users/me', authMiddleware, getCurrentUser);
router.get('/student/dashboard', authMiddleware, getStudentDashboardHandler);
router.get('/students/dashboard', authMiddleware, getStudentDashboardHandler);

export default router;
