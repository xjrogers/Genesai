import type { Call, Assistant, Analysis } from '../types';

export type WebhookMessageType = 
  | 'conversation-update'
  | 'end-of-call-report'
  | 'function-call'
  | 'hang'
  | 'speech-update'
  | 'status-update'
  | 'tool-calls'
  | 'transfer-destination-request' 
  | 'user-interrupted';

export interface WebhookMessage {
  type: WebhookMessageType;
  timestamp: string;
  call?: Call;
  assistant?: Assistant;
  analysis?: Analysis;
  [key: string]: unknown;
}

export interface WebhookConfig {
  url: string;
  secret?: string;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export interface WebhookResponse {
  success: boolean;
  error?: string;
  data?: unknown;
}