import type { 
  AssistantTranscriber,
  AssistantModel,
  AssistantVoice,
  AssistantFirstMessageMode
} from '../../Types';

export interface AssistantCreateRequest {
  /** Assistant name */
  name?: string;
  
  /** Transcriber configuration */
  transcriber?: AssistantTranscriber;
  
  /** Model configuration */
  model?: AssistantModel;
  
  /** Voice configuration */
  voice?: AssistantVoice;
  
  /** First message mode */
  firstMessageMode?: AssistantFirstMessageMode;
  
  /** Enable HIPAA compliance */
  hipaaEnabled?: boolean;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

export interface AssistantUpdateRequest extends Partial<AssistantCreateRequest> {
  /** Assistant ID to update */
  id: string;
}

export interface AssistantListRequest {
  /** Filter by creation date after */
  createdAfter?: string;
  
  /** Filter by creation date before */
  createdBefore?: string;
  
  /** Number of results per page */
  limit?: number;
  
  /** Page number */
  page?: number;
}