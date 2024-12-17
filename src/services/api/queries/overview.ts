// src/services/api/queries/overview.ts
import type { VapiClient } from '@vapi-ai/server-sdk';
import { fetchFilteredData } from './filtered';
import { logger } from '../../../utils/logger';

export async function fetchOverviewData(
  client: VapiClient,
  startDate?: string,
  endDate?: string
) {
  try {
    return await fetchFilteredData(client, {
      startDate: startDate || '',
      endDate: endDate || ''
    });
  } catch (error) {
    logger.error('Failed to fetch overview data:', { error });
    throw error;
  }
}
