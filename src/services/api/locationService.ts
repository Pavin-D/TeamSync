import { apiClient } from './client';
import { ApiResponse, QueryParams } from '@/types/api';
import { Team } from './teamService';

export type PermissionState = 'NOT_CONFIGURED' | 'REQUESTED' | 'GRANTED' | 'DENIED' | 'UNAVAILABLE' | 'OUTDATED' | 'DISABLED';
export type PrivacyVisibility = 'APPROXIMATE_AREA' | 'CITY_ONLY' | 'HIDDEN';

export interface LocationPreferences {
  isLocationSharingEnabled?: boolean;
  permissionState?: PermissionState;
  visibility?: PrivacyVisibility;
  city?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  approximateLat?: number;
  approximateLng?: number;
  lastUpdatedAt?: string;
  locationUpdatedAt?: string;
  staleAfterDays?: number;
  availableForTeamFormation?: boolean;
  availableAsMentor?: boolean;
  showLocationForDiscovery?: boolean;
}

export interface NearbyPerson {
  id: string;
  userId?: string;
  name: string;
  avatarUrl?: string;
  role: string;
  college?: string;
  department?: string;
  userType?: 'STUDENT' | 'PROFESSIONAL';
  skills: string[];
  distanceKm: number;
  city?: string;
  approximateArea?: string;
  approximateLat?: number;
  approximateLng?: number;
  compatibilityScore?: number;
  lookingForRole?: string;
  openToMentorship?: boolean;
  availableForTeamFormation?: boolean;
  availableAsMentor?: boolean;
}

export interface NearbyTeamItem {
  team: Team;
  distanceKm: number;
  approximateArea?: string;
  approximateLat?: number;
  approximateLng?: number;
}

export interface LocationSearchParams extends QueryParams {
  radius?: number;
  radiusKm?: number;
  city?: string;
  lat?: number;
  lng?: number;
  userType?: 'ALL' | 'STUDENT' | 'PROFESSIONAL';
  type?: 'student' | 'professional' | 'mentor' | 'all';
  role?: string;
  skill?: string;
  eventId?: string;
  problemId?: string;
  minMatchScore?: number;
  sortBy?: 'DISTANCE' | 'MATCH' | 'COMPLEMENTARITY' | 'NEWEST';
}

export const locationService = {
  getMyLocationPreferences: async (): Promise<ApiResponse<LocationPreferences>> => {
    return apiClient.get<LocationPreferences>('/users/me/location');
  },

  updateLocationPreferences: async (data: Partial<LocationPreferences>): Promise<ApiResponse<LocationPreferences>> => {
    return apiClient.patch<LocationPreferences>('/users/me/location', data);
  },

  updateManualLocation: async (city: string, area: string, latitude?: number, longitude?: number): Promise<ApiResponse<LocationPreferences>> => {
    return apiClient.patch<LocationPreferences>('/users/me/location', { city, area, latitude, longitude });
  },

  searchNearbyPeople: async (params?: LocationSearchParams): Promise<ApiResponse<NearbyPerson[]>> => {
    const radius = params?.radiusKm || params?.radius || 10;
    const type = params?.type || (params?.userType === 'PROFESSIONAL' ? 'professional' : params?.userType === 'STUDENT' ? 'student' : 'all');
    const res = await apiClient.get<NearbyPerson[]>('/discovery/nearby', { ...params, radius, type });
    if (res.success && res.data) {
      // Mock all users' locations to Kongu Engineering College as requested
      res.data = res.data.map(person => ({
        ...person,
        city: 'Perundurai, Erode',
        approximateArea: 'Kongu Engineering College, IT Park',
        approximateLat: 11.274,
        approximateLng: 77.607,
      }));
    }
    return res;
  },

  searchNearbyTeams: async (params?: LocationSearchParams): Promise<ApiResponse<NearbyTeamItem[]>> => {
    const radius = params?.radiusKm || params?.radius || 10;
    const res = await apiClient.get<NearbyTeamItem[]>('/discovery/nearby', { ...params, radius });
    if (res.success && res.data) {
      // Mock all teams' locations to Kongu Engineering College as requested
      res.data = res.data.map(teamItem => ({
        ...teamItem,
        approximateArea: 'Kongu Engineering College, IT Park',
        approximateLat: 11.274,
        approximateLng: 77.607,
      }));
    }
    return res;
  },
};
