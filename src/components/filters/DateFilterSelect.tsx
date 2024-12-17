import React, { useCallback, useEffect, useRef } from 'react';
import { CalendarDays } from 'lucide-react';
import { useDateRangeStore } from '../../store/useDateRangeStore';
import type { DateFilterOption } from '../../types/filters';
import { logger } from '../../utils/logger';

const DEFAULT_FILTER: DateFilterOption = '7d';

const DATE_FILTER_OPTIONS: { value: DateFilterOption; label: string }[] = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: 'month', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' }
];

export function DateFilterSelect() {
  const { selectedFilter, isUpdating, setDateRange } = useDateRangeStore();
  const initializedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Set default filter if none selected
  useEffect(() => {
    if (!initializedRef.current && !selectedFilter && isMountedRef.current) {
      logger.info('Setting default date filter', {
        filter: DEFAULT_FILTER,
        timestamp: new Date().toISOString()
      });
      setDateRange(DEFAULT_FILTER);
      initializedRef.current = true;
    }
  }, [selectedFilter, setDateRange]);

  const handleFilterChange = useCallback((value: string) => {
    try {
      // Validate that the value is a valid filter option
      if (DATE_FILTER_OPTIONS.some(option => option.value === value)) {
        const prevFilter = selectedFilter;
        const filterOption = DATE_FILTER_OPTIONS.find(opt => opt.value === value);
        
        setDateRange(value as DateFilterOption);
        logger.info('Date filter changed:', { 
          prevFilter,
          newFilter: value,
          label: filterOption?.label,
          timestamp: new Date().toISOString()
        });
      } else {
        logger.error('Invalid date filter value:', { 
          value,
          currentFilter: selectedFilter,
          validOptions: DATE_FILTER_OPTIONS.map(opt => ({ value: opt.value, label: opt.label })),
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logger.error('Error changing date filter:', {
        error,
        value,
        currentFilter: selectedFilter,
        timestamp: new Date().toISOString()
      });
    }
  }, [selectedFilter, setDateRange]);

  // Show loading state during initialization
  if (!initializedRef.current || !selectedFilter) {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CalendarDays className="h-5 w-5 text-gray-400" />
        </div>
        <div className="block w-48 pl-10 pr-10 py-2 text-base border border-gray-300 rounded-md bg-gray-50">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Get current filter label
  const currentFilterLabel = DATE_FILTER_OPTIONS.find(
    option => option.value === selectedFilter
  )?.label || 'Select date range';

  return (
    <div className="relative" role="group" aria-label="Date range filter">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <CalendarDays className="h-5 w-5 text-gray-400" />
      </div>
      <select
        value={selectedFilter}
        onChange={(e) => handleFilterChange(e.target.value)}
        disabled={isUpdating}
        className={`block w-48 pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
          isUpdating ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white hover:bg-gray-50'
        }`}
        aria-label={`Current selection: ${currentFilterLabel}`}
        aria-busy={isUpdating}
      >
        {DATE_FILTER_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isUpdating && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <div 
            className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"
            role="status"
            aria-label="Loading"
          />
        </div>
      )}
    </div>
  );
}