import { apiClient } from './client';
import { ApiResponse } from '@/types/api';

export type GitHubAnalysisState =
  | 'NOT_CONNECTED'
  | 'CONNECTED'
  | 'ANALYSIS_PENDING'
  | 'ANALYZING'
  | 'COMPLETED'
  | 'FAILED'
  | 'OUTDATED';

export interface GitHubRepository {
  id: string | number;
  name: string;
  fullName?: string;
  description: string | null;
  primaryLanguage?: string | null;
  language?: string | null;
  technologies?: string[];
  stars: number;
  forks: number;
  lastUpdated?: string;
  updatedAt?: string;
  detectedSkills?: string[];
  url: string;
  githubUrl?: string;
  linesOfCode?: number;
}

export interface GitHubProfile {
  username: string;
  name?: string;
  avatarUrl?: string;
  bio?: string | null;
  publicReposCount?: number;
  publicRepositories?: number;
  followersCount?: number;
  followers?: number;
  followingCount?: number;
  following?: number;
  totalContributionsThisYear?: number;
  accountCreatedYear?: string;
  profileUrl?: string;
  htmlUrl?: string;
  analysisState?: GitHubAnalysisState;
  lastAnalyzedAt?: string;
}

export interface GitHubAnalysisResult {
  status: string;
  username: string;
  profile: GitHubProfile;
  analyzedRepositories: number;
  skills: {
    name: string;
    category: string;
    confidence: number;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    evidenceCount: number;
  }[];
  analyzedAt: string;
}

export const githubService = {
  getGitHubProfile: async (): Promise<ApiResponse<GitHubProfile>> => {
    return apiClient.get<GitHubProfile>('/github/profile');
  },

  connectGitHub: async (githubUrl: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.patch<{ message: string }>('/students/me', { githubUrl });
  },

  startGitHubAnalysis: async (): Promise<ApiResponse<GitHubAnalysisResult>> => {
    return apiClient.post<GitHubAnalysisResult>('/github/analyze');
  },

  getGitHubAnalysisStatus: async (): Promise<ApiResponse<{ status: GitHubAnalysisState; progressPercentage: number }>> => {
    return apiClient.get<{ status: GitHubAnalysisState; progressPercentage: number }>('/github/profile');
  },

  getGitHubSkillAnalysis: async (): Promise<ApiResponse<GitHubAnalysisResult>> => {
    return apiClient.post<GitHubAnalysisResult>('/github/analyze');
  },

  getRepositories: async (): Promise<ApiResponse<GitHubRepository[]>> => {
    return apiClient.get<GitHubRepository[]>('/github/repositories');
  },

  getRepositoryById: async (repoId: string): Promise<ApiResponse<GitHubRepository>> => {
    return apiClient.get<GitHubRepository>(`/github/repositories/${repoId}`);
  },
};
