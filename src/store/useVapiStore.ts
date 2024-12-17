import { create } from 'zustand';
import { VapiClient } from '../api/client/VapiClient';
import type { Call, Assistant, AnalyticsQueryResult } from '../types';
import { logger } from '../utils/logger';

export interface VapiStore {
  client: VapiClient | null;
  calls: Call[];
  assistants: Assistant[];
  analytics: AnalyticsQueryResult[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  setClient: (client: VapiClient | null) => void;
  setCalls: (calls: Call[]) => void;
  setAssistants: (assistants: Assistant[]) => void;
  setAnalytics: (analytics: AnalyticsQueryResult[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setData: (data: { calls?: Call[]; assistants?: Assistant[]; analytics?: AnalyticsQueryResult[] }) => void;
  reset: () => void;
}

const initialState = {
  client: null,
  calls: [],
  assistants: [],
  analytics: [],
  loading: false,
  error: null,
  initialized: false
};

export const useVapiStore = create<VapiStore>((set, get) => ({
  ...initialState,
  setClient: (client) => {
    const prevClient = get().client;
    if (prevClient && prevClient !== client) {
      prevClient.cleanup();
    }
    set({ 
      client,
      initialized: true,
      error: null
    });
    logger.info('Client state updated:', {
      hasClient: !!client,
      initialized: true
    });
  },
  setCalls: (calls) => set({ calls }),
  setAssistants: (assistants) => set({ assistants }),
  setAnalytics: (analytics) => set({ analytics }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => {
    const currentError = get().error;
    if (error !== currentError) {
      logger.error('Store error:', { error });
      set({ error });
    }
  },
  setData: ({ calls, assistants, analytics }) => 
    set((state) => ({
      ...state,
      ...(calls && { calls }),
      ...(assistants && { assistants }),
      ...(analytics && { analytics })
    })),
  reset: () => {
    const { client } = get();
    if (client) {
      client.cleanup();
    }
    set(initialState);
    logger.info('Store reset');
  }
}));