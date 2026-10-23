import { prisma } from '../config/database';
import twilio from 'twilio';

// Twilio Initialization
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: any = null;
try {
  if (TWILIO_ACCOUNT_SID && TWILIO_ACCOUNT_SID.startsWith('AC') && TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
} catch (error) {
  console.warn('Twilio initialization skipped due to invalid credentials.');
}

export interface CreateNotificationParams {
  recipientId: string;
  type: string;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
}

export class NotificationService {
  public static async createNotification(params: CreateNotificationParams) {
    const notification = await prisma.notification.create({
      data: {
        recipientId: params.recipientId,
        type: params.type,
        title: params.title,
        message: params.message,
        entityType: params.entityType || null,
        entityId: params.entityId || null,
        isRead: false,
      },
    });

    // Send SMS via Twilio if user has a phone number
    try {
      if (twilioClient && TWILIO_PHONE_NUMBER) {
        const user = await prisma.user.findUnique({
          where: { id: params.recipientId },
          select: { phone: true, role: true },
        });

        if (user && user.phone) {
          // Format phone number to E.164 if missing country code
          let phoneStr = user.phone;
          if (!phoneStr.startsWith('+')) {
            phoneStr = `+91${phoneStr}`; // Defaulting to India code based on app context, or could rely on DB format
          }
          await twilioClient.messages.create({
            body: `TeamSync: ${params.title}\n${params.message}`,
            from: TWILIO_PHONE_NUMBER,
            to: phoneStr,
          });
        }
      }
    } catch (error) {
      console.error('Failed to send Twilio SMS:', error);
    }

    return notification;
  }

  public static async getNotifications(userId: string, options: { page?: number; limit?: number; unreadOnly?: boolean; category?: string }) {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      recipientId: userId,
      ...(options.unreadOnly ? { isRead: false } : {}),
      ...(options.category && options.category !== 'ALL'
        ? {
            type: { contains: options.category, mode: 'insensitive' },
          }
        : {}),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        entityType: n.entityType,
        entityId: n.entityId,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async getNotificationById(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.recipientId !== userId) {
      const error: any = new Error('Notification not found or access denied.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      entityType: notification.entityType,
      entityId: notification.entityId,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    };
  }

  public static async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });
  }

  public static async markAsRead(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.recipientId !== userId) {
      const error: any = new Error('Notification not found or unauthorized.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  public static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        recipientId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  public static async deleteNotification(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.recipientId !== userId) {
      const error: any = new Error('Notification not found or unauthorized.');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    return prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  public static async getPreferences(userId: string) {
    let pref = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      pref = await prisma.notificationPreference.create({
        data: { userId },
      });
    }

    return pref;
  }

  public static async updatePreferences(userId: string, data: any) {
    return prisma.notificationPreference.upsert({
      where: { userId },
      update: {
        teamNotifications: data.teamNotifications ?? true,
        eventNotifications: data.eventNotifications ?? true,
        mentorshipNotifications: data.mentorshipNotifications ?? true,
        rankingNotifications: data.rankingNotifications ?? true,
        emailNotifications: data.emailNotifications ?? true,
      },
      create: {
        userId,
        teamNotifications: data.teamNotifications ?? true,
        eventNotifications: data.eventNotifications ?? true,
        mentorshipNotifications: data.mentorshipNotifications ?? true,
        rankingNotifications: data.rankingNotifications ?? true,
        emailNotifications: data.emailNotifications ?? true,
      },
    });
  }
}
