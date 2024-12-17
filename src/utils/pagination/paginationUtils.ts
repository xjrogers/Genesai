// src/utils/pagination/paginationUtils.ts
import { accumulateData } from './dataAccumulator';
import type { PaginationConfig } from './types';
import { logger } from '../logger';

export async function fetchAllPages<T>(
  fetchPage: (params: { limit: number; cursor?: string }) => Promise<T[]>,
  config: PaginationConfig = {}
): Promise<T[]> {
  const {
    batchSize = 1000,
    onProgress,
    maxItems
  } = config;

  try {
    return await accumulateData<T>(
      fetchPage,
      batchSize,
      onProgress,
      maxItems
    );
  } catch (error) {
    logger.error('Error in pagination:', { error });
    throw error;
  }
}
