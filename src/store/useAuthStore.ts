// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Credentials } from '../types/auth';

interface AuthState {
  privateApiKey: string | null;
  publicApiKey: string | null;
  organizationId: string | null;
  assistantId: string | null;
  isAuthenticated: boolean;
  setCredentials: (credentials: Credentials) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      privateApiKey: null,
      publicApiKey: null,
      organizationId: null,
      assistantId: null,
      isAuthenticated: false,
      setCredentials: (credentials) =>
        set({
          privateApiKey: credentials.privateApiKey,
          publicApiKey: credentials.publicApiKey,
          organizationId: credentials.organizationId,
          assistantId: credentials.assistantId,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          privateApiKey: null,
          publicApiKey: null,
          organizationId: null,
          assistantId: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'genesai-auth',
    }
  )
);
