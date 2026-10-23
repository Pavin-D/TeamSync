import { Router } from 'express';
import {
  createTeamHandler,
  getTeamsHandler,
  getTeamByIdHandler,
  createJoinRequestHandler,
  getTeamRequestsHandler,
  acceptJoinRequestHandler,
  rejectJoinRequestHandler,
  cancelJoinRequestHandler,
  getUserTeamsHandler,
  getUserJoinRequestsHandler,
  removeMemberHandler,
  leaveTeamHandler,
} from '../controllers/team.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public / Authenticated Team Roster Endpoints
router.get('/teams', getTeamsHandler);
router.get('/teams/:teamId', getTeamByIdHandler);

// Protected Team Creation & Management Endpoints
router.post('/teams', authMiddleware, createTeamHandler);
router.delete('/teams/:teamId/members/:userId', authMiddleware, removeMemberHandler);
router.post('/teams/:teamId/leave', authMiddleware, leaveTeamHandler);

// Protected Join Request Endpoints
router.get('/teams/:teamId/join-requests', authMiddleware, getTeamRequestsHandler);
router.post('/teams/:teamId/join-requests', authMiddleware, createJoinRequestHandler);
router.patch('/join-requests/:requestId/accept', authMiddleware, acceptJoinRequestHandler);
router.patch('/join-requests/:requestId/reject', authMiddleware, rejectJoinRequestHandler);
router.patch('/join-requests/:requestId/cancel', authMiddleware, cancelJoinRequestHandler);

// User Personal Roster Endpoints
router.get('/users/me/teams', authMiddleware, getUserTeamsHandler);
router.get('/users/me/join-requests', authMiddleware, getUserJoinRequestsHandler);

export default router;
