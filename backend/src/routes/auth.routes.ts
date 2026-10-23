import { Router } from 'express';
import {
  registerStudentHandler,
  registerProfessionalHandler,
  registerCollegeHandler,
  registerGeneralHandler,
  loginHandler,
  logoutHandler,
  getMeHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rateLimitMiddleware } from '../middleware/rateLimit.middleware';

const router = Router();

// Public Authentication Endpoints
router.post('/auth/register', rateLimitMiddleware, registerGeneralHandler);
router.post('/auth/signup', rateLimitMiddleware, registerGeneralHandler);
router.post('/auth/register/student', rateLimitMiddleware, registerStudentHandler);
router.post('/auth/register/professional', rateLimitMiddleware, registerProfessionalHandler);
router.post('/auth/register/college', rateLimitMiddleware, registerCollegeHandler);

router.post('/api/auth/register', rateLimitMiddleware, registerGeneralHandler);
router.post('/api/auth/signup', rateLimitMiddleware, registerGeneralHandler);
router.post('/api/auth/register/student', rateLimitMiddleware, registerStudentHandler);
router.post('/api/auth/register/professional', rateLimitMiddleware, registerProfessionalHandler);
router.post('/api/auth/register/college', rateLimitMiddleware, registerCollegeHandler);

router.post('/register/student', rateLimitMiddleware, registerStudentHandler);
router.post('/register/professional', rateLimitMiddleware, registerProfessionalHandler);
router.post('/register/college', rateLimitMiddleware, registerCollegeHandler);
router.post('/register', rateLimitMiddleware, registerGeneralHandler);
router.post('/signup', rateLimitMiddleware, registerGeneralHandler);

router.post('/api/register/student', rateLimitMiddleware, registerStudentHandler);
router.post('/api/register/professional', rateLimitMiddleware, registerProfessionalHandler);
router.post('/api/register/college', rateLimitMiddleware, registerCollegeHandler);
router.post('/api/register', rateLimitMiddleware, registerGeneralHandler);
router.post('/api/signup', rateLimitMiddleware, registerGeneralHandler);

router.post('/auth/login', rateLimitMiddleware, loginHandler);
router.post('/api/auth/login', rateLimitMiddleware, loginHandler);
router.post('/login', rateLimitMiddleware, loginHandler);
router.post('/api/login', rateLimitMiddleware, loginHandler);

router.post('/auth/logout', logoutHandler);
router.post('/api/auth/logout', logoutHandler);
router.post('/auth/forgot-password', rateLimitMiddleware, forgotPasswordHandler);
router.post('/api/auth/forgot-password', rateLimitMiddleware, forgotPasswordHandler);
router.post('/auth/reset-password', rateLimitMiddleware, resetPasswordHandler);
router.post('/api/auth/reset-password', rateLimitMiddleware, resetPasswordHandler);

// Protected Auth Session Endpoint
router.get('/auth/me', authMiddleware, getMeHandler);
router.get('/api/auth/me', authMiddleware, getMeHandler);

export default router;
