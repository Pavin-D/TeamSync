import { Router } from 'express';
import {
  getNotificationsHandler,
  getNotificationByIdHandler,
  getUnreadCountHandler,
  markAsReadHandler,
  markAllAsReadHandler,
  deleteNotificationHandler,
  getPreferencesHandler,
  updatePreferencesHandler,
} from '../controllers/notification.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Protected Notification Endpoints
router.get('/notifications', authMiddleware, getNotificationsHandler);
router.get('/notifications/unread-count', authMiddleware, getUnreadCountHandler);
router.get('/notifications/preferences', authMiddleware, getPreferencesHandler);
router.patch('/notifications/preferences', authMiddleware, updatePreferencesHandler);
router.patch('/notifications/read-all', authMiddleware, markAllAsReadHandler);
router.get('/notifications/:notificationId', authMiddleware, getNotificationByIdHandler);
router.patch('/notifications/:notificationId/read', authMiddleware, markAsReadHandler);
router.delete('/notifications/:notificationId', authMiddleware, deleteNotificationHandler);

export default router;
