import { Router } from 'express';
import {
  globalSearchHandler,
  searchPeopleHandler,
  searchTeamsHandler,
  searchEventsHandler,
  searchMentorsHandler,
  searchCollegesHandler,
} from '../controllers/search.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Protected Search Endpoints
router.get('/search', authMiddleware, globalSearchHandler);
router.get('/search/people', authMiddleware, searchPeopleHandler);
router.get('/search/teams', authMiddleware, searchTeamsHandler);
router.get('/search/events', authMiddleware, searchEventsHandler);
router.get('/search/mentors', authMiddleware, searchMentorsHandler);
router.get('/search/colleges', authMiddleware, searchCollegesHandler);

export default router;
