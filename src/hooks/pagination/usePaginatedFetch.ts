// src/hooks/pagination/usePaginatedFetch.ts
import { useState, useCallback } from 'react';
import { fetchAllPages } from '../../utils/pagination/paginationUtils';
import { logger } from '../../utils/logger';

interface UsePaginatedFetchOptions<T> {
  fetchPage: (params: { limit: number; cursor?: string }) => Promise<T[]>;
  batchSize?: number;
  maxItems?: number;
}

export function usePaginatedFetch<T>({ 
  fetchPage, 
  batchSize = 1000,
  maxItems 
}: UsePaginatedFetchOptions<T>) {
  const [progress, setProgress] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const fetch = useCallback(async () => {
    if (isFetching) return [];

    try {
      setIsFetching(true);
      setProgress(0);

      const items = await fetchAllPages<T>(fetchPage, {
        batchSize,
        maxItems,
        onProgress: setProgress
      });

      logger.info('Pagination complete', { 
        totalItems: items.length 
      });

      return items;
    } catch (error) {
      logger.error('Pagination failed:', { error });
      throw error;
    } finally {
      setIsFetching(false);
      setProgress(0);
    }
  }, [fetchPage, batchSize, maxItems]);

  return {
    fetch,
    progress,
    isFetching
  };
}
