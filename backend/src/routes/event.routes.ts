import { Router } from 'express';
import {
  getEventsHandler,
  getEventByIdHandler,
  createEventHandler,
  updateEventHandler,
  deleteEventHandler,
} from '../controllers/event.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

// Public / Authorized Roster Endpoints
router.get('/events', getEventsHandler);
router.get('/events/:eventId', getEventByIdHandler);

// Admin Event Management Endpoints
router.post('/events', authMiddleware, roleMiddleware(['COLLEGE_ADMIN', 'PLATFORM_ADMIN']), createEventHandler);
router.patch('/events/:eventId', authMiddleware, roleMiddleware(['COLLEGE_ADMIN', 'PLATFORM_ADMIN']), updateEventHandler);
router.delete('/events/:eventId', authMiddleware, roleMiddleware(['COLLEGE_ADMIN', 'PLATFORM_ADMIN']), deleteEventHandler);

export default router;
