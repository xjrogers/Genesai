import { useCallback, useRef, useEffect } from 'react';
import { useVapi } from '../../contexts/vapi';
import { fetchFilteredData } from '../../services/api/queries/filtered';
import { useDateRangeStore } from '../../store/useDateRangeStore';
import { logger } from '../../utils/logger';

export function useDashboardData() {
  const { client, setLoading, setError, setData } = useVapi();
  const { startDate, endDate, selectedFilter, setIsUpdating } = useDateRangeStore();
  const abortControllerRef = useRef<AbortController>();

  const fetchData = useCallback(async () => {
    if (!client) return;

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setIsUpdating(true);
      
      logger.info('Starting dashboard data fetch', { 
        filter: selectedFilter,
        dateRange: { startDate, endDate }
      });

      const data = await fetchFilteredData(client, {
        startDate,
        endDate,
        signal: abortControllerRef.current.signal,
        onProgress: (progress, stats) => {
          logger.info('Data fetch progress:', { 
            progress, 
            totalCalls: stats?.totalCalls,
            currentBatch: stats?.batchCount,
            batchSize: stats?.batchSize
          });
        }
      });

      if (abortControllerRef.current.signal.aborted) return;

      setData(data.calls, data.assistants, data.analytics);
      setError(null);
      
      logger.info('Dashboard data fetch completed', {
        totalCalls: data.calls.length,
        dateRange: { startDate, endDate }
      });

      return data;
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) return;
      
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      logger.error('Dashboard data fetch failed:', { error: message });
      setError(message);
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
        setIsUpdating(false);
      }
    }
  }, [client, setLoading, setError, setData, startDate, endDate, selectedFilter, setIsUpdating]);

  // Fetch data when date range changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { fetchData };
} 