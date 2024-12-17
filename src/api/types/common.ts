/** Base interface for entities with common fields */
export interface BaseEntity {
  /** Unique identifier */
  id: string;
  
  /** Organization ID */
  orgId: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
}

/** Common pagination parameters */
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

/** Time range for queries */
export interface TimeRange {
  start?: string;
  end?: string;
  timezone?: string;
}