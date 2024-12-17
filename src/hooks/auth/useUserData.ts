import { useCallback } from 'react';
import { useVapiStore } from '../../store/useVapiStore';
import { useAuthStore } from '../../store/useAuthStore';
import { logger } from '../../utils/logger';

export function useUserData() {
  const resetVapiStore = useVapiStore((state) => state.reset);
  const resetAuthStore = useAuthStore((state) => state.logout);

  const clearUserData = useCallback(async () => {
    try {
      logger.info('Starting user data cleanup');
      
      // Clear all data from stores
      resetVapiStore();
      resetAuthStore();
      
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      logger.info('User data cleanup completed');
    } catch (error) {
      logger.error('Failed to clear user data:', { error });
      throw error;
    }
  }, [resetVapiStore, resetAuthStore]);

  return { clearUserData };
}