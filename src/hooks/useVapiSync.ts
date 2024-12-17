import { useEffect, useRef } from 'react';
import { useVapiStore } from '../store/useVapiStore';

const SYNC_INTERVAL = 30000; // 30 seconds

export function useVapiSync() {
  const { client, setLoading, setError, setCalls, setAssistants, setAnalytics } = useVapiStore();
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchData = async () => {
    if (!client) return;

    try {
      setLoading(true);
      
      const [calls, assistants, analytics] = await Promise.all([
        client.listCalls(),
        client.listAssistants(),
        client.getAnalytics({
          timeRange: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          },
          metrics: [
            { name: 'total_calls', aggregation: 'count', field: 'id' },
            { name: 'total_cost', aggregation: 'sum', field: 'cost' },
            { name: 'avg_duration', aggregation: 'avg', field: 'duration' }
          ]
        })
      ]);
      
      setCalls(calls);
      setAssistants(assistants);
      setAnalytics(analytics);
      setError(null);
    } catch (err) {
      console.error('Sync error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync with Vapi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only start sync if we have a client
    if (client) {
      // Initial fetch
      fetchData();

      // Setup interval for subsequent fetches
      intervalRef.current = setInterval(fetchData, SYNC_INTERVAL);

      // Cleanup
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [client]);
}