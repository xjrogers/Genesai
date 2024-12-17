import { useEffect } from 'react';
import { logger } from '../../../utils/logger';
import type { VapiClient } from '@vapi-ai/server-sdk';
import type { VapiActions } from '../state/vapiState';

export function useVapiData(
  client: VapiClient | null,
  { setLoading, setCalls, setAssistants, setAnalytics, setError }: VapiActions
) {
  useEffect(() => {
    if (!client) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [callsData, assistantsData, analyticsData] = await Promise.all([
          client.calls.list(),
          client.assistants.list(),
          client.analytics.get({
            queries: [{
              table: 'call',
              name: 'metrics',
              operations: [
                { operation: 'count', column: 'id' },
                { operation: 'sum', column: 'cost' },
                { operation: 'avg', column: 'duration' }
              ]
            }]
          })
        ]);

        setCalls(callsData);
        setAssistants(assistantsData);
        setAnalytics(analyticsData);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch data';
        logger.error('Failed to fetch initial data:', { error: message });
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [client, setCalls, setAssistants, setAnalytics, setError, setLoading]);
}