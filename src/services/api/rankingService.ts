import { apiClient } from './client';
import { ApiResponse, QueryParams } from '@/types/api';

export type RankingScope = 'GLOBAL' | 'COUNTRY' | 'COLLEGE' | 'DEPARTMENT';
export type RankingPeriod = 'ALL_TIME' | '2026' | '2025' | '2024' | 'YEAR' | 'MONTH';
export type ParticipationResult = 'WINNER' | 'RUNNER_UP' | 'FINALIST' | 'TOP_10' | 'PARTICIPANT' | 'PARTICIPATED';

export interface StudentRanking {
  rank: number;
  previousRank?: number;
  rankMovement?: number;
  studentId: string;
  userId?: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  profileImage?: string;
  college: string;
  collegeId?: string;
  department: string;
  departmentId?: string;
  skills?: string[];
  score: number;
  participationsCount?: number;
  eventsParticipated?: number;
  wins: number;
  runnerUps?: number;
  finalists?: number;
  finalistCount?: number;
  teamsLedCount?: number;
  achievements?: string[];
}

export interface CollegeRanking {
  rank: number;
  previousRank?: number;
  rankMovement?: number;
  collegeId: string;
  collegeName: string;
  logoUrl?: string;
  location?: string;
  totalStudents: number;
  participatingStudents?: number;
  activeParticipantsCount?: number;
  eventsParticipated?: number;
  totalEventsCount?: number;
  wins?: number;
  totalWins?: number;
  finalists?: number;
  totalFinalists?: number;
  score?: number;
  totalScore?: number;
  avgStudentScore?: number;
  completionRate?: number;
}

export interface DepartmentRanking {
  rank: number;
  departmentId?: string;
  departmentName: string;
  collegeName?: string;
  totalStudents: number;
  eventsParticipated?: number;
  participantsCount?: number;
  wins?: number;
  totalWins?: number;
  finalists?: number;
  totalFinalists?: number;
  score?: number;
  avgScore?: number;
}

export interface ParticipationRecord {
  id: string;
  eventId: string;
  eventName?: string;
  eventTitle?: string;
  eventBannerUrl?: string;
  teamId: string;
  teamName: string;
  role?: string;
  problemStatement?: string;
  technologies?: string[];
  result: ParticipationResult | string;
  isVerified?: boolean;
  date?: string;
  eventDate?: string;
  participatedAt?: string;
  year?: number;
  certificateUrl?: string;
  teamMembersCount?: number;
}

export interface RankingFilterParams extends QueryParams {
  scope?: RankingScope;
  period?: RankingPeriod;
  skill?: string;
  collegeId?: string;
  departmentId?: string;
  search?: string;
  sortBy?: 'RANK' | 'SCORE' | 'WINS' | 'EVENTS' | 'FINALISTS';
}

export interface YearlyPerformanceTrend {
  year?: number;
  period?: string;
  events?: number;
  participations?: number;
  wins?: number;
  finalists?: number;
}

export interface UserRankSummary {
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  college?: string;
  department?: string;
  globalRank: number;
  collegeRank: number | null;
  departmentRank: number | null;
  score: number;
  totalEvents?: number;
  eventsParticipated?: number;
  completedEvents?: number;
  wins: number;
  runnerUps?: number;
  finalists?: number;
  teamsJoinedCount?: number;
  teamsLedCount?: number;
  rankMovement?: number;
}

export const rankingService = {
  getStudentRankings: async (params?: RankingFilterParams): Promise<ApiResponse<StudentRanking[]>> => {
    return apiClient.get<StudentRanking[]>('/rankings/students', params);
  },

  getStudentRank: async (_userId?: string): Promise<ApiResponse<UserRankSummary>> => {
    return apiClient.get<UserRankSummary>('/me/analytics');
  },

  getCollegeRankings: async (params?: RankingFilterParams): Promise<ApiResponse<CollegeRanking[]>> => {
    return apiClient.get<CollegeRanking[]>('/rankings/colleges', params);
  },

  getCollegeById: async (collegeId: string): Promise<ApiResponse<CollegeRanking>> => {
    return apiClient.get<CollegeRanking>(`/colleges/${collegeId}/analytics`);
  },

  getDepartmentRankings: async (params?: RankingFilterParams): Promise<ApiResponse<DepartmentRanking[]>> => {
    return apiClient.get<DepartmentRanking[]>(`/colleges/${params?.collegeId || 'all'}/departments/analytics`, params);
  },

  getParticipationHistory: async (params?: QueryParams): Promise<ApiResponse<ParticipationRecord[]>> => {
    return apiClient.get<ParticipationRecord[]>('/me/participation-history', params);
  },

  getParticipationDetails: async (_participationId: string): Promise<ApiResponse<ParticipationRecord>> => {
    return apiClient.get<ParticipationRecord>('/me/participation-history');
  },

  getStudentPerformanceTrend: async (_userId?: string): Promise<ApiResponse<YearlyPerformanceTrend[]>> => {
    return apiClient.get<YearlyPerformanceTrend[]>('/me/analytics/participation-over-time');
  },

  getCollegePerformanceTrend: async (collegeId: string): Promise<ApiResponse<YearlyPerformanceTrend[]>> => {
    return apiClient.get<YearlyPerformanceTrend[]>(`/colleges/${collegeId}/analytics`);
  },

  compareStudents: async (_studentIds: string[]): Promise<ApiResponse<StudentRanking[]>> => {
    return apiClient.get<StudentRanking[]>('/rankings/students');
  },

  compareColleges: async (_collegeIds: string[]): Promise<ApiResponse<CollegeRanking[]>> => {
    return apiClient.get<CollegeRanking[]>('/rankings/colleges');
  },
};
