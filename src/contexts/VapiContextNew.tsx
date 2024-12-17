import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useVapiStore } from '../store/useVapiStore';
import { VapiClient } from '../api/client/VapiClient';
import { useAuthStore } from '../store/useAuthStore';
import { logger } from '../utils/logger';
import { API_CONFIG } from '../config/api';

interface VapiContextType extends ReturnType<typeof useVapiStore> {}

const VapiContext = createContext<VapiContextType | null>(null);

export function VapiProvider({ children }: { children: React.ReactNode }) {
  const store = useVapiStore();
  const { privateApiKey } = useAuthStore();
  const { setClient, setError, setLoading, setData } = store;

  const initializeClient = useCallback(async (apiKey: string) => {
    let client: VapiClient | null = null;
    try {
      setLoading(true);
      logger.info('Initializing Vapi client');
      
      // Create new client instance
      client = new VapiClient(apiKey, {
        baseUrl: API_CONFIG.baseUrl
      });

      // Test connection and fetch initial data
      const now = new Date();
      const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); // Last 7 days
      const endDate = now.toISOString();

      const [calls, assistants, analytics] = await Promise.all([
        client.getCalls({ 
          startDate, 
          endDate,
          limit: 100 
        }),
        client.getAssistants(),
        client.getAnalytics(startDate, endDate)
      ]);

      logger.info('Initial data fetch successful', {
        callCount: calls.length,
        assistantCount: assistants.length,
        analyticsCount: analytics.length
      });

      // Set client and initial data
      setClient(client);
      setData({ calls, assistants, analytics });
      setError(null);

      return client;
    } catch (error) {
      logger.error('Failed to initialize Vapi client:', { error });
      
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message.includes('401')) {
        setError('Invalid API key - please check your credentials');
      } else if (message.includes('403')) {
        setError('Access forbidden - please check your API permissions');
      } else if (message.includes('Failed to fetch') || message.includes('Network Error')) {
        setError('Network error - please check your connection and try again');
      } else {
        setError(`Failed to initialize client: ${message}`);
      }

      if (client) {
        client.cleanup();
      }
      setClient(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setClient, setError, setLoading, setData]);

  useEffect(() => {
    let mounted = true;
    let currentClient: VapiClient | null = null;

    const setupClient = async () => {
      // Clear any existing client
      if (currentClient) {
        currentClient.cleanup();
      }

      // Check for API key
      if (!privateApiKey) {
        setError('API key is required');
        setClient(null);
        return;
      }

      // Initialize new client
      if (mounted) {
        currentClient = await initializeClient(privateApiKey);
      }
    };

    setupClient();

    return () => {
      mounted = false;
      if (currentClient) {
        currentClient.cleanup();
      }
    };
  }, [privateApiKey, initializeClient, setClient, setError]);

  return (
    <VapiContext.Provider value={store}>
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