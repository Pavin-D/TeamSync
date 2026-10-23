import { apiClient } from './client';
import { ApiResponse, QueryParams } from '@/types/api';

export type NotificationType =
  | 'TEAM_INVITATION'
  | 'TEAM_JOIN_REQUEST'
  | 'TEAM_REQUEST_ACCEPTED'
  | 'TEAM_REQUEST_REJECTED'
  | 'TEAM_MEMBER_ADDED'
  | 'TEAM_MEMBER_REMOVED'
  | 'EVENT_UPDATE'
  | 'EVENT_RESULT'
  | 'EVENT_REMINDER'
  | 'MENTOR_REQUEST'
  | 'MENTOR_ACCEPTED'
  | 'MENTOR_REJECTED'
  | 'RANKING_UPDATE'
  | 'ACHIEVEMENT'
  | 'REPORT_UPDATE'
  | 'SYSTEM_NOTIFICATION'
  | 'JOIN_REQUEST_RECEIVED'
  | 'JOIN_REQUEST_ACCEPTED'
  | 'JOIN_REQUEST_REJECTED'
  | 'TEAM_INVITATION_RECEIVED'
  | 'TEAM_INVITATION_ACCEPTED'
  | 'TEAM_INVITATION_REJECTED'
  | 'MEMBER_REMOVED'
  | string;

export interface NotificationItem {
  id: string;
  recipientId?: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: 'TEAM' | 'EVENT' | 'MENTOR' | 'USER' | 'RANKING' | 'REPORT' | string;
  entityId?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  teamNotifications?: boolean;
  teamInvitations?: boolean;
  eventNotifications?: boolean;
  eventUpdates?: boolean;
  mentorshipNotifications?: boolean;
  mentorshipRequests?: boolean;
  rankingNotifications?: boolean;
  rankingUpdates?: boolean;
  systemNotifications?: boolean;
  emailNotifications?: boolean;
}

export interface NotificationFilterParams extends QueryParams {
  unreadOnly?: boolean;
  unread?: boolean;
  category?: string;
}

export const notificationService = {
  getNotifications: async (params?: NotificationFilterParams): Promise<ApiResponse<NotificationItem[]>> => {
    return apiClient.get<NotificationItem[]>('/notifications', params);
  },

  getUnreadCount: async (): Promise<ApiResponse<{ count: number; unreadCount?: number }>> => {
    return apiClient.get<{ count: number; unreadCount?: number }>('/notifications/unread-count');
  },

  markNotificationRead: async (id: string): Promise<ApiResponse<NotificationItem>> => {
    return apiClient.patch<NotificationItem>(`/notifications/${id}/read`);
  },

  markAllNotificationsRead: async (): Promise<ApiResponse<{ count: number }>> => {
    return apiClient.patch<{ count: number }>('/notifications/read-all');
  },

  deleteNotification: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/notifications/${id}`);
  },

  getNotificationPreferences: async (): Promise<ApiResponse<NotificationPreferences>> => {
    return apiClient.get<NotificationPreferences>('/notifications/preferences');
  },

  updateNotificationPreferences: async (
    prefs: Partial<NotificationPreferences>
  ): Promise<ApiResponse<NotificationPreferences>> => {
    return apiClient.patch<NotificationPreferences>('/notifications/preferences', prefs);
  },
};
