// src/hooks/data/useOverviewData.ts
import { useCallback, useRef } from 'react';
import { useVapi } from '../../contexts/vapi';
import { fetchFilteredData } from '../../services/api/queries/filtered';
import { logger } from '../../utils/logger';

export function useOverviewData() {
  const { client, setLoading, setError, setData } = useVapi();
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchRef = useRef<string>('');

  const fetchData = useCallback(async (startDate?: string, endDate?: string) => {
    if (!client) return;

    const cacheKey = `${startDate}-${endDate}`;
    if (cacheKey === lastFetchRef.current) {
      return;
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    lastFetchRef.current = cacheKey;

    try {
      setLoading(true);
      
      const data = await fetchFilteredData(client, {
        startDate,
        endDate
      });

      if (!abortControllerRef.current.signal.aborted) {
        setData(data.calls, data.assistants, data.analytics);
        setError(null);
        logger.info('Overview data fetched successfully');
      }
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        const message = err instanceof Error ? err.message : 'Failed to fetch data';
        logger.error('Failed to fetch overview data:', { error: message });
        setError(message);
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, [client, setData, setError, setLoading]);

  return { fetchData };
}
