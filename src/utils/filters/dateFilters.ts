import { startOfMonth, endOfDay, subHours, subDays, startOfDay } from 'date-fns';
import { formatISODate } from '../date/formatters';
import type { DateRange, DateFilterOption } from '../../types/filters';
import { logger } from '../logger';

export function getDateRangeForFilter(filter: DateFilterOption): DateRange {
  try {
    const now = new Date();
    let start: Date;
    const end = now; // Use current time, not end of day

    switch (filter) {
      case '24h':
        start = subHours(now, 24);
        break;
      case '30d':
        start = startOfDay(subDays(now, 30));
        break;
      case 'month':
        start = startOfMonth(now);
        break;
      case '7d':
      default:
        start = startOfDay(subDays(now, 7));
    }

    const range = {
      startDate: formatISODate(start),
      endDate: formatISODate(end)
    };

    logger.debug('Generated date range', { 
      filter, 
      range,
      currentTime: now.toISOString()
    });

    return range;
  } catch (error) {
    logger.error('Error calculating date range:', { error, filter });
    throw error;
  }
}