import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuthStore } from './store';
import { CredentialValidator } from '../../services/validation/credentialValidator';
import { logger } from '../../utils/logger';
import type { Credentials } from '../../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  error: string | null;
  isLoading: boolean;
}

// Create context with a default value that matches the shape of AuthContextType
const defaultContext: AuthContextType = {
  isAuthenticated: false,
  login: async () => {
    throw new Error('AuthContext not initialized');
  },
  logout: () => {
    throw new Error('AuthContext not initialized');
  },
  error: null,
  isLoading: false,
};

const AuthContext = createContext<AuthContextType>(defaultContext);
AuthContext.displayName = 'AuthContext'; // For better debugging

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, setCredentials, logout: clearCredentials } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials: Credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      logger.info('Starting authentication process');
      
      // Validate credentials
      await CredentialValidator.validate(credentials);
      
      // Store credentials if validation succeeds
      setCredentials(credentials);
      logger.info('Authentication successful');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to validate credentials';
      logger.error('Authentication error:', { error: message });
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [setCredentials]);

  const logout = useCallback(() => {
    clearCredentials();
    setError(null);
    logger.info('Logged out successfully');
  }, [clearCredentials]);

  const value = React.useMemo(() => ({
    isAuthenticated,
    login,
    logout,
    error,
    isLoading
  }), [isAuthenticated, login, logout, error, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}