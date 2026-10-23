export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    totalCount?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}
