// src/utils/date/formatters.ts
import { format } from 'date-fns';
import { logger } from '../logger';

export function formatISODate(date: Date): string {
  try {
    return date.toISOString();
  } catch (error) {
    logger.error('Error formatting ISO date:', { error, date });
    return new Date().toISOString();
  }
}

export function formatDisplayDate(date: Date): string {
  try {
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    logger.error('Error formatting display date:', { error, date });
    return 'Invalid Date';
  }
}
