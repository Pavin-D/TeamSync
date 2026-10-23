import { apiClient } from './client';
import { ApiResponse, QueryParams } from '@/types/api';

export type EventStatus =
  | 'UPCOMING'
  | 'REGISTRATION_OPEN'
  | 'CLOSING_SOON'
  | 'ONGOING'
  | 'COMPLETED'
  | 'CANCELLED';

export type EventScope = 'COLLEGE' | 'DEPARTMENT' | 'INTER_COLLEGE' | 'NATIONAL' | 'GLOBAL';
export type EventMode = 'ONLINE' | 'OFFLINE' | 'HYBRID';
export type EventEligibilityType = 'STUDENTS' | 'PROFESSIONALS' | 'STUDENTS_AND_PROFESSIONALS';

export interface ProblemStatement {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  domain: string;
  requiredSkills: string[];
  preferredTechnologies: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  expectedDeliverables: string[];
  teamSizeMin: number;
  teamSizeMax: number;
}

export interface EventOrganizer {
  name: string;
  organization: string;
  type: 'COLLEGE' | 'COMPANY' | 'COMMUNITY' | 'ORGANIZATION';
  logoUrl?: string;
  website?: string;
  contactEmail?: string;
}

export interface EventPrize {
  title: string;
  reward: string;
  type: 'CASH' | 'CERTIFICATE' | 'INTERNSHIP' | 'MENTORSHIP' | 'SWAG';
  description?: string;
}

export interface TimelineStep {
  title: string;
  date: string;
  time?: string;
  description?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface EventParticipantStats {
  totalRegistered: number;
  studentsCount: number;
  professionalsCount: number;
  collegesRepresented: number;
}

export interface Event {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  organizer: EventOrganizer;
  status: EventStatus;
  scope: EventScope;
  mode: EventMode;
  eligibilityType: EventEligibilityType;
  eligibilityNotes?: string[];
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  registrationClosingTimestamp: string;
  locationCity?: string;
  locationState?: string;
  locationCountry?: string;
  venueName?: string;
  domain: string;
  minTeamSize: number;
  maxTeamSize: number;
  requiredSkills: string[];
  prizes: EventPrize[];
  timeline: TimelineStep[];
  problemStatements: ProblemStatement[];
  participantStats: EventParticipantStats;
  isFeatured?: boolean;
  isSaved?: boolean;
  userRegistrationStatus?: 'NOT_REGISTERED' | 'REGISTERED' | 'TEAM_FORMED' | 'CLOSED';
}

export interface EventFilterParams extends QueryParams {
  scope?: EventScope;
  mode?: EventMode;
  domain?: string;
  status?: EventStatus;
  teamSize?: string;
  eligibility?: EventEligibilityType;
  deadline?: string;
  city?: string;
}

export const eventService = {
  getEvents: async (params?: EventFilterParams): Promise<ApiResponse<Event[]>> => {
    return apiClient.get<Event[]>('/events', params);
  },

  getEventById: async (id: string): Promise<ApiResponse<Event>> => {
    return apiClient.get<Event>(`/events/${id}`);
  },

  getFeaturedEvents: async (): Promise<ApiResponse<Event[]>> => {
    return apiClient.get<Event[]>('/events', { limit: 5 });
  },

  getUpcomingEvents: async (): Promise<ApiResponse<Event[]>> => {
    return apiClient.get<Event[]>('/events', { status: 'UPCOMING' });
  },

  getRegisteredEvents: async (): Promise<ApiResponse<Event[]>> => {
    return apiClient.get<Event[]>('/events');
  },

  getSavedEvents: async (): Promise<ApiResponse<Event[]>> => {
    return apiClient.get<Event[]>('/events');
  },

  saveEvent: async (eventId: string): Promise<ApiResponse<{ saved: boolean }>> => {
    return apiClient.post<{ saved: boolean }>(`/events/${eventId}/save`);
  },

  unsaveEvent: async (eventId: string): Promise<ApiResponse<{ saved: boolean }>> => {
    return apiClient.delete<{ saved: boolean }>(`/events/${eventId}/save`);
  },

  registerForEvent: async (eventId: string): Promise<ApiResponse<{ registered: boolean }>> => {
    return apiClient.post<{ registered: boolean }>(`/events/${eventId}/register`);
  },

  unregisterFromEvent: async (eventId: string): Promise<ApiResponse<{ registered: boolean }>> => {
    return apiClient.post<{ registered: boolean }>(`/events/${eventId}/unregister`);
  },

  getProblemStatements: async (eventId: string): Promise<ApiResponse<ProblemStatement[]>> => {
    return apiClient.get<ProblemStatement[]>(`/events/${eventId}/problems`);
  },

  getProblemStatementById: async (eventId: string, problemId: string): Promise<ApiResponse<ProblemStatement>> => {
    return apiClient.get<ProblemStatement>(`/events/${eventId}/problems/${problemId}`);
  },

  createEvent: async (data: Partial<Event>): Promise<ApiResponse<Event>> => {
    return apiClient.post<Event>('/events', data);
  },

  deleteEvent: async (eventId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.delete<{ message: string }>(`/events/${eventId}`);
  },

  getRecommendedEvents: async (): Promise<ApiResponse<Event[]>> => {
    return apiClient.get<Event[]>('/events', { limit: 4 });
  },
};
