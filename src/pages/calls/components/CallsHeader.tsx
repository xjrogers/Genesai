import React from 'react';
import { useDateRangeStore } from '../../../store/useDateRangeStore';
import { formatDistanceToNow } from 'date-fns';

interface CallsHeaderProps {
  lastRefreshTime: Date | null;
}

export function CallsHeader({ lastRefreshTime }: CallsHeaderProps) {
  const { selectedFilter } = useDateRangeStore();

  const getFilterLabel = () => {
    switch (selectedFilter) {
      case '24h':
        return 'Last 24 Hours';
      case '7d':
        return 'Last 7 Days';
      case '30d':
        return 'Last 30 Days';
      case 'month':
        return 'This Month';
      case 'lastMonth':
        return 'Last Month';
      case 'custom':
        return 'Custom Range';
      default:
        return 'All Time';
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2">
        <h2 className="text-2xl font-bold text-gray-900">Call History</h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {getFilterLabel()}
        </span>
      </div>
      <div className="mt-1 text-sm text-gray-500 flex items-center space-x-2">
        <p>View and manage your calls</p>
        {lastRefreshTime && (
          <>
            <span className="text-gray-300">•</span>
            <p className="text-gray-400">
              Last updated {formatDistanceToNow(lastRefreshTime, { addSuffix: true })}
            </p>
          </>
        )}
      </div>
    </div>
  );
}