import { useCallback, useEffect, useRef } from 'react';
import { useVapi } from '../../contexts/vapi';
import { fetchFilteredData } from '../../services/api/queries/filtered';
import { getDateRangeForFilter } from '../../utils/filters/dateFilters';
import type { DateFilterOption } from '../../types/filters';
import { logger } from '../../utils/logger';

const SYNC_INTERVAL = 30000; // 30 seconds

export function useDataSync() {
  const { client, setLoading, setError, setData } = useVapi();
  const abortControllerRef = useRef<AbortController>();
  const syncTimeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  const syncData = useCallback(async (filter: DateFilterOption) => {
    if (!client || !isMountedRef.current) return;

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const { startDate, endDate } = getDateRangeForFilter(filter);
      
      logger.info('Starting data sync', { 
        filter,
        dateRange: { startDate, endDate }
      });

      const data = await fetchFilteredData(client, {
        startDate,
        endDate,
        signal: abortControllerRef.current.signal,
        onProgress: (progress) => {
          logger.debug('Sync progress:', { progress });
        }
      });

      if (!isMountedRef.current || abortControllerRef.current.signal.aborted) return;

      setData(data.calls, data.assistants, data.analytics);
      setError(null);
      
      logger.info('Data sync completed', {
        filter,
        callsCount: data.calls.length
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
  }, [client, setData, setError, setLoading]);

  const startSync = useCallback((filter: DateFilterOption) => {
    // Clear existing sync
    if (syncTimeoutRef.current) {
      clearInterval(syncTimeoutRef.current);
    }

    // Initial sync
    syncData(filter);

    // Setup periodic sync
    syncTimeoutRef.current = setInterval(() => {
      syncData(filter);
    }, SYNC_INTERVAL);
  }, [syncData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (syncTimeoutRef.current) {
        clearInterval(syncTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { syncData, startSync };
}