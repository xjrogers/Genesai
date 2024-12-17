// src/hooks/vapi/useVapiState.ts
import { useCallback, useMemo } from 'react';
import { useVapiStore } from '../../store/useVapiStore';
import type { VapiActions } from '../../contexts/vapi/types';

export function useVapiState() {
  const store = useVapiStore();

  const actions: VapiActions = useMemo(() => ({
    setClient: store.setClient,
    setCalls: store.setCalls,
    setAssistants: store.setAssistants,
    setAnalytics: store.setAnalytics,
    setLoading: store.setLoading,
    setError: store.setError,
    setData: useCallback((calls, assistants, analytics) => {
      store.setCalls(calls);
      store.setAssistants(assistants);
      store.setAnalytics(analytics);
    }, []),
    reset: store.reset
  }), [store]);

  const state = useMemo(() => ({
    client: store.client,
    calls: store.calls,
    assistants: store.assistants,
    analytics: store.analytics,
    loading: store.loading,
    error: store.error
  }), [store.client, store.calls, store.assistants, store.analytics, store.loading, store.error]);

  return { state, actions };
}
