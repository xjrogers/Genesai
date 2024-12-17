import React, { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { useVapi } from '../contexts/vapi';

export default function Analytics() {
  const { analytics, loading, error } = useVapi();

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
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="mt-1 text-sm text-gray-500">
            View detailed analytics and insights
          </p>
        </div>

        <AnalyticsChart data={analytics} />
      </div>
    </Layout>
  );
}