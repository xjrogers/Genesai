// src/utils/pagination/batchProcessor.ts
import { logger } from '../logger';
import type { BatchInfo } from './types';

export function handleBatchProgress(
  batchInfo: BatchInfo,
  onProgress?: (progress: number) => void
) {
  const { batchNumber, totalFetched, hasMore } = batchInfo;

  logger.info(`Processing batch ${batchNumber}`, {
    totalFetched,
    hasMore
  });

  if (onProgress) {
    // Estimate progress, cap at 99% until complete
    const progress = hasMore ? Math.min((totalFetched / (batchNumber * 1000)) * 100, 99) : 100;
    onProgress(progress);
  }
}
