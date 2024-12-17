import React from 'react';
import { Layout } from '../components/Layout';
import { CallsList } from '../components/CallsList';
import { useVapi } from '../contexts/vapi';

export default function Calls() {
  const { calls, loading, error } = useVapi();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Call History</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your Vapi.ai calls
          </p>
        </div>

        <CallsList calls={calls} />
      </div>
    </Layout>
  );
}