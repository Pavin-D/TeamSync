import { Router } from 'express';
import {
  getTeamWorkspaceHandler,
  getTasksHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
  getAnnouncementsHandler,
  createAnnouncementHandler,
  transferLeadershipHandler,
  updateSettingsHandler,
  addTeamLinkHandler,
} from '../controllers/workspace.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Protected Team Workspace Endpoints
router.get('/teams/:teamId/workspace', authMiddleware, getTeamWorkspaceHandler);
router.get('/teams/:teamId/tasks', authMiddleware, getTasksHandler);
router.post('/teams/:teamId/tasks', authMiddleware, createTaskHandler);
router.patch('/teams/:teamId/tasks/:taskId', authMiddleware, updateTaskHandler);
router.delete('/teams/:teamId/tasks/:taskId', authMiddleware, deleteTaskHandler);

router.get('/teams/:teamId/announcements', authMiddleware, getAnnouncementsHandler);
router.post('/teams/:teamId/announcements', authMiddleware, createAnnouncementHandler);

router.post('/teams/:teamId/transfer-lead', authMiddleware, transferLeadershipHandler);
router.patch('/teams/:teamId/settings', authMiddleware, updateSettingsHandler);
router.post('/teams/:teamId/links', authMiddleware, addTeamLinkHandler);

export default router;
