import { apiClient } from './client';
import { ApiResponse, QueryParams } from '@/types/api';

export type SearchEntityType = 'STUDENT' | 'PROFESSIONAL' | 'TEAM' | 'EVENT' | 'INSTITUTION' | 'MENTOR';

export interface SearchResultItem {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  targetUrl: string;
  skills?: string[];
  metadata?: string;
}

export interface SearchGroupedResults {
  students: SearchResultItem[];
  professionals: SearchResultItem[];
  teams: SearchResultItem[];
  events: SearchResultItem[];
  institutions: SearchResultItem[];
  mentors: SearchResultItem[];
  totalMatches: number;
}

export interface SearchQueryParams extends QueryParams {
  q: string;
  types?: string[];
}

export const searchService = {
  globalSearch: async (query: string, types?: SearchEntityType[]): Promise<ApiResponse<SearchGroupedResults>> => {
    return apiClient.get<SearchGroupedResults>('/search', {
      q: query,
      types: types ? types.join(',') : undefined,
    });
  },

  searchPeople: async (params?: Record<string, any>): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/search/people', params);
  },
};
