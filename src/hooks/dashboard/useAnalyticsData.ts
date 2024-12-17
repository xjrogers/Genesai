import { useCallback } from 'react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';
import type { AnalyticsQueryResult } from '../../types';

export function useAnalyticsData() {
  const { client } = useVapi();

  const fetchAnalytics = useCallback(async (
    startDate?: string,
    endDate?: string
  ): Promise<AnalyticsQueryResult[]> => {
    if (!client) return [];

    try {
      logger.info('Fetching analytics', { startDate, endDate });

      const analytics = await client.analytics.get({
        queries: [{
          table: 'call',
          name: 'Call Metrics',
          timeRange: startDate && endDate ? { start: startDate, end: endDate } : undefined,
          operations: [
            { operation: 'count', column: 'id' },
            { operation: 'sum', column: 'cost' },
            { operation: 'avg', column: 'duration' },
            { operation: 'sum', column: 'costBreakdown.llm' },
            { operation: 'sum', column: 'costBreakdown.stt' },
            { operation: 'sum', column: 'costBreakdown.tts' }
          ]
        }]
      });

      logger.info('Analytics fetch completed', {
        hasResults: analytics.length > 0
      });

      return analytics;
    } catch (error) {
      logger.error('Failed to fetch analytics:', { error });
      return [];
    }
  }, [client]);

  return { fetchAnalytics };
}