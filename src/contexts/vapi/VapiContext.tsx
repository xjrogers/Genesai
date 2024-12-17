import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useVapiState } from './hooks/useVapiState';
import { useVapiClient } from './hooks/useVapiClient';
import { useVapiSync } from './hooks/useVapiSync';
import type { VapiContextType } from './types';
import { logger } from '../../utils/logger';

const VapiContext = createContext<VapiContextType | null>(null);

export function VapiProvider({ children }: { children: React.ReactNode }) {
  const { state, actions } = useVapiState();
  
  // Initialize client
  useVapiClient(actions);

  // Setup data sync
  useVapiSync(state.client, actions);

  // Log state changes
  useEffect(() => {
    logger.debug('VapiContext state updated', {
      hasClient: !!state.client,
      callsCount: state.calls.length,
      assistantsCount: state.assistants.length,
      loading: state.loading,
      hasError: !!state.error
    });
  }, [state]);

  const value = useMemo(() => ({
    ...state,
    ...actions
  }), [state, actions]);

  return (
    <VapiContext.Provider value={value}>
      {children}
    </VapiContext.Provider>
  );
}

export function useVapi() {
  const context = useContext(VapiContext);
  if (!context) {
    throw new Error('useVapi must be used within a VapiProvider');
  }
  return context;
}