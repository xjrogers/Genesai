// src/hooks/filters/useDateRangeFilter.ts
import { useState, useCallback, useEffect } from 'react';
import { startOfMonth, endOfDay, subHours, subDays, format } from 'date-fns';
import { formatISODate } from '../../utils/date/formatters';
import { logger } from '../../utils/logger';

export function useDateRangeFilter() {
  const [selectedRange, setSelectedRange] = useState('last7Days');
  const [dateRange, setDateRange] = useState(() => getInitialDateRange());

  function getInitialDateRange() {
    const now = new Date();
    return {
      startDate: formatISODate(subDays(now, 7)),
      endDate: formatISODate(now)
    };
  }

  const updateDateRange = useCallback((range: string) => {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (range) {
      case 'last24Hours':
        start = subHours(now, 24);
        break;
      case 'last7Days':
        start = subDays(now, 7);
        break;
      case 'last30Days':
        start = subDays(now, 30);
        break;
      case 'thisMonth':
        start = startOfMonth(now);
        end = endOfDay(now);
        break;
      default:
        start = subDays(now, 7); // Default to last 7 days
    }

    setSelectedRange(range);
    setDateRange({
      startDate: formatISODate(start),
      endDate: formatISODate(end)
    });

    logger.info('Date range updated:', { range, start, end });
  }, []);

  // Update date range when selected range changes
  useEffect(() => {
    updateDateRange(selectedRange);
  }, [selectedRange, updateDateRange]);

  return {
    ...dateRange,
    selectedRange,
    updateDateRange
  };
}
