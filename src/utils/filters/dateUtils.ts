// src/utils/filters/dateUtils.ts
import { isValid, parseISO, startOfDay, endOfDay } from 'date-fns';
import { format } from 'date-fns-tz';
import { logger } from '../logger';

export function formatDateToUTC(date: Date): string {
  try {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { timeZone: 'UTC' });
  } catch (error) {
    logger.error('Error formatting date to UTC:', { error, date });
    return new Date().toISOString();
  }
}

export function isWithinDateRange(date: Date, start: Date, end: Date): boolean {
  try {
    if (!isValid(date) || !isValid(start) || !isValid(end)) {
      return false;
    }

    const startOfRange = startOfDay(start);
    const endOfRange = endOfDay(end);
    
    return date >= startOfRange && date <= endOfRange;
  } catch (error) {
    logger.error('Error checking date range:', { error });
    return false;
  }
}

export function parseAndValidateDate(dateStr: string): Date | null {
  try {
    const date = parseISO(dateStr);
    return isValid(date) ? date : null;
  } catch (error) {
    logger.error('Error parsing date:', { error, dateStr });
    return null;
  }
}
