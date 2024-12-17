import React from 'react';
import { AnalyticsChart } from '../../../components/analytics/AnalyticsChart';
import type { AnalyticsQueryResult } from '../../../types';

interface AnalyticsOverviewProps {
  data: AnalyticsQueryResult[];
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <AnalyticsChart data={data} />
        </div>
      </div>
    </div>
  );
}