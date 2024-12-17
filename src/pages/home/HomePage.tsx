import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { DateFilterSelect } from '../../components/filters/DateFilterSelect';
import { RefreshButton } from '../../components/common/RefreshButton';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { useInitialData } from '../../hooks/data/useInitialData';
import { useVapi } from '../../contexts/vapi';

export function HomePage() {
  const { error } = useVapi();
  const { loading } = useInitialData();

  if (loading) {
    return (
      <Layout>
        <LoadingState message="Loading dashboard data..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorDisplay error={error} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              Monitor your AI assistants and calls in real-time
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <DateFilterSelect />
            <RefreshButton />
          </div>
        </div>

        <DashboardStats />
      </div>
    </Layout>
  );
}