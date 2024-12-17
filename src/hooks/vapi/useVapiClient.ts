// src/hooks/vapi/useVapiClient.ts
import { useEffect, useRef } from 'react';
import { VapiClient } from '@vapi-ai/server-sdk';
import { useAuthStore } from '../../store/useAuthStore';
import { logger } from '../../utils/logger';
import type { VapiActions } from '../../contexts/vapi/types';

export function useVapiClient(actions: VapiActions) {
  const { privateApiKey, isAuthenticated } = useAuthStore();
  const { setClient, setError } = actions;
  const clientRef = useRef<VapiClient | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !privateApiKey) {
      setClient(null);
      clientRef.current = null;
      return;
    }

    // Only create new client if we don't have one or if key changed
    if (!clientRef.current) {
      try {
        logger.info('Initializing Vapi client');
        clientRef.current = new VapiClient({ token: privateApiKey });
        setClient(clientRef.current);
        setError(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to initialize client';
        logger.error('Client initialization failed:', { error: message });
        setError(message);
        setClient(null);
        clientRef.current = null;
      }
    }

    return () => {
      clientRef.current = null;
    };
  }, [privateApiKey, isAuthenticated]);
}
