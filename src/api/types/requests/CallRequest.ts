import type { CallType } from '../../Types';

export interface CallCreateRequest {
  /** Call type */
  type: CallType;
  
  /** Assistant ID to use */
  assistantId: string;
  
  /** Call name */
  name?: string;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

export interface CallUpdateRequest {
  /** Call ID to update */
  id: string;
  
  /** New call name */
  name?: string;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

export interface CallListRequest {
  /** Filter by assistant ID */
  assistantId?: string;
  
  /** Filter by status */
  status?: string[];
  
  /** Filter by type */
  type?: CallType[];
  
  /** Filter by creation date after */
  createdAfter?: string;
  
  /** Filter by creation date before */
  createdBefore?: string;
  
  /** Number of results per page */
  limit?: number;
  
  /** Page number */
  page?: number;
}