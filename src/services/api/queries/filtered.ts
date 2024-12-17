import type { VapiClient } from '@vapi-ai/server-sdk';
import { logger } from '../../../utils/logger';

interface FilterParams {
  startDate?: string;
  endDate?: string;
  signal?: AbortSignal;
  onProgress?: (progress: number, stats?: {
    totalCalls: number;
    batchCount: number;
    batchSize: number;
  }) => void;
}

export async function fetchFilteredData(
  client: VapiClient,
  options: FilterParams
) {
  const { startDate, endDate, signal, onProgress } = options;
  const allCalls: any[] = [];
  let hasMore = true;
  let cursor: string | undefined;
  let batchCount = 0;
  const batchSize = 1000; // Maximum allowed by API

  try {
    logger.info('Starting filtered data fetch', { 
      startDate, 
      endDate,
      currentTime: new Date().toISOString()
    });

    // Keep fetching while there are more results and not aborted
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

      if (signal?.aborted) break;

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

      // Check if we have more results
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

    // Fetch other data in parallel
    const [assistants, analytics] = await Promise.all([
      client.assistants.list(),
      client.analytics.get({
        queries: [{
          table: 'call',
          name: 'Call Metrics',
          timeRange: startDate && endDate ? {
            start: startDate,
            end: endDate
          } : undefined,
          operations: [
            { operation: 'count', column: 'id' },
            { operation: 'sum', column: 'cost' },
            { operation: 'sum', column: 'costBreakdown.llm' },
            { operation: 'sum', column: 'costBreakdown.stt' },
            { operation: 'sum', column: 'costBreakdown.tts' },
            { operation: 'avg', column: 'duration' }
          ]
        }]
      })
    ]);

    logger.info('Filtered data fetch completed', {
      totalCalls: sortedCalls.length,
      totalBatches: batchCount,
      dateRange: { startDate, endDate }
    });

    return {
      calls: sortedCalls,
      assistants,
      analytics
    };
  } catch (error) {
    if (signal?.aborted) {
      logger.info('Data fetch aborted');
      return { calls: [], assistants: [], analytics: [] };
    }
    logger.error('Error fetching filtered data:', { error });
    throw error;
  }
}