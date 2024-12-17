import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import type { DateRange } from '../../types/filters';

export function getDefaultDateRange(): DateRange {
  return {
    startDate: format(startOfDay(subDays(new Date(), 7)), 'yyyy-MM-dd'),
    endDate: format(endOfDay(new Date()), 'yyyy-MM-dd')
  };
}

export function validateDateRange(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return start <= end && end <= new Date();
}

export function formatDateForDisplay(date: string): string {
  return format(new Date(date), 'MMM d, yyyy');
}