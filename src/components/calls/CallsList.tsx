import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Call } from '../../types';
import { CallItem } from './CallItem';

interface CallsListProps {
  calls: Call[];
  isRealTimeConnected?: boolean;
  hasNewUpdates?: boolean;
}

export function CallsList({ calls, isRealTimeConnected, hasNewUpdates }: CallsListProps) {
  // Memoize sorted calls to prevent unnecessary re-renders
  const sortedCalls = useMemo(() => {
    return [...calls].sort((a, b) => {
      // Sort by _lastUpdate first (for real-time updates)
      const lastUpdateA = a._lastUpdate ? new Date(a._lastUpdate).getTime() : 0;
      const lastUpdateB = b._lastUpdate ? new Date(b._lastUpdate).getTime() : 0;
      if (lastUpdateA !== lastUpdateB) return lastUpdateB - lastUpdateA;
      
      // Then by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [calls]);

  // Render function for individual call items
  const renderCallItem = useCallback((call: Call) => {
    const isNew = call._lastUpdate && 
      new Date().getTime() - new Date(call._lastUpdate).getTime() < 2000;

    return (
      <motion.div
        key={call.id}
        layout
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isNew ? [1, 1.02, 1] : 1,
          backgroundColor: isNew ? ['#fff', '#f3f9ff', '#fff'] : '#fff'
        }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          duration: 0.3,
          layout: { duration: 0.2 }
        }}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <CallItem call={call} />
      </motion.div>
    );
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Calls ({calls.length})
        </h2>
        {isRealTimeConnected !== undefined && (
          <div className="flex items-center space-x-2">
            <div 
              className={`w-2 h-2 rounded-full ${
                isRealTimeConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-500">
              {isRealTimeConnected ? 'Live' : 'Reconnecting...'}
            </span>
            {hasNewUpdates && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-xs text-blue-500 font-medium"
              >
                New updates
              </motion.span>
            )}
          </div>
        )}
      </div>

      <motion.div
        layout
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {sortedCalls.map(renderCallItem)}
        </AnimatePresence>
      </motion.div>

      {!calls.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500">No calls found for the selected period</p>
        </motion.div>
      )}
    </div>
  );
}