import type { WebhookConfig } from './types';

export const WEBHOOK_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  MAX_PAYLOAD_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

export const DEFAULT_WEBHOOK_CONFIG: WebhookConfig = {
  timeoutMs: WEBHOOK_CONFIG.DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
};