import type { WebhookMessage, WebhookConfig, WebhookResponse } from './types';
import { DEFAULT_WEBHOOK_CONFIG, WEBHOOK_CONFIG } from './config';
import { withRetry } from '../utils/retry';
import { logger } from '../utils/logger';

export class WebhookClient {
  private config: WebhookConfig;

  constructor(config: Partial<WebhookConfig>) {
    this.config = {
      ...DEFAULT_WEBHOOK_CONFIG,
      ...config
    };
  }

  async send(message: WebhookMessage): Promise<WebhookResponse> {
    try {
      return await withRetry(
        async () => {
          const response = await fetch(this.config.url, {
            method: 'POST',
            headers: {
              ...this.config.headers,
              ...(this.config.secret && {
                'x-vapi-secret': this.config.secret
              })
            },
            body: JSON.stringify(message),
            signal: AbortSignal.timeout(this.config.timeoutMs ?? WEBHOOK_CONFIG.DEFAULT_TIMEOUT)
          });

          if (!response.ok) {
            throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
          }

          return {
            success: true,
            data: await response.json()
          };
        },
        {
          maxRetries: WEBHOOK_CONFIG.MAX_RETRIES,
          initialDelayMs: WEBHOOK_CONFIG.RETRY_DELAY
        }
      );
    } catch (error) {
      logger.error('Webhook request failed', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook request failed'
      };
    }
  }
}