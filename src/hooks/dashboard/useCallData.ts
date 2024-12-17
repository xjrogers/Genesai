import { useCallback, useRef, useState, useEffect } from 'react';
import { useVapi } from '../../contexts/vapi';
import { logger } from '../../utils/logger';
import { DateRangeType, getDateRangeParams } from '../../utils/date/dateUtils';
import type { Call } from '../../types';
import { VapiClient } from '../../api/client/VapiClient';

interface UseCallDataReturn {
  calls: Call[];
  isLoading: boolean;
  error: string | null;
  progress: number;
  isRealTimeConnected: boolean;
  hasNewUpdates: boolean;
  fetchCalls: (dateRange: DateRangeType) => Promise<void>;
}

export function useCallData(): UseCallDataReturn {
  const { client } = useVapi();
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);
  const abortControllerRef = useRef<AbortController>();
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const fetchAttemptRef = useRef(0);
  const isMountedRef = useRef(true);
  const callsRef = useRef<Call[]>([]);
  const dateRangeRef = useRef<{ startDate: string; endDate: string } | null>(null);

  // Keep refs in sync with state
  useEffect(() => {
    callsRef.current = calls;
  }, [calls]);

  // Cleanup function
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle real-time updates
  useEffect(() => {
    if (!client || !(client instanceof VapiClient)) return;

    const handleCallUpdate = (update: Call) => {
      if (!isMountedRef.current || !dateRangeRef.current) return;

      const { startDate, endDate } = dateRangeRef.current;
      const updateDate = new Date(update.createdAt);
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);

      // Check if update is within current date range
      if (updateDate >= startDateTime && updateDate <= endDateTime) {
        setCalls(currentCalls => {
          const index = currentCalls.findIndex(call => call.id === update.id);
          if (index >= 0) {
            // Update existing call
            const newCalls = [...currentCalls];
            newCalls[index] = {
              ...newCalls[index],
              ...update,
              _lastUpdate: new Date().toISOString()
            };
            return newCalls;
          } else {
            // Add new call at the beginning
            return [{
              ...update,
              _lastUpdate: new Date().toISOString()
            }, ...currentCalls];
          }
        });

        setHasNewUpdates(true);
        // Reset new updates indicator after 2 seconds
        setTimeout(() => {
          if (isMountedRef.current) {
            setHasNewUpdates(false);
          }
        }, 2000);
      }
    };

    const handleConnectionChange = (status: boolean) => {
      if (isMountedRef.current) {
        setIsRealTimeConnected(status);
        if (status) {
          logger.info('Real-time connection established');
        } else {
          logger.warn('Real-time connection lost');
        }
      }
    };

    client.on('callUpdate', handleCallUpdate);
    client.on('connectionChange', handleConnectionChange);
    setIsRealTimeConnected(client.isConnected);

    return () => {
      client.off('callUpdate', handleCallUpdate);
      client.off('connectionChange', handleConnectionChange);
    };
  }, [client]);

  const fetchCalls = useCallback(async (dateRange: DateRangeType) => {
    if (!client || !(client instanceof VapiClient)) {
      setError('API client is not initialized');
      setIsLoading(false);
      return;
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = undefined;
    }
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = undefined;
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const currentController = abortControllerRef.current;

    // Increment fetch attempt counter
    fetchAttemptRef.current += 1;
    const currentAttempt = fetchAttemptRef.current;

    setProgress(0);

    try {
      setIsLoading(true);
      setError(null);

      // Set a timeout to clear loading state if the request takes too long
      loadingTimeoutRef.current = setTimeout(() => {
        if (currentAttempt === fetchAttemptRef.current && isMountedRef.current) {
          setIsLoading(false);
          setError('Request timed out. Please try again.');
          setProgress(0);
          if (currentController === abortControllerRef.current) {
            currentController.abort();
            abortControllerRef.current = undefined;
          }
        }
      }, 30000); // 30 second timeout

      const { startDate, endDate } = getDateRangeParams(dateRange);
      dateRangeRef.current = { startDate, endDate };
      
      logger.info('Fetching calls for date range', {
        dateRange,
        startDate,
        endDate,
        attempt: currentAttempt,
        timestamp: new Date().toISOString()
      });

      const fetchedCalls = await client.getCalls({
        startDate,
        endDate,
        signal: currentController.signal,
        onProgress: (progress: number) => {
          if (currentAttempt === fetchAttemptRef.current && isMountedRef.current) {
            setProgress(progress);
          }
        }
      });

      // Clear the timeout since we got a response
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = undefined;
      }

      // Only update state if this is still the current fetch attempt and component is mounted
      if (currentController === abortControllerRef.current && 
          !currentController.signal.aborted && 
          currentAttempt === fetchAttemptRef.current && 
          isMountedRef.current) {
        // Sort calls by date and add _lastUpdate field
        const sortedCalls = fetchedCalls
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setCalls(sortedCalls);
        setProgress(100);
        setIsLoading(false);
        logger.info('Successfully fetched calls', {
          count: sortedCalls.length,
          dateRange,
          attempt: currentAttempt,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      // Only update error state if this is still the current fetch attempt and component is mounted
      if (currentController === abortControllerRef.current && 
          !currentController.signal.aborted && 
          currentAttempt === fetchAttemptRef.current && 
          isMountedRef.current) {
        const message = error instanceof Error ? error.message : 'Failed to fetch calls';
        setError(message);
        setIsLoading(false);
        setProgress(0);
        logger.error('Failed to fetch calls:', { 
          error,
          attempt: currentAttempt,
          timestamp: new Date().toISOString()
        });
      }
    } finally {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = undefined;
      }
      // Only update loading state if this is still the current fetch attempt and component is mounted
      if (currentController === abortControllerRef.current && 
          !currentController.signal.aborted && 
          currentAttempt === fetchAttemptRef.current && 
          isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [client]);

  // Reset loading state if client changes
  useEffect(() => {
    if (!client) {
      setIsLoading(false);
      setProgress(0);
      setCalls([]);
      setIsRealTimeConnected(false);
    }
  }, [client]);

  return {
    calls,
    isLoading,
    error,
    progress,
    isRealTimeConnected,
    hasNewUpdates,
    fetchCalls
  };
}