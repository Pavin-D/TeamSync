import { apiClient } from './client';
import { ApiResponse, QueryParams } from '@/types/api';

export interface MatchBreakdown {
  skillComplementarity: number;
  problemFit: number;
  technologyFit: number;
  experienceRelevance: number;
  overallCompatibility: number;
}

export interface CandidateProfile {
  id: string;
  candidateId?: string;
  userId?: string;
  name: string;
  avatarUrl?: string;
  role: string;
  college?: string;
  department?: string;
  company?: string;
  jobTitle?: string;
  userType?: 'STUDENT' | 'PROFESSIONAL';
  githubUsername?: string;
  linkedInUrl?: string;
  skills?: string[];
  matchedSkills?: string[];
  missingSkillsFilled?: string[];
  githubSkills?: string[];
  githubAnalytics?: any;
  compatibilityScore: number;
  distanceKm?: number | null;
  category?: 'BEST_MATCH' | 'SKILL_GAP_FILLER' | 'NEARBY_MATCH' | 'PROFESSIONAL_EXPERT' | 'MENTOR_MATCH';
  reason?: string;
  matchBreakdown?: MatchBreakdown;
  explanation?: {
    title: string;
    points: string[];
  };
  missingTeamSkillsCovered?: string[];
  isSaved?: boolean;
}

export interface SkillGapData {
  requiredSkills: string[];
  coveredSkills: string[];
  missingSkills: string[];
  coveragePercentage: number;
}

export interface RecommendedTeam {
  id: string;
  teamId: string;
  name: string;
  teamName: string;
  eventName: string;
  teamLeadName: string;
  membersCount: number;
  maxMembers: number;
  openSlots: number;
  requiredSkills: string[];
  compatibilityScore: number;
  reason: string;
}

export interface RecommendationFilterParams extends QueryParams {
  eventId?: string;
  problemId?: string;
  teamId?: string;
  role?: string;
  skill?: string;
  userType?: 'STUDENT' | 'PROFESSIONAL';
  college?: string;
  sortBy?: 'BEST_MATCH' | 'COMPLEMENTARITY' | 'PROBLEM_FIT' | 'SKILL_GAP' | 'RECENT_ACTIVITY';
}

export const recommendationService = {
  getRecommendations: async (params?: RecommendationFilterParams): Promise<ApiResponse<CandidateProfile[]>> => {
    if (params?.teamId) {
      return apiClient.get<CandidateProfile[]>(`/teams/${params.teamId}/recommendations`, params);
    }
    return apiClient.get<CandidateProfile[]>('/discovery/users/recommended', params);
  },

  getRecommendedTeams: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/discovery/teams/recommended');
  },

  getRecommendedEvents: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/discovery/events/recommended');
  },

  getNearbyPeople: async (radius: number = 25): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/discovery/nearby', { radius });
  },

  globalSearch: async (q: string, type?: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/discovery/search', { q, type });
  },

  getTeamRecommendations: async (teamId: string, params?: QueryParams): Promise<ApiResponse<CandidateProfile[]>> => {
    return apiClient.get<CandidateProfile[]>(`/teams/${teamId}/recommendations`, params);
  },

  getMentorRecommendations: async (eventId?: string): Promise<ApiResponse<CandidateProfile[]>> => {
    return apiClient.get<CandidateProfile[]>('/recommendations/mentors', { eventId });
  },

  getSkillGap: async (teamId: string): Promise<ApiResponse<SkillGapData>> => {
    return apiClient.get<SkillGapData>(`/teams/${teamId}/skill-gap`);
  },

  getCandidateById: async (userId: string): Promise<ApiResponse<CandidateProfile>> => {
    return apiClient.get<CandidateProfile>(`/users/${userId}`);
  },

  getMatchBreakdown: async (candidateId: string): Promise<ApiResponse<MatchBreakdown>> => {
    return apiClient.get<MatchBreakdown>(`/recommendations/${candidateId}/breakdown`);
  },

  saveCandidate: async (candidateId: string): Promise<ApiResponse<{ saved: boolean }>> => {
    return apiClient.post<{ saved: boolean }>(`/recommendations/${candidateId}/save`);
  },

  removeSavedCandidate: async (candidateId: string): Promise<ApiResponse<{ saved: boolean }>> => {
    return apiClient.delete<{ saved: boolean }>(`/recommendations/${candidateId}/save`);
  },

  getSavedCandidates: async (): Promise<ApiResponse<CandidateProfile[]>> => {
    return apiClient.get<CandidateProfile[]>('/recommendations/saved');
  },

  dismissRecommendation: async (candidateId: string): Promise<ApiResponse<{ dismissed: boolean }>> => {
    return apiClient.post<{ dismissed: boolean }>(`/recommendations/${candidateId}/dismiss`);
  },

};
