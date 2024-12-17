import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths, subHours } from 'date-fns';

export type DateRangeType = '24h' | '7d' | '30d' | 'month' | 'lastMonth' | 'custom';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export function isValidDateString(dateStr: string): boolean {
  try {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
}

export function isValidDateRange(startDate?: string, endDate?: string): boolean {
  if (!startDate && !endDate) return true;
  if (startDate && !isValidDateString(startDate)) return false;
  if (endDate && !isValidDateString(endDate)) return false;
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
  }
  
  return true;
}

export function getDateRangeFromType(type: DateRangeType): DateRange {
  const now = new Date();

  switch (type) {
    case '24h':
      return {
        startDate: subHours(now, 24),
        endDate: now
      };
    case '7d':
      return {
        startDate: startOfDay(subDays(now, 7)),
        endDate: now
      };
    case '30d':
      return {
        startDate: startOfDay(subDays(now, 30)),
        endDate: now
      };
    case 'month':
      return {
        startDate: startOfMonth(now),
        endDate: now
      };
    case 'lastMonth': {
      const lastMonth = subMonths(now, 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth)
      };
    }
    case 'custom':
    default:
      return {
        startDate: startOfDay(subDays(now, 7)),
        endDate: now
      };
  }
}

export function formatDateForApi(date: Date): string {
  try {
    return date.toISOString();
  } catch (error) {
    throw new Error(`Invalid date: ${date}`);
  }
}

export function getDateRangeParams(type: DateRangeType) {
  const { startDate, endDate } = getDateRangeFromType(type);
  return {
    startDate: formatDateForApi(startDate),
    endDate: formatDateForApi(endDate)
  };
} 