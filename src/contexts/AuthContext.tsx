import React, { createContext, useContext, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { VapiService } from '../services/vapiService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: {
    privateApiKey: string;
    publicApiKey: string;
    organizationId: string;
    assistantId: string;
  }) => Promise<void>;
  logout: () => void;
  error: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  error: null,
  isLoading: false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setCredentials, logout } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: {
    privateApiKey: string;
    publicApiKey: string;
    organizationId: string;
    assistantId: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate credentials
      await VapiService.validateCredentials(credentials);
      
      // Store credentials if validation succeeds
      setCredentials(credentials);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to validate credentials';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    VapiService.resetClient();
    logout();
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout: handleLogout, 
      error,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}