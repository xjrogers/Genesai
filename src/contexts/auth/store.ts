import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, Credentials } from './types';
import { logger } from '../../utils/logger';

const initialState = {
  privateApiKey: '',
  publicApiKey: '',
  organizationId: '',
  assistantId: '',
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setCredentials: (credentials: Credentials) => {
        logger.info('Setting credentials', {
          hasPrivateKey: !!credentials.privateApiKey,
          hasPublicKey: !!credentials.publicApiKey,
          hasOrgId: !!credentials.organizationId,
          hasAssistantId: !!credentials.assistantId,
          timestamp: new Date().toISOString()
        });
        
        set({
          ...credentials,
          isAuthenticated: true,
        });
      },
      logout: () => {
        logger.info('Logging out', {
          timestamp: new Date().toISOString()
        });
        
        set(initialState);
      },
      validateAuth: () => {
        const state = get();
        const isValid = !!(
          state.privateApiKey &&
          state.isAuthenticated
        );

        logger.debug('Validating auth state', {
          isValid,
          hasPrivateKey: !!state.privateApiKey,
          isAuthenticated: state.isAuthenticated,
          timestamp: new Date().toISOString()
        });

        if (!isValid && state.isAuthenticated) {
          logger.warn('Invalid auth state detected, logging out', {
            timestamp: new Date().toISOString()
          });
          get().logout();
        }

        return isValid;
      }
    }),
    {
      name: 'vapi-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        privateApiKey: state.privateApiKey,
        publicApiKey: state.publicApiKey,
        organizationId: state.organizationId,
        assistantId: state.assistantId,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          logger.info('Auth store rehydrated', {
            hasPrivateKey: !!state.privateApiKey,
            isAuthenticated: state.isAuthenticated,
            timestamp: new Date().toISOString()
          });
          
          // Validate auth state after rehydration
          requestAnimationFrame(() => {
            if (state.validateAuth) {
              state.validateAuth();
            }
          });
        }
      },
    }
  )
);