import { useEffect, useRef } from 'react';
import { fetchFilteredData } from '../../../services/api/queries/filtered';
import { logger } from '../../../utils/logger';
import type { VapiClient } from '@vapi-ai/server-sdk';
import type { VapiActions } from '../types';

export function useVapiSync(client: VapiClient | null, actions: VapiActions) {
  const { setLoading, setError, setData } = actions;
  const isMountedRef = useRef(true);
  const initialLoadRef = useRef(false);
  const abortControllerRef = useRef<AbortController>();

  useEffect(() => {
    const fetchData = async () => {
      if (!client || !isMountedRef.current) return;

      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        if (!initialLoadRef.current) {
          setLoading(true);
        }

        // Get current time for default date range
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);

        logger.info('Starting data sync');

        const data = await fetchFilteredData(client, {
          startDate: thirtyDaysAgo.toISOString(),
          endDate: now.toISOString(),
          signal: abortControllerRef.current.signal,
          onProgress: (progress) => {
            logger.debug('Data sync progress:', { progress });
          }
        });

        if (!isMountedRef.current || abortControllerRef.current.signal.aborted) return;

        setData(data.calls, data.assistants, data.analytics);
        setError(null);
        initialLoadRef.current = true;

        logger.info('Data sync completed', {
          callsCount: data.calls.length,
          assistantsCount: data.assistants.length,
          hasAnalytics: data.analytics.length > 0
        });
      } catch (err) {
        if (!isMountedRef.current || abortControllerRef.current?.signal.aborted) return;
        
        const message = err instanceof Error ? err.message : 'Failed to sync data';
        logger.error('Data sync failed:', { error: message });
        setError(message);
      } finally {
        if (isMountedRef.current && !abortControllerRef.current?.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchData();

    // Setup periodic sync
    const syncInterval = setInterval(fetchData, 30000); // Sync every 30 seconds

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      clearInterval(syncInterval);
    };
  }, [client, setData, setError, setLoading]);
}