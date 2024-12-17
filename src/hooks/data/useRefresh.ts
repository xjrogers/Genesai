import { useState, useCallback } from 'react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';
import { fetchAnalytics, fetchAssistants, fetchCalls } from '../../services/api/queries';

export function useRefresh() {
  const { client, setData, setError } = useVapi();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    if (!client || isRefreshing) return;

    try {
      setIsRefreshing(true);
      logger.info('Starting manual data refresh');

      // Fetch fresh data from API
      const [calls, assistants, analytics] = await Promise.all([
        fetchCalls(client),
        fetchAssistants(client),
        fetchAnalytics(client)
      ]);

      // Update state with fresh data
      setData(calls, assistants, analytics);
      setError(null);
      setLastRefreshedAt(new Date());
      
      logger.info('Manual data refresh completed successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh data';
      logger.error('Manual data refresh failed:', { error: message });
      setError(message);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [client, setData, setError]);

  return {
    refresh,
    isRefreshing,
    lastRefreshedAt
  };
}