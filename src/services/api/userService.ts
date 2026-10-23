import { apiClient } from './client';
import { ApiResponse, QueryParams } from '@/types/api';
import { User } from '@/types/auth';

export interface UserProfile extends User {
  bio?: string;
  skills?: string[];
  location?: string;
  githubUsername?: string;
  experienceYears?: number;
  availability?: 'AVAILABLE' | 'BUSY' | 'LOOKING_FOR_TEAM';
}

export const userService = {
  getUsers: async (params?: QueryParams): Promise<ApiResponse<UserProfile[]>> => {
    return apiClient.get<UserProfile[]>('/users', params);
  },
  getUserById: async (id: string): Promise<ApiResponse<UserProfile>> => {
    return apiClient.get<UserProfile>(`/users/${id}`);
  },
  updateProfile: async (data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
    return apiClient.patch<UserProfile>('/users/me', data);
  },
};
