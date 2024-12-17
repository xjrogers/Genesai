import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { AnalyticsHeader } from './components/AnalyticsHeader';
import { AnalyticsFilters } from './components/AnalyticsFilters';
import { AnalyticsOverview } from './components/AnalyticsOverview';
import { useVapi } from '../../contexts/vapi';
import { useFilterSync } from '../../hooks/filters/useFilterSync';

export function AnalyticsPage() {
  const { analytics, loading, error } = useVapi();
  useFilterSync(); // Add filter sync hook

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
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
        <AnalyticsHeader />
        <AnalyticsFilters />
        <AnalyticsOverview data={analytics} />
      </div>
    </Layout>
  );
}