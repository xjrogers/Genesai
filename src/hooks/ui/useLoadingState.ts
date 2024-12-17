// src/hooks/ui/useLoadingState.ts
import { useState, useCallback } from 'react';
import { logger } from '../../utils/logger';

export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback((error: unknown) => {
    const message = error instanceof Error ? error.message : 'An error occurred';
    logger.error('Operation failed:', { error: message });
    setError(message);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    handleError
  };
}
