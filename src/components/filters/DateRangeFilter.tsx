// src/hooks/filters/useDateRangeFilter.ts
import { useState, useCallback, useRef } from 'react';
import { startOfMonth, endOfDay, subHours, subDays } from 'date-fns';
import { formatISODate } from '../../utils/date/formatters';
import { logger } from '../../utils/logger';

export function useDateRangeFilter() {
  const [selectedRange, setSelectedRange] = useState('last7Days');
  const lastFetchRef = useRef<string>('');

  const getDateRange = useCallback(() => {
    const now = new Date();
    
    switch (selectedRange) {
      case 'last24Hours':
        return {
          startDate: formatISODate(subHours(now, 24)),
          endDate: formatISODate(now)
        };
      case 'last7Days':
        return {
          startDate: formatISODate(subDays(now, 7)),
          endDate: formatISODate(now)
        };
      case 'last30Days':
        return {
          startDate: formatISODate(subDays(now, 30)),
          endDate: formatISODate(now)
        };
      case 'thisMonth':
        return {
          startDate: formatISODate(startOfMonth(now)),
          endDate: formatISODate(endOfDay(now))
        };
      default:
        return {
          startDate: formatISODate(subDays(now, 7)),
          endDate: formatISODate(now)
        };
    }
  }, [selectedRange]);

  const updateDateRange = useCallback((range: string) => {
    const cacheKey = `${range}`;
    if (cacheKey === lastFetchRef.current) {
      return;
    }
    
    lastFetchRef.current = cacheKey;
    setSelectedRange(range);
    logger.info('Date range updated:', { range });
  }, []);

  return {
    ...getDateRange(),
    selectedRange,
    updateDateRange
  };
}
