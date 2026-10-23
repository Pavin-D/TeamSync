import { apiClient } from './client';
import { ApiResponse, QueryParams } from '@/types/api';

export interface CollegeProfile {
  collegeId: string;
  collegeName: string;
  location?: string;
  website?: string;
  emailDomain?: string;
  isVerified?: boolean;
  totalStudents: number;
  participatingStudents?: number;
  activeParticipants?: number;
  participationRate?: number;
  totalEvents: number;
  totalTeams?: number;
  totalWins: number;
  totalRunnerUps?: number;
  totalFinalists: number;
  globalRank?: number;
  collegeRank?: number;
  totalCollegesCount?: number;
  countryRank?: number;
  regionalRank?: number;
  rankMovement?: number;
  avgStudentScore?: number;
  completionRate?: number;
  totalStaff?: number;
  staffMembers?: { id: string; name: string; email: string; role: string; jobTitle?: string }[];
  staffMentorRoster?: {
    mentorshipId: string;
    staffName: string;
    staffEmail: string;
    staffTitle: string;
    teamId: string;
    teamName: string;
    eventTitle: string;
    teamLeadName: string;
    membersCount: number;
    status: string;
  }[];
  studentParticipationHistory?: {
    id: string;
    studentName: string;
    studentEmail: string;
    eventTitle: string;
    teamName: string;
    result: string;
    date: string;
  }[];
  collegeStudentRankings?: {
    studentId: string;
    studentName: string;
    globalRank: number;
    collegeRank: number;
    score: number;
    wins: number;
    department: string;
  }[];
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  jobTitle?: string;
  department?: string;
}

export interface CollegeStudent {
  studentId: string;
  userId?: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  studentCode?: string;
  department: string;
  yearOfStudy?: number;
  academicYear?: string;
  eventsParticipated?: number;
  participationsCount?: number;
  wins: number;
  finalists?: number;
  score?: number;
  collegeRank?: number;
  globalRank?: number;
  status?: 'ACTIVE' | 'GRADUATED' | 'INACTIVE';
  participationStatus?: 'HIGH_PERFORMER' | 'ACTIVE_PARTICIPANT' | 'NOT_YET_PARTICIPATED';
}

export interface DepartmentSummary {
  departmentId: string;
  departmentName: string;
  totalStudents: number;
  participatingStudents?: number;
  participantsCount?: number;
  participationRate?: number;
  eventsParticipated?: number;
  wins?: number;
  totalWins?: number;
  finalists?: number;
  totalFinalists?: number;
  rank?: number;
  avgScore?: number;
}

export interface CollegeEventParticipation {
  eventId: string;
  eventName?: string;
  eventTitle?: string;
  eventBannerUrl?: string;
  date?: string;
  startDate?: string;
  status?: string;
  mode?: string;
  studentsCount?: number;
  participantsCount?: number;
  teamsCount?: number;
  winsCount?: number;
  wins?: number;
  finalistsCount?: number;
  finalists?: number;
  resultSummary?: string;
  participatingDepartments?: string[];
}

export interface CollegeTeamRecord {
  teamId: string;
  teamName: string;
  eventName?: string;
  eventTitle?: string;
  membersCount?: number;
  departmentMix?: 'SAME_DEPARTMENT' | 'CROSS_DEPARTMENT' | 'CROSS_COLLEGE' | 'PROFESSIONAL_STUDENT';
  result?: string;
  status?: string;
}

export interface CollaborationMetrics {
  sameDepartmentTeams?: number;
  crossDepartmentTeamsCount?: number;
  crossDepartmentTeams?: number;
  crossCollegeTeamsCount?: number;
  crossCollegeTeams?: number;
  professionalStudentTeams?: number;
  externalCollegesConnected?: number;
  studentsInExternalTeams?: number;
  studentsWithMentors?: number;
  totalCollegeTeams?: number;
}

export interface CollegeMentorshipMetrics {
  activeMentors: number;
  studentsMentored: number;
  activeMentorships: number;
  completedMentorships: number;
  byDepartment: { department: string; studentsCount: number }[];
}

export interface CollegeAchievement {
  id: string;
  title: string;
  type: 'WIN' | 'RUNNER_UP' | 'FINALIST' | 'PARTICIPATION_MILESTONE' | 'COLLABORATION_MILESTONE';
  eventName: string;
  teamName: string;
  date: string;
  year: number;
}

export interface CollegeFilterParams extends QueryParams {
  departmentId?: string;
  academicYear?: string;
  participationStatus?: string;
  search?: string;
  sortBy?: string;
}

export const collegeService = {
  getCollegeDashboard: async (collegeId?: string): Promise<ApiResponse<CollegeProfile>> => {
    return apiClient.get<CollegeProfile>(`/colleges/${collegeId || 'me'}/analytics`);
  },

  getCollegeProfile: async (collegeId?: string): Promise<ApiResponse<CollegeProfile>> => {
    return apiClient.get<CollegeProfile>(`/colleges/${collegeId || 'me'}/analytics`);
  },

  updateCollegeProfile: async (data: Partial<CollegeProfile>): Promise<ApiResponse<CollegeProfile>> => {
    return apiClient.put<CollegeProfile>('/colleges/me/profile', data);
  },

  getCollegeStudents: async (collegeId?: string, params?: CollegeFilterParams): Promise<ApiResponse<CollegeStudent[]>> => {
    return apiClient.get<CollegeStudent[]>(`/colleges/${collegeId || 'me'}/students`, params);
  },

  getCollegeStudentById: async (collegeId: string, studentId: string): Promise<ApiResponse<CollegeStudent>> => {
    return apiClient.get<CollegeStudent>(`/colleges/${collegeId}/students/${studentId}`);
  },

  getDepartments: async (collegeId?: string): Promise<ApiResponse<DepartmentSummary[]>> => {
    return apiClient.get<DepartmentSummary[]>(`/colleges/${collegeId || 'me'}/departments/analytics`);
  },

  getDepartmentDetails: async (collegeId: string, _departmentId: string): Promise<ApiResponse<DepartmentSummary>> => {
    return apiClient.get<DepartmentSummary>(`/colleges/${collegeId}/departments/analytics`);
  },

  getCollegeEvents: async (collegeId?: string): Promise<ApiResponse<CollegeEventParticipation[]>> => {
    return apiClient.get<CollegeEventParticipation[]>(`/colleges/${collegeId || 'me'}/events/analytics`);
  },

  getCollegeEventDetails: async (collegeId: string, _eventId: string): Promise<ApiResponse<CollegeEventParticipation>> => {
    return apiClient.get<CollegeEventParticipation>(`/colleges/${collegeId}/events/analytics`);
  },

  getCollegeTeams: async (collegeId?: string): Promise<ApiResponse<CollaborationMetrics>> => {
    return apiClient.get<CollaborationMetrics>(`/colleges/${collegeId || 'me'}/teams/analytics`);
  },

  getCollaborationAnalytics: async (collegeId?: string): Promise<ApiResponse<CollaborationMetrics>> => {
    return apiClient.get<CollaborationMetrics>(`/colleges/${collegeId || 'me'}/teams/analytics`);
  },

  getMentorshipAnalytics: async (): Promise<ApiResponse<CollegeMentorshipMetrics>> => {
    return apiClient.get<CollegeMentorshipMetrics>('/colleges/me/mentorship');
  },

  getCollegeAchievements: async (): Promise<ApiResponse<CollegeAchievement[]>> => {
    return apiClient.get<CollegeAchievement[]>('/colleges/me/achievements');
  },

  exportCollegeReport: async (format: 'PDF' | 'CSV' | 'EXCEL'): Promise<ApiResponse<{ reportUrl: string }>> => {
    return apiClient.post<{ reportUrl: string }>('/colleges/me/report/export', { format });
  },

  addStudent: async (collegeId: string | undefined, data: { name: string; email: string; password?: string; department?: string; yearOfStudy?: number }): Promise<ApiResponse<CollegeStudent>> => {
    return apiClient.post<CollegeStudent>(`/colleges/${collegeId || 'me'}/students`, data);
  },

  deleteStudent: async (collegeId: string | undefined, studentId: string): Promise<ApiResponse<{ success: boolean }>> => {
    return apiClient.delete<{ success: boolean }>(`/colleges/${collegeId || 'me'}/students/${studentId}`);
  },

  getCollegeStaff: async (collegeId?: string): Promise<ApiResponse<{ id: string; name: string; email: string; role: string; jobTitle?: string;
  department?: string; company?: string }[]>> => {
    return apiClient.get<{ id: string; name: string; email: string; role: string; jobTitle?: string;
  department?: string; company?: string }[]>(`/colleges/${collegeId || 'me'}/staff`);
  },

  addStaff: async (collegeId: string | undefined, data: { name: string; email: string; password?: string; jobTitle?: string }): Promise<ApiResponse<{ id: string; name: string; email: string; role: string; jobTitle?: string }>> => {
    return apiClient.post<{ id: string; name: string; email: string; role: string; jobTitle?: string }>(`/colleges/${collegeId || 'me'}/staff`, data);
  },

  updateStaff: async (collegeId: string | undefined, staffId: string, data: { name?: string; email?: string; password?: string; jobTitle?: string }): Promise<ApiResponse<{ id: string; name: string; email: string; role: string; jobTitle?: string }>> => {
    return apiClient.put<{ id: string; name: string; email: string; role: string; jobTitle?: string }>(`/colleges/${collegeId || 'me'}/staff/${staffId}`, data);
  },

  deleteStaff: async (collegeId: string | undefined, staffId: string): Promise<ApiResponse<{ success: boolean }>> => {
    return apiClient.delete<{ success: boolean }>(`/colleges/${collegeId || 'me'}/staff/${staffId}`);
  },
};
