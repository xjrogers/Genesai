```typescript
import React from 'react';
import { AuthProvider } from '../contexts/auth';
import { VapiProvider } from '../contexts/vapi';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <VapiProvider>
        {children}
      </VapiProvider>
    </AuthProvider>
  );
}
```