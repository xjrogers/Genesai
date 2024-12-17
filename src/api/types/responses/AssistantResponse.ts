import type { Assistant } from '../Assistant';
import type { PaginatedResponse } from '../utils/pagination';

export type AssistantListResponse = PaginatedResponse<Assistant>;

export interface AssistantCreateResponse extends Assistant {
  /** Any additional metadata returned on creation */
  metadata?: Record<string, unknown>;
}

export type AssistantGetResponse = Assistant;

export type AssistantUpdateResponse = Assistant;

export type AssistantDeleteResponse = {
  /** ID of the deleted assistant */
  id: string;
  
  /** Whether deletion was successful */
  success: boolean;
};