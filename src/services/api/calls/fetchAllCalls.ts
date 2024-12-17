import type { VapiClient } from '@vapi-ai/server-sdk';
import type { Call } from '../../../types';
import { logger } from '../../../utils/logger';
import { SYNC_CONFIG } from '../../../config/sync';

interface FetchOptions {
  startDate: string;
  endDate: string;
  signal?: AbortSignal;
  onProgress?: (progress: number, stats: {
    totalCalls: number;
    batchCount: number;
  }) => void;
}

export async function fetchAllCalls(
  client: VapiClient,
  { startDate, endDate, signal, onProgress }: FetchOptions
): Promise<Call[]> {
  const allCalls: Call[] = [];
  let hasMore = true;
  let cursor: string | undefined;
  let batchCount = 0;

  try {
    logger.info('Starting calls fetch', { 
      startDate, 
      endDate,
      timestamp: new Date().toISOString()
    });

    while (hasMore && !signal?.aborted) {
      batchCount++;
      
      const batch = await client.calls.list({
        limit: SYNC_CONFIG.BATCH_SIZE.CALLS,
        cursor,
        createdAtGe: startDate,
        createdAtLe: endDate
      });

      if (signal?.aborted) break;

      if (!Array.isArray(batch)) {
        throw new Error('Invalid API response');
      }

      allCalls.push(...batch);

      if (onProgress) {
        onProgress(
          batch.length < SYNC_CONFIG.BATCH_SIZE.CALLS ? 100 : 
            Math.min((allCalls.length / (allCalls.length + SYNC_CONFIG.BATCH_SIZE.CALLS)) * 100, 99),
          {
            totalCalls: allCalls.length,
            batchCount
          }
        );
      }

      hasMore = batch.length === SYNC_CONFIG.BATCH_SIZE.CALLS;
      if (hasMore && batch.length > 0) {
        cursor = batch[batch.length - 1].id;
      }

      logger.debug('Processed calls batch', {
        batchSize: batch.length,
        totalCalls: allCalls.length,
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

    logger.info('Calls fetch completed', {
      totalCalls: sortedCalls.length,
      batches: batchCount,
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