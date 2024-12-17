import type { VapiClient } from '@vapi-ai/server-sdk';
import type { Call } from '../../../types';
import { logger } from '../../../utils/logger';

interface FetchCallsOptions {
  startDate?: string;
  endDate?: string;
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
}

export async function fetchCalls(
  client: VapiClient,
  options: FetchCallsOptions = {}
): Promise<Call[]> {
  const { startDate, endDate, signal, onProgress } = options;
  const allCalls: Call[] = [];
  let hasMore = true;
  let cursor: string | undefined;
  let totalProcessed = 0;

  try {
    logger.info('Starting calls fetch', { startDate, endDate });

    while (hasMore && !signal?.aborted) {
      const params = {
        limit: 1000, // Maximum allowed by API
        cursor,
        ...(startDate && { createdAtGe: startDate }),
        ...(endDate && { createdAtLe: endDate })
      };

      const batch = await client.calls.list(params);
      
      if (signal?.aborted) break;

      if (!Array.isArray(batch)) {
        throw new Error('Invalid API response format');
      }

      allCalls.push(...batch);
      totalProcessed += batch.length;

      if (onProgress) {
        const progress = batch.length < 1000 ? 100 : 
          Math.min((totalProcessed / (totalProcessed + 1000)) * 100, 99);
        onProgress(progress);
      }

      hasMore = batch.length === 1000;
      if (hasMore && batch.length > 0) {
        cursor = batch[batch.length - 1].id;
      }

      logger.debug('Processed calls batch', {
        batchSize: batch.length,
        totalProcessed,
        hasMore,
        cursor
      });
    }

    // Sort by date descending
    const sortedCalls = allCalls.sort((a, b) => {
      const dateA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
      const dateB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
      return dateB - dateA;
    });

    logger.info('Completed fetching all calls', {
      totalCalls: sortedCalls.length,
      dateRange: { startDate, endDate }
    });

    return sortedCalls;
  } catch (error) {
    if (signal?.aborted) {
      logger.info('Call fetch aborted');
      return [];
    }
    logger.error('Error fetching calls:', { error });
    throw error;
  }
}