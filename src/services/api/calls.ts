// src/services/api/calls.ts
import type { VapiClient } from '@vapi-ai/server-sdk';
import type { Call } from '../../types';
import { fetchAllPages } from '../../utils/pagination/paginationUtils';
import { logger } from '../../utils/logger';

interface FetchCallsOptions {
  startDate?: string;
  endDate?: string;
  onProgress?: (progress: number) => void;
}

export async function fetchFilteredCalls(
  client: VapiClient,
  options: FetchCallsOptions = {}
): Promise<Call[]> {
  try {
    const { startDate, endDate, onProgress } = options;

    const fetchPage = async ({ limit, cursor }: { limit: number; cursor?: string }) => {
      return client.calls.list({
        limit,
        cursor,
        ...(startDate && { createdAtGe: startDate }),
        ...(endDate && { createdAtLe: endDate })
      });
    };

    const calls = await fetchAllPages<Call>(fetchPage, {
      batchSize: 1000,
      onProgress
    });

    // Sort by date descending
    return calls.sort((a, b) => {
      const dateA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
      const dateB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
      return dateB - dateA;
    });

  } catch (error) {
    logger.error('Error fetching calls:', { error, options });
    throw error;
  }
}
