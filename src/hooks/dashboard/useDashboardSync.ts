import { useCallback, useEffect, useRef } from 'react';
import { useVapi } from '../../contexts/vapi';
import { getDateRangeForFilter } from '../../utils/filters/dateFilters';
import { fetchFilteredData } from '../../services/api/queries/filtered';
import type { DateFilterOption } from '../../types/filters';
import { logger } from '../../utils/logger';

const SYNC_INTERVAL = 30000; // 30 seconds

export function useDashboardSync() {
  const { client, setLoading, setError, setData } = useVapi();
  const abortControllerRef = useRef<AbortController>();
  const syncIntervalRef = useRef<NodeJS.Timeout>();
  const lastSyncRef = useRef<string>();

  const syncData = useCallback(async (filter: DateFilterOption) => {
    if (!client) return;

    // Generate sync key for deduplication
    const syncKey = `${filter}-${new Date().toISOString()}`;
    if (syncKey === lastSyncRef.current) {
      return;
    }
    lastSyncRef.current = syncKey;

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const { startDate, endDate } = getDateRangeForFilter(filter);
      
      logger.info('Starting dashboard sync', { 
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

      if (!abortControllerRef.current.signal.aborted) {
        setData(data.calls, data.assistants, data.analytics);
        setError(null);
        
        logger.info('Dashboard sync completed', {
          filter,
          callsCount: data.calls.length,
          dateRange: { startDate, endDate }
        });
      }
    } catch (err) {
      if (!abortControllerRef.current?.signal.aborted) {
        const message = err instanceof Error ? err.message : 'Failed to sync dashboard data';
        logger.error('Dashboard sync failed:', { error: message });
        setError(message);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, [client, setData, setError, setLoading]);

  const startSync = useCallback((filter: DateFilterOption) => {
    // Clear existing interval
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    // Initial sync
    syncData(filter);

    // Setup periodic sync
    syncIntervalRef.current = setInterval(() => {
      syncData(filter);
    }, SYNC_INTERVAL);

    logger.info('Dashboard sync started', { filter });
  }, [syncData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { startSync, syncData };
}