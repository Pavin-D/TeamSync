import { apiClient } from './client';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/auth';

export interface SkillItem {
  name: string;
  levelPercentage: number;
  source: 'GitHub Activity' | 'Self Assessed' | 'Coursework';
}

export interface UpcomingEvent {
  id: string;
  name: string;
  organizer: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  isOnline: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  requiredSkills: string[];
  participantCount: number;
  status: 'UPCOMING' | 'REGISTRATION_OPEN' | 'CLOSING_SOON' | 'ONGOING' | 'COMPLETED';
}

export interface RecommendedTeammate {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  college: string;
  department: string;
  skills: string[];
  matchScore: number;
  distanceKm?: number;
  availability: 'AVAILABLE' | 'BUSY';
  hackathonsCount: number;
  explanation: {
    title: string;
    points: string[];
  };
}

export interface NearbyPerson {
  id: string;
  name: string;
  role: 'STUDENT' | 'PROFESSIONAL';
  skills: string[];
  distanceKm: number;
  approximateArea: string;
}

export interface MentorPreview {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  experienceYears: number;
  skills: string[];
  avatarUrl?: string;
  availableForMentorship: boolean;
  distanceKm?: number;
}

export interface MyTeamPreview {
  id: string;
  name: string;
  eventName: string;
  teamLeadName: string;
  memberCount: number;
  maxMembers: number;
  status: 'RECRUITING' | 'FULL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface JoinRequestItem {
  id: string;
  teamName: string;
  eventName: string;
  requestedDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
}

export interface TeamInvitationItem {
  id: string;
  teamName: string;
  invitedByName: string;
  eventName: string;
  invitedDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

export interface StudentRanking {
  collegeRank: number;
  globalRank: number;
  hackathonsParticipated: number;
  hackathonsWon: number;
}

export interface ParticipationItem {
  id: string;
  eventName: string;
  year: string;
  teamName: string;
  result: string;
}

export interface StudentProfileData extends User {
  bio: string;
  mobile: string;
  course: string;
  yearOfStudy: string;
  githubUrl?: string;
  githubConnected: boolean;
  githubLastAnalyzed?: string;
  linkedInUrl?: string;
  linkedInConnected: boolean;
  skills: string[];
  availability: {
    availableForTeams: boolean;
    academicProjects: boolean;
    hackathons: boolean;
    longTermProjects: boolean;
  };
  locationPref: {
    allowed: boolean;
    approximateCity?: string;
  };
  visibility: 'PUBLIC' | 'STUDENTS_ONLY' | 'COLLEGE_ONLY';
  profileCompletionPercentage: number;
  githubAnalytics?: {
    totalCommits: number;
    totalStars: number;
    totalForks: number;
    skills: { name: string; level: string; evidenceCount: number; category: string }[];
    topRepositories: { name: string; description: string; language: string; stars: number; totalCommits: number; recentCommits: any[] }[];
  };
}

export interface StudentDashboardData {
  welcomeName: string;
  activeTeamsCount: number;
  upcomingEventsCount: number;
  profileCompletionPercentage: number;
  skillMatchScore: number;
  githubAnalytics?: any;
  skills: SkillItem[];
  events: UpcomingEvent[];
  recommendedTeammates: RecommendedTeammate[];
  nearbyPeople: NearbyPerson[];
  mentors: MentorPreview[];
  myTeams: MyTeamPreview[];
  joinRequests: JoinRequestItem[];
  invitations: TeamInvitationItem[];
  ranking: StudentRanking;
  participation: ParticipationItem[];
}

export const studentService = {
  getStudentDashboard: async (): Promise<ApiResponse<StudentDashboardData>> => {
    return apiClient.get<StudentDashboardData>('/student/dashboard');
  },

  getStudentProfile: async (): Promise<ApiResponse<StudentProfileData>> => {
    return apiClient.get<StudentProfileData>('/students/me');
  },

  updateStudentProfile: async (data: Partial<StudentProfileData>): Promise<ApiResponse<StudentProfileData>> => {
    return apiClient.patch<StudentProfileData>('/students/me', data);
  },

  getProfileCompletion: async (): Promise<ApiResponse<{ percentage: number; missingFields: string[] }>> => {
    return apiClient.get<{ percentage: number; missingFields: string[] }>('/students/me');
  },

  getStudentSkillSummary: async (): Promise<ApiResponse<SkillItem[]>> => {
    return apiClient.get<SkillItem[]>('/users/me/skills');
  },

  getUpcomingEventsPreview: async (): Promise<ApiResponse<UpcomingEvent[]>> => {
    return apiClient.get<UpcomingEvent[]>('/events');
  },

  getRecommendedTeammates: async (): Promise<ApiResponse<RecommendedTeammate[]>> => {
    return apiClient.get<RecommendedTeammate[]>('/recommendations');
  },

  getNearbyPeople: async (): Promise<ApiResponse<NearbyPerson[]>> => {
    return apiClient.get<NearbyPerson[]>('/nearby');
  },

  getMentorPreview: async (): Promise<ApiResponse<MentorPreview[]>> => {
    return apiClient.get<MentorPreview[]>('/mentors');
  },

  getMyTeamsPreview: async (): Promise<ApiResponse<MyTeamPreview[]>> => {
    return apiClient.get<MyTeamPreview[]>('/teams');
  },

  getJoinRequestsPreview: async (): Promise<ApiResponse<JoinRequestItem[]>> => {
    return apiClient.get<JoinRequestItem[]>('/teams/requests');
  },

  getTeamInvitationsPreview: async (): Promise<ApiResponse<TeamInvitationItem[]>> => {
    return apiClient.get<TeamInvitationItem[]>('/teams/invitations');
  },

  getStudentRanking: async (): Promise<ApiResponse<StudentRanking>> => {
    return apiClient.get<StudentRanking>('/rankings/students');
  },

  getParticipationPreview: async (): Promise<ApiResponse<ParticipationItem[]>> => {
    return apiClient.get<ParticipationItem[]>('/participation');
  },
};
