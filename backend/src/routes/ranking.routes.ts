import { Router } from 'express';
import { getStudentRankingsHandler, getCollegeRankingsHandler } from '../controllers/ranking.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/rankings/students', getStudentRankingsHandler);
router.get('/rankings/colleges', getCollegeRankingsHandler);

export default router;
