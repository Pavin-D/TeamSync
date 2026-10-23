import { apiClient } from './client';
import { ApiResponse, QueryParams } from '@/types/api';

export type TeamScope = 'DEPARTMENT' | 'COLLEGE' | 'ALL_COLLEGES' | 'GLOBAL';
export type TeamStatus = 'RECRUITING' | 'PAUSED' | 'FULL' | 'CLOSED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type TeamType = 'STUDENT' | 'PROFESSIONAL' | 'MIXED';

export interface TeamMember {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role: 'TEAM_LEAD' | 'MEMBER' | 'LEAD';
  userType?: 'STUDENT' | 'PROFESSIONAL';
  college?: string;
  department?: string;
  skills?: string[];
  joinedAt?: string;
}

export interface TeamRequest {
  id: string;
  teamId: string;
  teamName?: string;
  eventName?: string;
  eventTitle?: string;
  applicantId?: string;
  applicantName?: string;
  applicantAvatarUrl?: string;
  applicantCollege?: string;
  applicantDepartment?: string;
  applicantGithubUrl?: string;
  applicantLinkedinUrl?: string;
  applicantSkills?: string[];
  matchScore?: number;
  message?: string;
  requestedAt?: string;
  createdAt?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED';
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName?: string;
  eventName?: string;
  invitedByName?: string;
  recipientId?: string;
  recipientName?: string;
  invitedAt?: string;
  createdAt?: string;
  requiredSkills?: string[];
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'EXPIRED';
}

export interface TeamTask {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  createdBy?: string;
  creatorName?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  dueDate?: string | null;
  createdAt: string;
}

export interface TeamAnnouncement {
  id: string;
  title: string;
  message: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
}

export interface TeamActivity {
  id: string;
  userName: string;
  description: string;
  activityType: string;
  createdAt: string;
}

export interface TeamLink {
  id: string;
  title: string;
  url: string;
  description?: string;
}

export interface TeamWorkspaceOverview {
  team: {
    id: string;
    name: string;
    description?: string;
    status: string;
    recruitmentOpen: boolean;
    maxMembers: number;
    currentMembersCount: number;
    githubRepoUrl?: string;
    isCurrentUserLead: boolean;
    teamLead: {
      id: string;
      name: string;
      email?: string;
      profileImage?: string;
      organization?: string;
    };
  };
  event: {
    id: string;
    title: string;
    organizer: string;
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    status: string;
    mode: string;
  };
  members: TeamMember[];
  progress: {
    totalTasks: number;
    completedTasks: number;
    percentage: number;
  };
  skillsSummary: {
    allTeamSkills: string[];
    requiredSkills: string[];
    coveredSkills: string[];
    missingSkills: string[];
  };
  mentor?: {
    id: string;
    name: string;
    avatarUrl?: string;
    company?: string;
    jobTitle?: string;
  } | null;
  tasks: TeamTask[];
  announcements: TeamAnnouncement[];
  activities: TeamActivity[];
  links: TeamLink[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  posterUrl?: string;
  eventId: string;
  eventName?: string;
  eventTitle?: string;
  problemStatementId?: string;
  problemStatementTitle?: string;
  teamLead: TeamMember;
  members: TeamMember[];
  minimumMembers?: number;
  maximumMembers: number;
  maxMembers?: number;
  currentMemberCount: number;
  currentMembersCount?: number;
  scope: TeamScope;
  teamType?: TeamType;
  requiredSkills: string[];
  recruitmentStatus?: TeamStatus;
  recruitmentOpen?: boolean;
  status?: TeamStatus;
  userJoinState?: string;
  collaborationPreference?: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  createdAt: string;
  updatedAt?: string;
  isCurrentUserMember?: boolean;
  isCurrentUserLead?: boolean;
  userRequestStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface TeamFilterParams extends QueryParams {
  eventId?: string;
  scope?: TeamScope;
  status?: TeamStatus;
  teamType?: TeamType;
  skills?: string;
  remainingSlots?: string;
  collegeId?: string;
  collegeName?: string;
  departmentId?: string;
  departmentName?: string;
  college?: string;
  department?: string;
}

export const teamService = {
  getTeams: async (params?: TeamFilterParams): Promise<ApiResponse<Team[]>> => {
    return apiClient.get<Team[]>('/teams', params);
  },

  getTeamById: async (id: string): Promise<ApiResponse<Team>> => {
    return apiClient.get<Team>(`/teams/${id}`);
  },

  getTeamWorkspace: async (id: string): Promise<ApiResponse<TeamWorkspaceOverview>> => {
    return apiClient.get<TeamWorkspaceOverview>(`/teams/${id}/workspace`);
  },

  createTeam: async (data: Partial<Team>): Promise<ApiResponse<Team>> => {
    return apiClient.post<Team>('/teams', data);
  },

  updateTeam: async (id: string, data: Partial<Team>): Promise<ApiResponse<Team>> => {
    return apiClient.patch<Team>(`/teams/${id}`, data);
  },

  deleteTeam: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    return apiClient.delete<{ deleted: boolean }>(`/teams/${id}`);
  },

  requestToJoinTeam: async (teamId: string, message?: string, _skills?: string[]): Promise<ApiResponse<TeamRequest>> => {
    return apiClient.post<TeamRequest>(`/teams/${teamId}/join-requests`, { message });
  },

  cancelJoinRequest: async (requestId: string): Promise<ApiResponse<{ cancelled: boolean }>> => {
    return apiClient.patch<{ cancelled: boolean }>(`/join-requests/${requestId}/cancel`);
  },

  getTeamRequests: async (teamId: string): Promise<ApiResponse<TeamRequest[]>> => {
    return apiClient.get<TeamRequest[]>(`/teams/${teamId}/join-requests`);
  },

  acceptJoinRequest: async (requestId: string): Promise<ApiResponse<{ accepted: boolean }>> => {
    return apiClient.patch<{ accepted: boolean }>(`/join-requests/${requestId}/accept`);
  },

  rejectJoinRequest: async (requestId: string): Promise<ApiResponse<{ rejected: boolean }>> => {
    return apiClient.patch<{ rejected: boolean }>(`/join-requests/${requestId}/reject`);
  },

  getTeamInvitations: async (_teamId: string): Promise<ApiResponse<TeamInvitation[]>> => {
    return apiClient.get<TeamInvitation[]>(`/users/me/invitations`);
  },

  sendTeamInvitation: async (teamId: string, recipientId: string): Promise<ApiResponse<TeamInvitation>> => {
    return apiClient.post<TeamInvitation>(`/teams/${teamId}/invitations`, { userId: recipientId });
  },

  acceptInvitation: async (invitationId: string): Promise<ApiResponse<{ accepted: boolean }>> => {
    return apiClient.patch<{ accepted: boolean }>(`/invitations/${invitationId}/accept`);
  },

  declineInvitation: async (invitationId: string): Promise<ApiResponse<{ declined: boolean }>> => {
    return apiClient.patch<{ declined: boolean }>(`/invitations/${invitationId}/reject`);
  },

  getMyTeams: async (): Promise<ApiResponse<Team[]>> => {
    return apiClient.get<Team[]>('/users/me/teams');
  },

  getUserTeams: async (): Promise<ApiResponse<Team[]>> => {
    return apiClient.get<Team[]>('/users/me/teams');
  },

  getTeamsILed: async (): Promise<ApiResponse<Team[]>> => {
    return apiClient.get<Team[]>('/users/me/teams');
  },

  getMyRequests: async (): Promise<ApiResponse<TeamRequest[]>> => {
    return apiClient.get<TeamRequest[]>('/users/me/join-requests');
  },

  getMyInvitations: async (): Promise<ApiResponse<TeamInvitation[]>> => {
    return apiClient.get<TeamInvitation[]>('/users/me/invitations');
  },

  getTeamMembers: async (teamId: string): Promise<ApiResponse<TeamMember[]>> => {
    return apiClient.get<TeamMember[]>(`/teams/${teamId}`);
  },

  removeTeamMember: async (teamId: string, memberId: string): Promise<ApiResponse<{ removed: boolean }>> => {
    return apiClient.delete<{ removed: boolean }>(`/teams/${teamId}/members/${memberId}`);
  },

  updateRecruitmentStatus: async (teamId: string, status: TeamStatus): Promise<ApiResponse<Team>> => {
    return apiClient.patch<Team>(`/teams/${teamId}`, { recruitmentOpen: status === 'RECRUITING' });
  },

  // Workspace specific tasks & announcements
  getTasks: async (teamId: string): Promise<ApiResponse<TeamTask[]>> => {
    return apiClient.get<TeamTask[]>(`/teams/${teamId}/tasks`);
  },

  createTask: async (teamId: string, data: any): Promise<ApiResponse<TeamTask>> => {
    return apiClient.post<TeamTask>(`/teams/${teamId}/tasks`, data);
  },

  updateTask: async (teamId: string, taskId: string, data: any): Promise<ApiResponse<TeamTask>> => {
    return apiClient.patch<TeamTask>(`/teams/${teamId}/tasks/${taskId}`, data);
  },

  deleteTask: async (teamId: string, taskId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/teams/${teamId}/tasks/${taskId}`);
  },

  getAnnouncements: async (teamId: string): Promise<ApiResponse<TeamAnnouncement[]>> => {
    return apiClient.get<TeamAnnouncement[]>(`/teams/${teamId}/announcements`);
  },

  createAnnouncement: async (teamId: string, data: any): Promise<ApiResponse<TeamAnnouncement>> => {
    return apiClient.post<TeamAnnouncement>(`/teams/${teamId}/announcements`, data);
  },

  transferLeadership: async (teamId: string, newLeadUserId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(`/teams/${teamId}/transfer-lead`, { newLeadUserId });
  },

  updateTeamSettings: async (teamId: string, data: any): Promise<ApiResponse<Team>> => {
    return apiClient.patch<Team>(`/teams/${teamId}/settings`, data);
  },

  addTeamLink: async (teamId: string, data: any): Promise<ApiResponse<TeamLink>> => {
    return apiClient.post<TeamLink>(`/teams/${teamId}/links`, data);
  },
};
