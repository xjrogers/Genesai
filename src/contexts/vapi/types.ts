import type { VapiClient } from '@vapi-ai/server-sdk';
import type { Call, Assistant, AnalyticsQueryResult } from '../../types';

export interface VapiState {
  client: VapiClient | null;
  calls: Call[];
  assistants: Assistant[];
  analytics: AnalyticsQueryResult[];
  loading: boolean;
  error: string | null;
}

export interface VapiActions {
  setClient: (client: VapiClient | null) => void;
  setCalls: (calls: Call[]) => void;
  setAssistants: (assistants: Assistant[]) => void;
  setAnalytics: (analytics: AnalyticsQueryResult[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setData: (calls: Call[], assistants: Assistant[], analytics: AnalyticsQueryResult[]) => void;
  reset: () => void;
}

export type VapiContextType = VapiState & VapiActions;