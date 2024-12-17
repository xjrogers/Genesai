import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth';
import { LoginHeader } from './login/LoginHeader';
import { LoginError } from './login/LoginError';
import { CredentialField } from './login/CredentialField';
import { SubmitButton } from './login/SubmitButton';
import type { Credentials } from '../../types/auth';

export function LoginForm() {
  const { login, error: authError } = useAuth();
  const [credentials, setCredentials] = useState<Credentials>({
    privateApiKey: '',
    publicApiKey: '',
    organizationId: '',
    assistantId: ''
  });

  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await login(credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCredential = (field: keyof Credentials) => (value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-8">
          <LoginHeader />

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <CredentialField
                id="private-api-key"
                label="Private API Key"
                value={credentials.privateApiKey}
                onChange={updateCredential('privateApiKey')}
                type="password"
                placeholder=""
                showPassword={showPrivateKey}
                onTogglePassword={() => setShowPrivateKey(!showPrivateKey)}
              />

              <CredentialField
                id="public-api-key"
                label="Public API Key"
                value={credentials.publicApiKey}
                onChange={updateCredential('publicApiKey')}
                type="password"
                placeholder=""
                showPassword={showPublicKey}
                onTogglePassword={() => setShowPublicKey(!showPublicKey)}
              />

              <CredentialField
                id="organization-id"
                label="Organization ID"
                value={credentials.organizationId}
                onChange={updateCredential('organizationId')}
                placeholder=""
              />

              <CredentialField
                id="assistant-id"
                label="Assistant ID"
                value={credentials.assistantId}
                onChange={updateCredential('assistantId')}
                placeholder=""
              />
            </div>

            <LoginError error={error || authError} />

            <SubmitButton isLoading={isLoading} />
          </form>
        </div>
      </div>
    </div>
  );
}