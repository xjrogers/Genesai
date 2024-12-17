import { VapiClient } from '@vapi-ai/server-sdk';
import { logger } from '../../utils/logger';
import { withRetry } from '../../utils/retry';
import { API_CONFIG } from '../../config/api';

export class ClientService {
  private static instance: ClientService | null = null;
  private client: VapiClient | null = null;
  private initializationPromise: Promise<VapiClient> | null = null;

  private constructor() {}

  static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  async initialize(privateApiKey: string): Promise<VapiClient> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        logger.info('Starting client initialization');
        
        if (!privateApiKey?.trim()) {
          throw new Error(API_CONFIG.errorMessages.INVALID_CREDENTIALS);
        }

        // Create new client instance
        this.client = new VapiClient({
          token: privateApiKey
        });

        // Test connection with retry
        const isValid = await withRetry(
          async () => {
            try {
              await this.client!.calls.list({ limit: 1 });
              return true;
            } catch {
              return false;
            }
          },
          {
            maxRetries: API_CONFIG.retries.max,
            initialDelayMs: API_CONFIG.retries.initialDelay,
            maxDelayMs: API_CONFIG.retries.maxDelay
          }
        );

        if (!isValid) {
          throw new Error(API_CONFIG.errorMessages.INITIALIZATION_FAILED);
        }

        logger.info('Client initialization completed successfully');
        return this.client;

      } catch (error) {
        const message = error instanceof Error ? error.message : API_CONFIG.errorMessages.INITIALIZATION_FAILED;
        logger.error('Client initialization failed:', { error: message });
        this.reset();
        throw error;
      } finally {
        this.initializationPromise = null;
      }
    })();

    return this.initializationPromise;
  }

  getClient(): VapiClient {
    if (!this.client) {
      logger.error('Client accessed before initialization');
      throw new Error(API_CONFIG.errorMessages.CLIENT_NOT_INITIALIZED);
    }
    return this.client;
  }

  reset(): void {
    this.client = null;
    this.initializationPromise = null;
    logger.info('Client reset completed');
  }
}