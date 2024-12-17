import { useCallback, useRef } from 'react';
import { useVapi } from '../../contexts/vapi';
import { fetchAllCalls } from '../../services/api/calls/fetchAllCalls';
import { fetchAnalytics } from '../../services/api/queries/analytics';
import { fetchAssistants } from '../../services/api/queries/assistants';
import { logger } from '../../utils/logger';

export function useFilteredData() {
  const { client, setLoading, setError, setData } = useVapi();
  const abortControllerRef = useRef<AbortController>();
  const lastFetchRef = useRef<string>('');

  const fetchData = useCallback(async (startDate: string, endDate: string) => {
    if (!client) return;

    const cacheKey = `${startDate}-${endDate}`;
    if (cacheKey === lastFetchRef.current) return;
    
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    lastFetchRef.current = cacheKey;

    try {
      setLoading(true);

      const [calls, assistants, analytics] = await Promise.all([
        fetchAllCalls(client, { 
          startDate, 
          endDate,
          signal: abortControllerRef.current.signal,
          onProgress: (progress, stats) => {
            logger.debug('Fetch progress:', { progress, ...stats });
          }
        }),
        fetchAssistants(client),
        fetchAnalytics(client, startDate, endDate)
      ]);

      if (!abortControllerRef.current.signal.aborted) {
        setData(calls, assistants, analytics);
        setError(null);
      }

    } catch (error) {
      if (!abortControllerRef.current?.signal.aborted) {
        const message = error instanceof Error ? error.message : 'Failed to fetch data';
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