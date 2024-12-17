// src/components/common/RefreshButton.tsx
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { logger } from '../../utils/logger';

interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
}

export function RefreshButton({ onRefresh }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      await onRefresh();
      logger.info('Manual refresh completed successfully');
    } catch (error) {
      logger.error('Manual refresh failed:', { error });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isRefreshing}
      className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </button>
  );
}
