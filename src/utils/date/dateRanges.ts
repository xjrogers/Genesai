import { startOfMonth, endOfDay, subHours, subDays, format } from 'date-fns';

export interface DateRange {
  startDate: string;
  endDate: string;
  label: string;
}

export function getDateRanges(): Record<string, DateRange> {
  const now = new Date();
  
  return {
    last24Hours: {
      label: 'Last 24 Hours',
      startDate: format(subHours(now, 24), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      endDate: format(endOfDay(now), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    },
    last7Days: {
      label: 'Last 7 Days',
      startDate: format(subDays(now, 7), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      endDate: format(endOfDay(now), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    },
    last30Days: {
      label: 'Last 30 Days',
      startDate: format(subDays(now, 30), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      endDate: format(endOfDay(now), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    },
    thisMonth: {
      label: 'This Month',
      startDate: format(startOfMonth(now), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      endDate: format(endOfDay(now), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    }
  };
}