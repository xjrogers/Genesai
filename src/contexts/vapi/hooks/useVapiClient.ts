import { useEffect, useRef } from 'react';
import { VapiClient } from '@vapi-ai/server-sdk';
import { useAuthStore } from '../../auth/store';
import { logger } from '../../../utils/logger';
import type { VapiActions } from '../types';

export function useVapiClient(actions: VapiActions) {
  const { privateApiKey, isAuthenticated } = useAuthStore();
  const { setClient, setError } = actions;
  const clientRef = useRef<VapiClient | null>(null);
  const initializationAttemptRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeClient = async () => {
      // Clear any existing client and error state
      if (clientRef.current) {
        setClient(null);
        clientRef.current = null;
      }

      // If not authenticated or no API key, clear client and return
      if (!isAuthenticated || !privateApiKey) {
        logger.warn('Cannot initialize Vapi client - missing authentication', {
          isAuthenticated,
          hasApiKey: !!privateApiKey,
          timestamp: new Date().toISOString()
        });
        setError('Please sign in to access the dashboard');
        return;
      }

      try {
        // Increment initialization attempt
        initializationAttemptRef.current += 1;
        const currentAttempt = initializationAttemptRef.current;

        logger.info('Initializing Vapi client', {
          attempt: currentAttempt,
          timestamp: new Date().toISOString()
        });
        
        // Create new client instance
        const client = new VapiClient({ token: privateApiKey });
        
        // Test connection with retry
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            await client.calls.list({ limit: 1 });
            break; // Success, exit retry loop
          } catch (error) {
            retryCount++;
            if (retryCount === maxRetries) throw error;
            
            logger.warn('Connection test failed, retrying...', {
              attempt: currentAttempt,
              retry: retryCount,
              error,
              timestamp: new Date().toISOString()
            });
            
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          }
        }
        
        if (mounted && currentAttempt === initializationAttemptRef.current) {
          clientRef.current = client;
          setClient(client);
          setError(null);
          logger.info('Vapi client initialized successfully', {
            attempt: currentAttempt,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        if (mounted) {
          const message = error instanceof Error ? error.message : 'Failed to initialize Vapi client';
          logger.error('Failed to initialize Vapi client:', { 
            error: message,
            timestamp: new Date().toISOString()
          });
          setError('Failed to connect to Vapi. Please check your API key and try again.');
          setClient(null);
          clientRef.current = null;

          // Schedule a retry after 5 seconds
          timeoutId = setTimeout(() => {
            if (mounted && isAuthenticated && privateApiKey) {
              logger.info('Retrying client initialization...');
              initializeClient();
            }
          }, 5000);
        }
      }
    };

    initializeClient();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      clientRef.current = null;
    };
  }, [privateApiKey, isAuthenticated, setClient, setError]);
}