// src/providers/AppProviders.tsx
import React from 'react';
import { AuthProvider } from '../contexts/auth';
import { VapiProvider } from '../contexts/vapi';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <VapiProvider>
        {children}
      </VapiProvider>
    </AuthProvider>
  );
}
