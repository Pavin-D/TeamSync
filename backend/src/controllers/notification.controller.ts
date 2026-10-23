import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';

export async function getNotificationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const unreadOnly = req.query.unread === 'true';
    const category = req.query.category as string || 'ALL';

    const result = await NotificationService.getNotifications(req.user.id, { page, limit, unreadOnly, category });

    return res.status(200).json({
      success: true,
      data: result.notifications,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getNotificationByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { notificationId } = req.params;
    const notification = await NotificationService.getNotificationById(req.user.id, notificationId);

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getUnreadCountHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const count = await NotificationService.getUnreadCount(req.user.id);

    return res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    return next(error);
  }
}

export async function markAsReadHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { notificationId } = req.params;
    await NotificationService.markAsRead(req.user.id, notificationId);

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
    });
  } catch (error) {
    return next(error);
  }
}

export async function markAllAsReadHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    await NotificationService.markAllAsRead(req.user.id);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteNotificationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { notificationId } = req.params;
    await NotificationService.deleteNotification(req.user.id, notificationId);

    return res.status(200).json({
      success: true,
      message: 'Notification deleted.',
    });
  } catch (error) {
    return next(error);
  }
}

export async function getPreferencesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const pref = await NotificationService.getPreferences(req.user.id);

    return res.status(200).json({
      success: true,
      data: pref,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updatePreferencesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const pref = await NotificationService.updatePreferences(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      data: pref,
    });
  } catch (error) {
    return next(error);
  }
}
