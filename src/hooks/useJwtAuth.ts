import { useState, useCallback } from 'react';
import { JwtService } from '../services/auth/jwtService';
import type { TokenResponse } from '../utils/jwt';

export function useJwtAuth() {
  const [token, setToken] = useState<TokenResponse | null>(
    JwtService.getInstance().getCurrentToken()
  );
  const [error, setError] = useState<string | null>(null);

  const generateToken = useCallback((orgId: string, privateKey: string) => {
    try {
      const newToken = JwtService.getInstance().generateAuthToken(orgId, privateKey);
      setToken(newToken);
      setError(null);
      return newToken;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate token';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const validateToken = useCallback((tokenStr: string, privateKey: string) => {
    try {
      return JwtService.getInstance().validateAuthToken(tokenStr, privateKey);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to validate token';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const clearToken = useCallback(() => {
    JwtService.getInstance().clearToken();
    setToken(null);
    setError(null);
  }, []);

  return {
    token,
    error,
    generateToken,
    validateToken,
    clearToken,
  };
}