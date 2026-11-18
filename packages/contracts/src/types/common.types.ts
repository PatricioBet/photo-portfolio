/**
 * Standard API error response.
 */
export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  traceId?: string;
  timestamp?: string;
}

/**
 * Standard API success response wrapper.
 */
export interface SuccessResponse<T = unknown> {
  data: T;
}

/**
 * Pagination metadata.
 */
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
