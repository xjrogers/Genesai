import { VapiClient } from '@vapi-ai/server-sdk';
import { logger } from '../../utils/logger';
import { API_CONFIG } from '../../config/api';
import type { Credentials } from '../../types/auth';

export class CredentialValidator {
  static async validate(credentials: Credentials): Promise<void> {
    try {
      logger.info('Starting credentials validation');
      
      // Validate required fields
      if (!credentials.privateApiKey?.trim()) {
        throw new Error('Private API key is required');
      }

      if (!credentials.assistantId?.trim()) {
        throw new Error('Assistant ID is required');
      }

      // Create temporary client for validation
      const client = new VapiClient({
        token: credentials.privateApiKey
      });

      // Test basic API connectivity first
      try {
        await client.calls.list({ limit: 1 });
        logger.info('API connectivity test successful');
      } catch (error: any) {
        logger.error('API connectivity test failed:', error);
        if (error?.statusCode === 401) {
          throw new Error('Invalid API key - please check your credentials');
        }
        throw new Error(API_CONFIG.errorMessages.API_ACCESS_DENIED);
      }

      // Validate assistant access
      try {
        await client.assistants.get(credentials.assistantId);
        logger.info('Assistant validation successful');
      } catch (error: any) {
        logger.error('Assistant validation failed:', error);
        if (error?.statusCode === 404) {
          throw new Error('Assistant not found - please check the Assistant ID');
        }
        throw new Error(API_CONFIG.errorMessages.ASSISTANT_NOT_FOUND);
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : API_CONFIG.errorMessages.VALIDATION_FAILED;
      logger.error('Credential validation failed:', { error: message });
      throw error;
    }
  }
}