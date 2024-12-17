// src/contexts/vapi/hooks/useVapiState.ts
import { useCallback } from 'react';
import { useVapiStore } from '../../../store/useVapiStore';
import type { VapiClient } from '@vapi-ai/server-sdk';
import type { Call, Assistant, AnalyticsQueryResult } from '../../../types';
import type { VapiState, VapiActions } from '../types';

export function useVapiState(): { state: VapiState; actions: VapiActions } {
  const store = useVapiStore();

  const actions: VapiActions = {
    setClient: useCallback((client: VapiClient | null) => {
      store.setClient(client);
    }, []),

    setCalls: useCallback((calls: Call[]) => {
      store.setCalls(calls);
    }, []),

    setAssistants: useCallback((assistants: Assistant[]) => {
      store.setAssistants(assistants);
    }, []),

    setAnalytics: useCallback((analytics: AnalyticsQueryResult[]) => {
      store.setAnalytics(analytics);
    }, []),

    setLoading: useCallback((loading: boolean) => {
      store.setLoading(loading);
    }, []),

    setError: useCallback((error: string | null) => {
      store.setError(error);
    }, []),

    setData: useCallback((calls: Call[], assistants: Assistant[], analytics: AnalyticsQueryResult[]) => {
      store.setCalls(calls);
      store.setAssistants(assistants);
      store.setAnalytics(analytics);
    }, []),

    reset: useCallback(() => {
      store.reset();
    }, [])
  };

  const state: VapiState = {
    client: store.client,
    calls: store.calls,
    assistants: store.assistants,
    analytics: store.analytics,
    loading: store.loading,
    error: store.error
  };

  return { state, actions };
}
