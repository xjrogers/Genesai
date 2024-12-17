import { logger } from '../logger';
import type { VapiClient } from '@vapi-ai/server-sdk';
import type { Call } from '../../types';

interface FetchOptions {
  startDate?: string;
  endDate?: string;
  onProgress?: (progress: number, stats: { 
    totalCalls: number;
    batchCount: number;
    batchSize: number;
  }) => void;
  signal?: AbortSignal;
}

export async function fetchAllCalls(
  client: VapiClient,
  options: FetchOptions = {}
): Promise<Call[]> {
  const { startDate, endDate, onProgress, signal } = options;
  const allCalls: Call[] = [];
  let hasMore = true;
  let cursor: string | undefined;
  let batchCount = 0;
  const batchSize = 1000; // Maximum allowed by API

  try {
    logger.info('Starting calls fetch', { 
      startDate, 
      endDate,
      currentTime: new Date().toISOString()
    });

    while (hasMore && !signal?.aborted) {
      batchCount++;
      const params = {
        limit: batchSize,
        cursor,
        ...(startDate && { createdAtGe: startDate }),
        ...(endDate && { createdAtLe: endDate })
      };

      logger.debug('Fetching calls batch', { 
        batchCount,
        params,
        totalSoFar: allCalls.length 
      });

      const batch = await client.calls.list(params);

      if (signal?.aborted) {
        throw new Error('Fetch aborted');
      }

      if (!Array.isArray(batch)) {
        throw new Error('Invalid API response format');
      }

      allCalls.push(...batch);

      if (onProgress) {
        onProgress(
          batch.length < batchSize ? 100 : Math.min((allCalls.length / (allCalls.length + batchSize)) * 100, 99),
          {
            totalCalls: allCalls.length,
            batchCount,
            batchSize: batch.length
          }
        );
      }

      hasMore = batch.length === batchSize;
      if (hasMore && batch.length > 0) {
        cursor = batch[batch.length - 1].id;
      }

      logger.debug('Processed batch', {
        batchCount,
        batchSize: batch.length,
        totalCalls: allCalls.length,
        hasMore,
        cursor
      });
    }

    // Sort calls by date descending
    const sortedCalls = allCalls.sort((a, b) => {
      const dateA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
      const dateB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
      return dateB - dateA;
    });

    logger.info('Completed fetching all calls', {
      totalCalls: sortedCalls.length,
      totalBatches: batchCount,
      dateRange: { startDate, endDate },
      firstCallDate: sortedCalls[0]?.startedAt,
      lastCallDate: sortedCalls[sortedCalls.length - 1]?.startedAt
    });

    return sortedCalls;
  } catch (error) {
    if (error instanceof Error && error.message === 'Fetch aborted') {
      logger.info('Call fetch aborted');
      return [];
    }
    logger.error('Error fetching calls:', { error });
    throw error;
  }
}