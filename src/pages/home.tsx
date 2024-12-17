```typescript
import React from 'react';
import { Layout } from '../components/Layout';
import { DashboardStats } from '../components/DashboardStats';
import { RecentActivity } from '../components/RecentActivity';
import { SystemStatus } from '../components/SystemStatus';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { CallsList } from '../components/CallsList';
import { useVapi } from '../contexts/vapi';

export default function Home() {
  const { calls, analytics, loading, error } = useVapi();

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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="mt-1 text-sm text-gray-500">
            Monitor your Vapi.ai assistants and calls in real-time
          </p>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <RecentActivity />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
            <SystemStatus />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Calls</h3>
            <CallsList calls={calls.slice(0, 5)} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Overview</h3>
            <AnalyticsChart data={analytics} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
```