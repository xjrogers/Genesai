/**
 * Pagination response metadata
 */
export interface PaginationMeta {
  /** Number of items per page */
  itemsPerPage: number;
  
  /** Total number of items */
  totalItems: number;
  
  /** Current page number */
  currentPage: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** List of items in the current page */
  results: T[];
  
  /** Pagination metadata */
  metadata: PaginationMeta;
}

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
  /** Page number (1-based) */
  page?: number;
  
  /** Number of items per page */
  limit?: number;
  
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  
  /** Sort field */
  sortBy?: string;
}