import { apiClient } from './client';
import { ApiResponse, QueryParams } from '@/types/api';

export type MentorStatus = 'AVAILABLE' | 'NOT_AVAILABLE' | 'TEMPORARILY_UNAVAILABLE' | 'FULL';
export type MentorshipType = 'INDIVIDUAL' | 'TEAM';
export type MentorshipFormat = 'ONE_TIME' | 'SHORT_TERM' | 'LONG_TERM';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED';
export type MentorshipStatus = 'ACTIVE' | 'ACCEPTED' | 'COMPLETED' | 'ENDED_BY_MENTOR' | 'ENDED_BY_MENTEE';
export type SessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export interface MentorProfile {
  id: string;
  mentorId?: string;
  userId?: string;
  name: string;
  avatarUrl?: string;
  title?: string;
  jobTitle?: string;
  company?: string;
  yearsOfExperience?: number;
  industry?: string;
  primarySkills?: string[];
  secondarySkills?: string[];
  skills?: string[];
  mentoringAreas?: string[];
  bio?: string;
  availabilitySchedule?: string;
  availabilityStatus?: string;
  availableForMentorship?: boolean;
  timezone?: string;
  maxActiveMentees?: number;
  currentActiveMenteesCount?: number;
  activeMentorshipsCount?: number;
  status?: MentorStatus;
  averageRating?: number;
  totalReviewsCount?: number;
  totalStudentsMentored?: number;
  totalSessionsCompleted?: number;
  distanceKm?: number;
  isRemoteAvailable?: boolean;
  matchScore?: number;
  matchReason?: string[];
}

export interface MentorFilterParams extends QueryParams {
  expertise?: string;
  experienceYears?: string;
  availability?: string;
  mentoringArea?: string;
  minRating?: number;
  isRemote?: boolean;
  eventId?: string;
  problemId?: string;
  teamId?: string;
  search?: string;
  sortBy?: 'BEST_MATCH' | 'RATING' | 'EXPERIENCE' | 'ACTIVE_MENTEES';
}

export interface MentorshipRequestData {
  mentorId: string;
  teamId?: string;
  eventId?: string;
  problemId?: string;
  helpArea?: string;
  message?: string;
  mentorshipType?: MentorshipType;
  preferredFormat?: MentorshipFormat;
  preferredAvailability?: string;
}

export interface MentorshipRequest {
  id: string;
  mentorId?: string;
  mentorName?: string;
  menteeId?: string;
  menteeName?: string;
  menteeCollege?: string;
  mentorshipType?: MentorshipType;
  teamId?: string;
  teamName?: string;
  teamLeadName?: string;
  eventName?: string;
  eventTitle?: string;
  helpArea?: string;
  message?: string;
  createdAt?: string;
  requestedAt?: string;
  status: RequestStatus;
  rejectionReason?: string;
}

export interface MentorshipGoal {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface MentorshipSession {
  id: string;
  mentorshipId: string;
  date: string;
  time: string;
  durationMinutes: number;
  topic: string;
  notes?: string;
  status: SessionStatus;
  joinUrl?: string;
}

export interface ActiveMentorship {
  id: string;
  mentorId?: string;
  mentorName?: string;
  mentorTitle?: string;
  mentorCompany?: string;
  mentorAvatarUrl?: string;
  menteeId?: string;
  menteeName?: string;
  menteeCollege?: string;
  menteeAvatarUrl?: string;
  teamName?: string;
  eventName?: string;
  eventTitle?: string;
  goalSummary?: string;
  goals?: MentorshipGoal[];
  nextSession?: MentorshipSession;
  status: MentorshipStatus;
  startedAt?: string;
  createdAt?: string;
  progressPercentage?: number;
}

export interface MentorFeedbackData {
  mentorshipId: string;
  mentorId: string;
  overallRating: number;
  technicalKnowledgeRating: number;
  communicationRating: number;
  helpfulnessRating: number;
  reviewText: string;
}

export const mentorService = {
  getMentors: async (params?: MentorFilterParams): Promise<ApiResponse<MentorProfile[]>> => {
    const res = await apiClient.get<MentorProfile[]>('/mentors', params);
    if (res.success && res.data) {
      res.data = res.data.map((m) => ({
        ...m,
        title: m.title || m.jobTitle || 'Tech Leader',
        company: m.company || 'Industry Partner',
        primarySkills: m.primarySkills || m.skills || [],
        mentoringAreas: m.mentoringAreas || ['Technical Development', 'Architecture'],
        currentActiveMenteesCount: m.currentActiveMenteesCount ?? m.activeMentorshipsCount ?? 0,
        maxActiveMentees: m.maxActiveMentees ?? 3,
        averageRating: m.averageRating ?? 4.9,
      }));
    }
    return res;
  },

  getMentorById: async (mentorId: string): Promise<ApiResponse<MentorProfile>> => {
    const res = await apiClient.get<MentorProfile>(`/mentors/${mentorId}`);
    if (res.success && res.data) {
      res.data = {
        ...res.data,
        title: res.data.title || res.data.jobTitle || 'Tech Leader',
        company: res.data.company || 'Industry Partner',
        primarySkills: res.data.primarySkills || res.data.skills || [],
        mentoringAreas: res.data.mentoringAreas || ['Technical Development', 'Architecture'],
        currentActiveMenteesCount: res.data.currentActiveMenteesCount ?? 0,
        maxActiveMentees: res.data.maxActiveMentees ?? 3,
        averageRating: res.data.averageRating ?? 4.9,
      };
    }
    return res;
  },

  getRecommendedMentors: async (params?: MentorFilterParams): Promise<ApiResponse<MentorProfile[]>> => {
    return mentorService.getMentors(params);
  },

  createMentorProfile: async (data: Partial<MentorProfile>): Promise<ApiResponse<MentorProfile>> => {
    return apiClient.patch<MentorProfile>('/profile/professional', data);
  },

  updateMentorProfile: async (data: Partial<MentorProfile>): Promise<ApiResponse<MentorProfile>> => {
    return apiClient.patch<MentorProfile>('/profile/professional', data);
  },

  sendMentorshipRequest: async (data: MentorshipRequestData): Promise<ApiResponse<MentorshipRequest>> => {
    return apiClient.post<MentorshipRequest>('/mentorship/requests', data);
  },

  getMentorshipRequests: async (): Promise<ApiResponse<MentorshipRequest[]>> => {
    return apiClient.get<MentorshipRequest[]>('/mentorship/requests');
  },

  acceptMentorshipRequest: async (requestId: string): Promise<ApiResponse<any>> => {
    return apiClient.patch<any>(`/mentorship/requests/${requestId}/accept`);
  },

  rejectMentorshipRequest: async (requestId: string, reason?: string): Promise<ApiResponse<{ rejected: boolean }>> => {
    return apiClient.patch<{ rejected: boolean }>(`/mentorship/requests/${requestId}/reject`, { reason });
  },

  getActiveMentorships: async (): Promise<ApiResponse<ActiveMentorship[]>> => {
    return apiClient.get<ActiveMentorship[]>('/mentorship/active');
  },

  getMentorshipById: async (mentorshipId: string): Promise<ApiResponse<ActiveMentorship>> => {
    return apiClient.get<ActiveMentorship>(`/mentorship/requests/${mentorshipId}`);
  },

  getMentorshipSessions: async (_mentorshipId: string): Promise<ApiResponse<MentorshipSession[]>> => {
    return { success: true, data: [] };
  },

  createMentorshipSession: async (data: Partial<MentorshipSession>): Promise<ApiResponse<MentorshipSession>> => {
    return {
      success: true,
      data: {
        id: 's_' + Date.now(),
        mentorshipId: data.mentorshipId || '',
        date: data.date || '',
        time: data.time || '',
        durationMinutes: data.durationMinutes || 45,
        topic: data.topic || 'Mentorship Sync',
        status: 'SCHEDULED',
      },
    };
  },

  updateMentorshipGoal: async (_mentorshipId: string, goalId: string, isCompleted: boolean): Promise<ApiResponse<MentorshipGoal>> => {
    return { success: true, data: { id: goalId, title: 'Goal', isCompleted } };
  },

  submitMentorFeedback: async (_data: MentorFeedbackData): Promise<ApiResponse<{ submitted: boolean }>> => {
    return { success: true, data: { submitted: true } };
  },

  endMentorship: async (_mentorshipId: string): Promise<ApiResponse<{ ended: boolean }>> => {
    return { success: true, data: { ended: true } };
  },

  getStaffMenteeAnalytics: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<any>('/mentorship/staff/mentee-analytics');
  },

  inviteTeamAsMentor: async (teamId: string, message?: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>('/mentorship/invite-team', { teamId, message });
  },
};
