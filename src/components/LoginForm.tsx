import React, { useState } from 'react';
import { KeyRound, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/auth';
import type { Credentials } from '../contexts/auth';

export function LoginForm() {
  const { login, error: authError } = useAuth();
  const [credentials, setCredentials] = useState<Credentials>({
    privateApiKey: 'vapi_private_xxxxxxxxxxxxxx',
    publicApiKey: 'vapi_public_xxxxxxxxxxxxxx', 
    organizationId: 'org_xxxxxxxxxxxxxx',
    assistantId: 'ast_xxxxxxxxxxxxxx'
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="bg-blue-100 rounded-full p-3">
                <KeyRound className="h-10 w-10 text-blue-600" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to Genesai AI
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Private API Key */}
              <div>
                <label htmlFor="private-api-key" className="block text-sm font-medium text-gray-700">
                  Private API Key
                </label>
                <div className="mt-1 relative">
                  <input
                    id="private-api-key"
                    name="privateApiKey"
                    type={showPrivateKey ? 'text' : 'password'}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={credentials.privateApiKey}
                    onChange={(e) => setCredentials({ ...credentials, privateApiKey: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                  >
                    {showPrivateKey ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Public API Key */}
              <div>
                <label htmlFor="public-api-key" className="block text-sm font-medium text-gray-700">
                  Public API Key
                </label>
                <div className="mt-1 relative">
                  <input
                    id="public-api-key"
                    name="publicApiKey"
                    type={showPublicKey ? 'text' : 'password'}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={credentials.publicApiKey}
                    onChange={(e) => setCredentials({ ...credentials, publicApiKey: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPublicKey(!showPublicKey)}
                  >
                    {showPublicKey ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Organization ID */}
              <div>
                <label htmlFor="organization-id" className="block text-sm font-medium text-gray-700">
                  Organization ID
                </label>
                <div className="mt-1">
                  <input
                    id="organization-id"
                    name="organizationId"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={credentials.organizationId}
                    onChange={(e) => setCredentials({ ...credentials, organizationId: e.target.value })}
                  />
                </div>
              </div>

              {/* Assistant ID */}
              <div>
                <label htmlFor="assistant-id" className="block text-sm font-medium text-gray-700">
                  Assistant ID
                </label>
                <div className="mt-1">
                  <input
                    id="assistant-id"
                    name="assistantId"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={credentials.assistantId}
                    onChange={(e) => setCredentials({ ...credentials, assistantId: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {(error || authError) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error || authError}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                </span>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}