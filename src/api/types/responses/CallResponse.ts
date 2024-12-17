import type { Call } from '../Call';
import type { PaginatedResponse } from '../utils/pagination';

export type CallListResponse = PaginatedResponse<Call>;

export interface CallCreateResponse extends Call {
  /** Any additional metadata returned on creation */
  metadata?: Record<string, unknown>;
}

export type CallGetResponse = Call;

export type CallUpdateResponse = Call;

export type CallDeleteResponse = {
  /** ID of the deleted call */
  id: string;
  
  /** Whether deletion was successful */
  success: boolean;
};