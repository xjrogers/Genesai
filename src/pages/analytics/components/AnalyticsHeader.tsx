import React from 'react';
import { BarChart } from 'lucide-react';

export function AnalyticsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="mt-1 text-sm text-gray-500">
          View detailed analytics and insights
        </p>
      </div>
      <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
        <BarChart className="h-4 w-4 mr-2" />
        Export Report
      </button>
    </div>
  );
}