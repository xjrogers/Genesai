import { useCallback, useRef } from 'react';
import { useVapi } from '../../contexts/vapi';
import { fetchAllCalls } from '../../utils/pagination/vapiPagination';
import { logger } from '../../utils/logger';

export function useDataFetching() {
  const { client, setLoading, setError, setData } = useVapi();
  const abortControllerRef = useRef<AbortController>();

  const fetchData = useCallback(async (startDate?: string, endDate?: string) => {
    if (!client) {
      logger.warn('Client not initialized');
      return;
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      
      logger.info('Starting data fetch', { startDate, endDate });

      // Fetch all data in parallel
      const [calls, assistants, analytics] = await Promise.all([
        fetchAllCalls(client, {
          startDate,
          endDate,
          signal: abortControllerRef.current.signal,
          onProgress: (progress) => logger.debug('Call fetch progress:', { progress })
        }),
        client.assistants.list(),
        client.analytics.get({
          queries: [{
            table: 'call',
            name: 'Call Metrics',
            timeRange: startDate && endDate ? { start: startDate, end: endDate } : undefined,
            operations: [
              { operation: 'count', column: 'id' },
              { operation: 'sum', column: 'cost' },
              { operation: 'avg', column: 'duration' }
            ]
          }]
        })
      ]);

      if (!abortControllerRef.current.signal.aborted) {
        setData(calls, assistants, analytics);
        setError(null);
        
        logger.info('Data fetch completed', {
          callsCount: calls.length,
          dateRange: { startDate, endDate }
        });
      }
    } catch (err) {
      if (!abortControllerRef.current?.signal.aborted) {
        const message = err instanceof Error ? err.message : 'Failed to fetch data';
        logger.error('Data fetch failed:', { error: message });
        setError(message);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, [client, setData, setError, setLoading]);

  return { fetchData };
}