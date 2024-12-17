import type { VapiClient } from '@vapi-ai/server-sdk';
import type { Assistant } from '../../../types';
import { SYNC_CONFIG } from '../../../config/sync';
import { logger } from '../../../utils/logger';

export async function fetchAssistants(client: VapiClient): Promise<Assistant[]> {
  try {
    return await client.assistants.list({
      limit: SYNC_CONFIG.BATCH_SIZE.ASSISTANTS
    });
  } catch (error) {
    logger.error('Failed to fetch assistants:', { error });
    throw error;
  }
}