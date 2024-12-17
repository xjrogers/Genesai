// src/pages/calls/CallsPage.tsx
import React, { useCallback, useEffect, useRef } from 'react';
import { Layout } from '../../components/layout/Layout';
import { CallsList } from '../../components/calls/CallsList';
import { CallsHeader } from './components/CallsHeader';
import { RefreshButton } from '../../components/common/RefreshButton';
import { useCallData } from '../../hooks/dashboard/useCallData';
import { useDateRangeStore } from '../../store/useDateRangeStore';
import { logger } from '../../utils/logger';
import { DateFilterSelect } from '../../components/filters/DateFilterSelect';

const DEFAULT_FILTER = '7d';

export function CallsPage() {
  const { selectedFilter, isUpdating, setIsUpdating, setDateRange } = useDateRangeStore();
  const { calls, isLoading, error, fetchCalls } = useCallData();
  const lastRefreshTimeRef = useRef<Date | null>(null);
  const fetchInProgressRef = useRef(false);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Set initial filter if none is selected
  useEffect(() => {
    if (!selectedFilter && isMountedRef.current) {
      logger.info('Setting initial filter to 7d', {
        filter: DEFAULT_FILTER,
        timestamp: new Date().toISOString()
      });
      setDateRange(DEFAULT_FILTER);
    }
  }, [selectedFilter, setDateRange]);

  // Fetch data when filter changes or updates are triggered
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedFilter || fetchInProgressRef.current || !isMountedRef.current) {
        return;
      }

      try {
        fetchInProgressRef.current = true;
        logger.info('Fetching calls with filter:', {
          filter: selectedFilter,
          timestamp: new Date().toISOString()
        });

        await fetchCalls(selectedFilter);
        
        if (isMountedRef.current) {
          lastRefreshTimeRef.current = new Date();
          logger.info('Successfully fetched calls', {
            filter: selectedFilter,
            callCount: calls.length,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        if (isMountedRef.current) {
          logger.error('Failed to fetch calls:', { 
            error,
            filter: selectedFilter,
            timestamp: new Date().toISOString()
          });
        }
      } finally {
        if (isMountedRef.current) {
          fetchInProgressRef.current = false;
          setIsUpdating(false);
        }
      }
    };

    if ((isUpdating || (!calls.length && selectedFilter)) && !fetchInProgressRef.current) {
      fetchData();
    }
  }, [selectedFilter, isUpdating, fetchCalls, setIsUpdating, calls.length]);

  const handleRefresh = useCallback(async () => {
    if (!fetchInProgressRef.current && selectedFilter && isMountedRef.current) {
      logger.info('Manual refresh triggered', {
        filter: selectedFilter,
        timestamp: new Date().toISOString()
      });
      setIsUpdating(true);
    }
  }, [setIsUpdating, selectedFilter]);

  // Show loading state
  if (isLoading || fetchInProgressRef.current) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4" />
          <p className="text-gray-500">Loading calls...</p>
          {selectedFilter && (
            <p className="text-sm text-gray-400 mt-2">
              Fetching data for {selectedFilter === '24h' ? 'last 24 hours' :
                               selectedFilter === '7d' ? 'last 7 days' :
                               selectedFilter === '30d' ? 'last 30 days' :
                               selectedFilter === 'month' ? 'this month' :
                               selectedFilter === 'lastMonth' ? 'last month' :
                               'selected period'}
            </p>
          )}
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading calls</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show main content
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <CallsHeader lastRefreshTime={lastRefreshTimeRef.current} />
          <div className="flex items-center space-x-4">
            <DateFilterSelect />
            <RefreshButton 
              onRefresh={handleRefresh}
              isLoading={isLoading || fetchInProgressRef.current}
            />
          </div>
        </div>
        {!calls.length ? (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">No calls found</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  No calls were found for the selected time period
                  ({selectedFilter === '24h' ? 'last 24 hours' :
                    selectedFilter === '7d' ? 'last 7 days' :
                    selectedFilter === '30d' ? 'last 30 days' :
                    selectedFilter === 'month' ? 'this month' :
                    selectedFilter === 'lastMonth' ? 'last month' :
                    'selected period'}).
                </p>
                <p className="mt-1">
                  Try selecting a different time period or refresh the data.
                </p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Refresh data
                </button>
              </div>
            </div>
          </div>
        ) : (
          <CallsList calls={calls} />
        )}
      </div>
    </Layout>
  );
}
