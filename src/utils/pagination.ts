// src/utils/pagination.ts
import type { Call } from '../types';
import { logger } from './logger';

export interface PaginatedResponse<T> {
  data: T[];
  cursor?: string;
  hasMore: boolean;
}

export async function fetchPaginatedData<T>(
  fetchFn: (params: { limit: number; cursor?: string }) => Promise<T[]>,
  options: {
    limit?: number;
    maxItems?: number;
  } = {}
): Promise<T[]> {
  const { limit = 1000, maxItems = Infinity } = options;
  const allItems: T[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  try {
    while (hasMore && allItems.length < maxItems) {
      const batchSize = Math.min(limit, maxItems - allItems.length);
      const items = await fetchFn({ limit: batchSize, cursor });
      
      if (items.length === 0) {
        hasMore = false;
        break;
      }

      allItems.push(...items);
      
      // Get cursor from last item
      const lastItem = items[items.length - 1] as any;
      cursor = lastItem?.id;
      hasMore = items.length === batchSize;

      logger.info('Fetched data batch', {
        batchSize,
        itemsReceived: items.length,
        totalItems: allItems.length,
        hasMore
      });
    }

    return allItems;
  } catch (error) {
    logger.error('Error fetching paginated data:', { error });
    throw error;
  }
}
