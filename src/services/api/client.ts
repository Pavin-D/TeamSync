import { ApiResponse, ApiError } from '@/types/api';

const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:5000/api`;
    }
  }
  return envUrl || 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseUrl();

export class ApiClientError extends Error implements ApiError {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(statusCode: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMessage = data?.message || data?.error?.message || `HTTP Error ${response.status}: ${response.statusText}`;
      throw new ApiClientError(response.status, errorMessage, data?.errors);
    }

    return data as ApiResponse<T>;
  }

    private formatUrl(endpoint: string): string {
      const cleanBase = this.baseUrl.replace(/\/+$/, '');
      let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

      if (cleanBase.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
        cleanEndpoint = cleanEndpoint.replace(/^\/api/, '');
      }

      return `${cleanBase}${cleanEndpoint}`;
    }

  public async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const fullUrl = this.formatUrl(endpoint);
    const url = new URL(fullUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    return this.handleResponse<T>(response);
  }

  public async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const fullUrl = this.formatUrl(endpoint);
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  public async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const fullUrl = this.formatUrl(endpoint);
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  public async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const fullUrl = this.formatUrl(endpoint);
    const response = await fetch(fullUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const fullUrl = this.formatUrl(endpoint);
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
