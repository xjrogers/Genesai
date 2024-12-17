// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CallsPage } from './pages/calls/CallsPage';
import { useVapi } from './contexts/VapiContextNew';
import { useAuthStore } from './store/useAuthStore';

export function App() {
  const { error, loading } = useVapi();
  const { privateApiKey } = useAuthStore();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            {!privateApiKey && (
              <p className="text-sm text-gray-500">
                Please provide your API key to access the dashboard.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<CallsPage />} />
      </Routes>
    </div>
  );
}

export default App;
