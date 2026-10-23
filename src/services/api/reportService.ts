import { apiClient } from './client';
import { ApiResponse, QueryParams } from '@/types/api';

export type ReportEntityType = 'USER' | 'TEAM' | 'MENTOR' | 'TEAM_MEMBER';
export type ReportReason =
  | 'NON_PARTICIPATION'
  | 'TEAM_ABANDONMENT'
  | 'MISREPRESENTED_SKILLS'
  | 'MISCONDUCT'
  | 'HARASSMENT'
  | 'UNPROFESSIONAL_BEHAVIOUR'
  | 'OTHER'
  | 'BULLYING'
  | 'INAPPROPRIATE_BEHAVIOUR'
  | 'FAKE_PROFILE'
  | 'MISLEADING_INFORMATION'
  | 'FAKE_SKILLS'
  | 'SPAM'
  | 'SCAM'
  | 'REPEATED_NO_SHOW'
  | 'MENTORSHIP_MISCONDUCT';

export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED' | 'SUBMITTED' | 'ACTION_TAKEN' | 'CLOSED';
export type ReportPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AccountStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'RESTRICTED' | 'SUSPENDED' | 'BANNED' | 'DELETED';

export interface ReportEvidence {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
}

export interface Report {
  id: string;
  reportNumber?: string;
  reporterId: string;
  reporterName?: string;
  reporterEmail?: string;
  reportedUserId: string;
  reportedUserName?: string;
  reportedUser?: { id: string; name: string; email?: string; profileImage?: string; role?: string };
  reportedEntityType?: ReportEntityType;
  reportedEntityId?: string;
  reportedEntityName?: string;
  teamId?: string;
  eventId?: string;
  teamName?: string;
  eventTitle?: string;
  reason: ReportReason | string;
  description: string;
  evidence?: ReportEvidence[];
  status: ReportStatus | string;
  severity?: ReportPriority | string;
  priority?: ReportPriority | string;
  resolution?: string;
  resolutionNotes?: string;
  actionTaken?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt?: string;
  validatedReportsCountForUser?: number;
}

export interface CreateReportData {
  reportedUserId: string;
  teamId?: string;
  eventId?: string;
  reason: ReportReason | string;
  description: string;
  reportedEntityType?: ReportEntityType;
  reportedEntityId?: string;
  reportedEntityName?: string;
  evidenceFiles?: File[];
}

export interface ReportFilterParams extends QueryParams {
  status?: ReportStatus | string;
  reason?: ReportReason | string;
  severity?: ReportPriority | string;
  priority?: ReportPriority | string;
  search?: string;
}

export interface UserReportSummary {
  userId: string;
  name: string;
  reputationScore: number;
  trustBadge: string;
  participationsCount: number;
  reportsSummary: {
    total: number;
    confirmed: number;
    pending: number;
    dismissed: number;
  };
}

export interface ModerationUserStatus {
  userId: string;
  userName: string;
  userRole: string;
  accountStatus: AccountStatus;
  totalReportsReceived: number;
  validatedReportsCount: number;
  thresholdCount: number;
  activeRestrictions: string[];
  warningCount: number;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  targetUser: string;
  date: string;
  reason: string;
}

export interface AppealData {
  accountStatus: AccountStatus;
  reason: string;
  statement: string;
}

export interface Appeal {
  id: string;
  userId: string;
  userName: string;
  statement: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

export const reportService = {
  createReport: async (data: CreateReportData): Promise<ApiResponse<Report>> => {
    return apiClient.post<Report>('/reports', data);
  },

  getMyReports: async (): Promise<ApiResponse<Report[]>> => {
    return apiClient.get<Report[]>('/me/reports');
  },

  getReportById: async (reportId: string): Promise<ApiResponse<Report>> => {
    return apiClient.get<Report>(`/me/reports/${reportId}`);
  },

  getUserReportSummary: async (userId: string): Promise<ApiResponse<UserReportSummary>> => {
    return apiClient.get<UserReportSummary>(`/users/${userId}/report-summary`);
  },

  getAdminReports: async (params?: ReportFilterParams): Promise<ApiResponse<Report[]>> => {
    return apiClient.get<Report[]>('/admin/reports', params);
  },

  getAdminReportById: async (reportId: string): Promise<ApiResponse<Report>> => {
    return apiClient.get<Report>(`/admin/reports/${reportId}`);
  },

  getAdminReportStats: async (): Promise<ApiResponse<{ totalReports: number; pendingReports: number; underReviewReports: number; resolvedReports: number; dismissedReports: number }>> => {
    return apiClient.get('/admin/reports/stats');
  },

  getTopReportedUsers: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get('/admin/reports/top-reported-users');
  },

  resolveReport: async (reportId: string, status: string, resolution?: string, severity?: string): Promise<ApiResponse<Report>> => {
    return apiClient.patch<Report>(`/admin/reports/${reportId}`, { status, resolution, severity });
  },

  dismissReport: async (reportId: string, reason: string): Promise<ApiResponse<Report>> => {
    return apiClient.patch<Report>(`/admin/reports/${reportId}`, { status: 'DISMISSED', resolution: 'DISMISSED', adminNotes: reason });
  },

  submitAppeal: async (data: AppealData): Promise<ApiResponse<Appeal>> => {
    return apiClient.post<Appeal>('/reports', { reason: 'APPEAL', description: data.statement, reportedUserId: '00000000-0000-0000-0000-000000000000' });
  },

  getAuditLogs: async (params?: QueryParams): Promise<ApiResponse<AuditLog[]>> => {
    return apiClient.get<AuditLog[]>('/admin/reports/stats', params);
  },

  warnUser: async (userId: string, message: string): Promise<ApiResponse<{ warned: boolean }>> => {
    return apiClient.post<{ warned: boolean }>(`/admin/users/${userId}/warn`, { message });
  },

  restrictUser: async (
    userId: string,
    restrictions: string[],
    durationDays: number,
    reason: string
  ): Promise<ApiResponse<{ restricted: boolean }>> => {
    return apiClient.post<{ restricted: boolean }>(`/admin/users/${userId}/restrict`, {
      restrictions,
      durationDays,
      reason,
    });
  },

  suspendUser: async (userId: string, durationDays: number, reason: string): Promise<ApiResponse<{ suspended: boolean }>> => {
    return apiClient.post<{ suspended: boolean }>(`/admin/users/${userId}/suspend`, { durationDays, reason });
  },

  restoreUser: async (userId: string): Promise<ApiResponse<{ restored: boolean }>> => {
    return apiClient.post<{ restored: boolean }>(`/admin/users/${userId}/restore`);
  },

  deleteUser: async (userId: string, reason: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    return apiClient.post<{ deleted: boolean }>(`/admin/users/${userId}/delete`, { reason });
  },
};
