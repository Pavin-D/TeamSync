import { apiClient } from './client';
import { ApiResponse, QueryParams } from '@/types/api';

export type AdminPermission =
  | 'VIEW_USERS'
  | 'MANAGE_USERS'
  | 'VIEW_INSTITUTIONS'
  | 'MANAGE_INSTITUTIONS'
  | 'VIEW_REPORTS'
  | 'MANAGE_REPORTS'
  | 'VIEW_EVENTS'
  | 'MANAGE_EVENTS'
  | 'VIEW_ANALYTICS'
  | 'MANAGE_MENTORS'
  | 'VIEW_AUDIT_LOGS';

export interface AdminDashboardStats {
  totalStudents: number;
  totalProfessionals: number;
  totalInstitutions?: number;
  totalColleges?: number;
  totalTeams: number;
  activeTeams?: number;
  totalEvents: number;
  totalParticipations: number;
  totalMentors: number;
  pendingReports: number;
  confirmedReports?: number;
  pendingInstitutions?: number;
  activeUsersToday?: number;
  users?: {
    totalUsers: number;
    activeUsers: number;
    students: number;
    professionals: number;
    collegeAdmins: number;
    platformAdmins: number;
  };
  skillDistribution?: { skill: string; usersCount: number }[];
}

export interface AdminUser {
  id?: string;
  userId?: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'PROFESSIONAL' | 'COLLEGE' | 'COLLEGE_ADMIN' | 'PLATFORM_ADMIN' | 'ADMIN';
  college?: string;
  department?: string;
  institutionName?: string;
  organization?: string;
  jobTitle?: string;
  isActive?: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'DELETED' | string;
  joinedDate?: string;
  createdAt?: string;
  lastActive?: string;
  reportsCount: number;
  eventsParticipated?: number;
  avatarUrl?: string;
}

export interface AdminInstitution {
  id?: string;
  collegeId?: string;
  name?: string;
  collegeName?: string;
  location?: string;
  website?: string;
  emailDomain?: string;
  studentsCount?: number;
  totalStudents?: number;
  teamsCount?: number;
  eventsCount?: number;
  winsCount?: number;
  rank?: number;
  verificationStatus?: 'VERIFIED' | 'PENDING' | 'REJECTED';
  isVerified?: boolean;
  status?: 'ACTIVE' | 'SUSPENDED';
}

export interface AdminTeam {
  id: string;
  name: string;
  teamName?: string;
  eventName: string;
  teamLeadName: string;
  membersCount: number;
  institutionsCount: number;
  status: 'RECRUITING' | 'FULL' | 'COMPLETED' | 'DISBANDED';
  reportsCount: number;
  createdDate: string;
}

export interface AdminEvent {
  id: string;
  title: string;
  organizer: string;
  date: string;
  participantsCount: number;
  teamsCount: number;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  reportsCount: number;
}

export interface PlatformAnalytics {
  users?: any;
  colleges?: any;
  teams?: any;
  events?: any;
  reports?: any;
  mentorship?: any;
  skillDistribution?: { skill: string; usersCount: number }[];
  userGrowth?: { month: string; students: number; professionals: number; institutions: number }[];
  teamFormation?: { type: string; count: number }[];
  aiMatchSuccessRate?: number;
  recommendationsCount?: number;
  githubConnectedCount?: number;
  locationTeamsCount?: number;
}

export interface SystemActivityItem {
  id: string;
  adminId?: string;
  adminName?: string;
  adminEmail?: string;
  actor?: string;
  action: string;
  target?: string;
  targetType?: string;
  targetId?: string;
  reason?: string;
  timestamp?: string;
  createdAt?: string;
  category?: 'USER' | 'TEAM' | 'EVENT' | 'INSTITUTION' | 'REPORT' | 'MENTORSHIP';
}

export interface AdminFilterParams extends QueryParams {
  role?: string;
  status?: string;
  search?: string;
  verificationStatus?: string;
}

export const adminService = {
  getDashboardStats: async (): Promise<ApiResponse<AdminDashboardStats>> => {
    return apiClient.get<AdminDashboardStats>('/admin/analytics/platform');
  },

  getUsers: async (params?: AdminFilterParams): Promise<ApiResponse<AdminUser[]>> => {
    return apiClient.get<AdminUser[]>('/admin/users', params);
  },

  getUserById: async (userId: string): Promise<ApiResponse<AdminUser>> => {
    return apiClient.get<AdminUser>(`/admin/users/${userId}`);
  },

  updateUserStatus: async (
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED' | 'DELETED' | string,
    reason: string,
    durationDays?: number
  ): Promise<ApiResponse<AdminUser>> => {
    return apiClient.patch<AdminUser>(`/admin/users/${userId}/status`, { status, reason, durationDays });
  },

  deleteUser: async (userId: string, reason: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/users/${userId}?reason=${encodeURIComponent(reason)}`);
  },

  getInstitutions: async (params?: AdminFilterParams): Promise<ApiResponse<AdminInstitution[]>> => {
    return apiClient.get<AdminInstitution[]>('/admin/colleges', params);
  },

  getInstitutionById: async (id: string): Promise<ApiResponse<AdminInstitution>> => {
    return apiClient.get<AdminInstitution>(`/admin/colleges/${id}`);
  },

  verifyInstitution: async (
    id: string,
    status: 'VERIFIED' | 'REJECTED',
    notes?: string
  ): Promise<ApiResponse<AdminInstitution>> => {
    return apiClient.patch<AdminInstitution>(`/admin/colleges/${id}/verify`, { status, notes });
  },

  getTeams: async (params?: AdminFilterParams): Promise<ApiResponse<AdminTeam[]>> => {
    return apiClient.get<AdminTeam[]>('/admin/teams', params);
  },

  getTeamById: async (id: string): Promise<ApiResponse<AdminTeam>> => {
    return apiClient.get<AdminTeam>(`/admin/teams/${id}`);
  },

  moderateTeam: async (id: string, action: 'DISBAND' | 'RESTRICT', reason: string): Promise<ApiResponse<AdminTeam>> => {
    return apiClient.post<AdminTeam>(`/admin/teams/${id}/moderate`, { action, reason });
  },

  getEvents: async (params?: AdminFilterParams): Promise<ApiResponse<AdminEvent[]>> => {
    return apiClient.get<AdminEvent[]>('/admin/events', params);
  },

  getEventById: async (id: string): Promise<ApiResponse<AdminEvent>> => {
    return apiClient.get<AdminEvent>(`/admin/events/${id}`);
  },

  getPlatformAnalytics: async (): Promise<ApiResponse<PlatformAnalytics>> => {
    return apiClient.get<PlatformAnalytics>('/admin/analytics/platform');
  },

  getSystemActivity: async (): Promise<ApiResponse<SystemActivityItem[]>> => {
    return apiClient.get<SystemActivityItem[]>('/admin/audit-logs');
  },

  getAdminPermissions: async (): Promise<ApiResponse<AdminPermission[]>> => {
    return apiClient.get<AdminPermission[]>('/admin/permissions');
  },

  createUser: async (data: any): Promise<ApiResponse<AdminUser>> => {
    return apiClient.post<AdminUser>('/admin/users', data);
  },

  updateUser: async (userId: string, data: any): Promise<ApiResponse<AdminUser>> => {
    return apiClient.patch<AdminUser>(`/admin/users/${userId}`, data);
  },

  createInstitution: async (data: any): Promise<ApiResponse<AdminInstitution>> => {
    return apiClient.post<AdminInstitution>('/admin/colleges', data);
  },

  updateInstitution: async (id: string, data: any): Promise<ApiResponse<AdminInstitution>> => {
    return apiClient.patch<AdminInstitution>(`/admin/colleges/${id}`, data);
  },

  deleteInstitution: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/colleges/${id}`);
  },

  createEvent: async (data: any): Promise<ApiResponse<AdminEvent>> => {
    return apiClient.post<AdminEvent>('/admin/events', data);
  },

  updateEvent: async (eventId: string, data: any): Promise<ApiResponse<AdminEvent>> => {
    return apiClient.patch<AdminEvent>(`/admin/events/${eventId}`, data);
  },

  deleteEvent: async (eventId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/events/${eventId}`);
  },

  updateTeam: async (teamId: string, data: any): Promise<ApiResponse<AdminTeam>> => {
    return apiClient.patch<AdminTeam>(`/admin/teams/${teamId}`, data);
  },

  deleteTeam: async (teamId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/admin/teams/${teamId}`);
  },
};
