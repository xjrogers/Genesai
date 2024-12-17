// src/utils/pagination/dataAccumulator.ts
import type { BatchInfo } from './types';
import { handleBatchProgress } from './batchProcessor';
import { getNextCursor, shouldContinueFetching } from './cursorUtils';
import { logger } from '../logger';

export async function accumulateData<T>(
  fetchPage: (params: { limit: number; cursor?: string }) => Promise<T[]>,
  batchSize: number = 1000,
  onProgress?: (progress: number) => void,
  maxItems: number = Infinity
): Promise<T[]> {
  const allItems: T[] = [];
  let cursor: string | undefined;
  let batchNumber = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      batchNumber++;
      const batch = await fetchPage({ limit: batchSize, cursor });

      if (!batch.length) break;

      allItems.push(...batch);
      
      const batchInfo: BatchInfo = {
        batchNumber,
        totalFetched: allItems.length,
        hasMore: shouldContinueFetching(batch, batchSize, allItems.length, maxItems)
      };

      handleBatchProgress(batchInfo, onProgress);
      
      cursor = getNextCursor(batch);
      hasMore = batchInfo.hasMore;
    }

    logger.info('Data accumulation complete', {
      totalItems: allItems.length,
      batches: batchNumber
    });

    return allItems;
  } catch (error) {
    logger.error('Error accumulating data:', { error });
    throw error;
  }
}
