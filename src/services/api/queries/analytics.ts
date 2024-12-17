import type { VapiClient } from '@vapi-ai/server-sdk';
import type { AnalyticsQueryResult } from '../../../types';
import { logger } from '../../../utils/logger';

export async function fetchAnalytics(
  client: VapiClient,
  startDate?: string,
  endDate?: string
): Promise<AnalyticsQueryResult[]> {
  try {
    logger.info('Fetching analytics', { startDate, endDate });

    const analytics = await client.analytics.get({
      queries: [{
        table: 'call',
        name: 'Call Metrics',
        timeRange: startDate && endDate ? {
          start: startDate,
          end: endDate
        } : undefined,
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
    throw error;
  }
}