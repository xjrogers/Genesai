/**
 * Base error interface
 */
export interface ApiError {
  /** Error message */
  message: string;
  
  /** HTTP status code */
  statusCode?: number;
  
  /** Error code */
  code?: string;
  
  /** Additional error details */
  details?: Record<string, unknown>;
}

/**
 * Validation error details
 */
export interface ValidationError extends ApiError {
  /** Validation error fields */
  fields: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Rate limit error details
 */
export interface RateLimitError extends ApiError {
  /** When rate limit will reset */
  resetAt: string;
  
  /** Rate limit remaining */
  remaining: number;
  
  /** Rate limit total */
  limit: number;
}