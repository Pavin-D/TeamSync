import { Router } from 'express';
import {
  getTeammateRecommendationsHandler,
  getTeamRecommendationsHandler,
  getEventRecommendationsHandler,
  getNearbyPeopleHandler,
  globalDiscoverySearchHandler,
  getMentorRecommendationsHandler,
  getTeamSkillGapHandler,
} from '../controllers/recommendation.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rateLimitMiddleware } from '../middleware/rateLimit.middleware';

const router = Router();

// Protected Discovery & Recommendation Endpoints
router.get('/discovery/search', authMiddleware, globalDiscoverySearchHandler);
router.get('/discovery/users/recommended', authMiddleware, rateLimitMiddleware, getTeammateRecommendationsHandler);
router.get('/discovery/teams/recommended', authMiddleware, rateLimitMiddleware, getTeamRecommendationsHandler);
router.get('/discovery/events/recommended', authMiddleware, rateLimitMiddleware, getEventRecommendationsHandler);
router.get('/discovery/nearby', authMiddleware, rateLimitMiddleware, getNearbyPeopleHandler);

// Legacy/Specific Endpoint Mappings
router.get('/recommendations/teammates', authMiddleware, rateLimitMiddleware, getTeammateRecommendationsHandler);
router.get('/teams/:teamId/recommendations', authMiddleware, rateLimitMiddleware, getTeamRecommendationsHandler);
router.get('/recommendations/mentors', authMiddleware, rateLimitMiddleware, getMentorRecommendationsHandler);
router.get('/teams/:teamId/skill-gap', authMiddleware, getTeamSkillGapHandler);

export default router;
