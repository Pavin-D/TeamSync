import { Router } from 'express';
import {
  getGitHubProfileHandler,
  getGitHubRepositoriesHandler,
  analyzeGitHubHandler,
  getUserSkillsHandler,
  getPublicUserSkillsHandler,
} from '../controllers/github.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rateLimitMiddleware } from '../middleware/rateLimit.middleware';

const router = Router();

// Protected GitHub Endpoints
router.get('/github/profile', authMiddleware, getGitHubProfileHandler);
router.get('/github/repositories', authMiddleware, getGitHubRepositoriesHandler);
router.post('/github/analyze', authMiddleware, rateLimitMiddleware, analyzeGitHubHandler);

// Skill Roster Endpoints
router.get('/users/me/skills', authMiddleware, getUserSkillsHandler);
router.get('/users/:userId/skills', getPublicUserSkillsHandler);

export default router;
