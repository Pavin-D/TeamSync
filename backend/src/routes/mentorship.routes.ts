import { Router } from 'express';
import {
  getMentorsHandler,
  getMentorByIdHandler,
  createMentorshipRequestHandler,
  getMyMentorshipRequestsHandler,
  getActiveMentorshipsHandler,
  respondToRequestHandler,
  getStaffMenteeAnalyticsHandler,
  inviteTeamAsMentorHandler,
} from '../controllers/mentorship.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Protected Mentorship Endpoints
router.get('/mentors', authMiddleware, getMentorsHandler);
router.get('/mentors/:mentorId', authMiddleware, getMentorByIdHandler);
router.get('/mentorship/requests', authMiddleware, getMyMentorshipRequestsHandler);
router.get('/mentorship/active', authMiddleware, getActiveMentorshipsHandler);
router.get('/mentorship/staff/mentee-analytics', authMiddleware, getStaffMenteeAnalyticsHandler);
router.post('/mentorship/requests', authMiddleware, createMentorshipRequestHandler);
router.post('/mentorship/invite-team', authMiddleware, inviteTeamAsMentorHandler);
router.patch('/mentorship/requests/:requestId/accept', authMiddleware, (req, res, next) => {
  req.body.action = 'ACCEPT';
  return respondToRequestHandler(req, res, next);
});
router.patch('/mentorship/requests/:requestId/reject', authMiddleware, (req, res, next) => {
  req.body.action = 'REJECT';
  return respondToRequestHandler(req, res, next);
});

export default router;
