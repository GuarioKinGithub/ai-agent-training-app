export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
};

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};