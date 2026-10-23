import { apiClient } from './client';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/auth';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface StudentRegistrationPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  mobile?: string;
  college: string;
  department: string;
  course?: string;
  yearOfStudy?: number | string;
  githubUrl?: string;
  linkedInUrl?: string;
  skills?: string[];
  locationAllowed?: boolean;
}

export interface ProfessionalRegistrationPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  mobile?: string;
  jobTitle: string;
  company: string;
  yearsOfExperience?: number;
  githubUrl?: string;
  linkedInUrl?: string;
  skills?: string[];
  employeeIdDocument?: string;
  employeeIdCardFile?: File | null;
  locationAllowed?: boolean;
}

export interface CollegeRegistrationPayload {
  institutionName: string;
  officialEmail: string;
  password: string;
  institutionType: string;
  website?: string;
  city: string;
  state: string;
  country: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export const authService = {
  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post<AuthResponseData>('/auth/login', payload);
  },

  registerStudent: async (payload: StudentRegistrationPayload): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post<AuthResponseData>('/auth/register/student', payload);
  },

  registerProfessional: async (payload: ProfessionalRegistrationPayload): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post<AuthResponseData>('/auth/register/professional', payload);
  },

  registerCollege: async (payload: CollegeRegistrationPayload): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post<AuthResponseData>('/auth/register/college', payload);
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>('/auth/reset-password', { token, newPassword });
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/auth/me');
  },

  refreshSession: async (): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.get<AuthResponseData>('/auth/me');
  },

  logout: async (): Promise<ApiResponse<{ success: boolean }>> => {
    return apiClient.post<{ success: boolean }>('/auth/logout');
  },
};
