import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  startOfMonth, 
  endOfMonth, 
  endOfDay, 
  subHours, 
  subDays, 
  startOfDay,
  subMonths 
} from 'date-fns';
import { formatDateToUTC } from '../utils/filters/dateUtils';
import { logger } from '../utils/logger';
import type { DateFilterOption } from '../types/filters';

interface DateRangeState {
  startDate: string;
  endDate: string;
  selectedFilter: DateFilterOption;
  isUpdating: boolean;
  setDateRange: (filter: DateFilterOption) => void;
  setCustomDateRange: (start: string, end: string) => void;
  setIsUpdating: (isUpdating: boolean) => void;
  reset: () => void;
}

const calculateDateRange = (filter: DateFilterOption) => {
  const now = new Date();
  let start: Date;
  let end: Date = now;

  switch (filter) {
    case '24h':
      start = subHours(now, 24);
      break;
    case '30d':
      start = startOfDay(subDays(now, 30));
      break;
    case 'month':
      start = startOfMonth(now);
      end = endOfDay(now);
      break;
    case 'lastMonth':
      // Get the first day of the previous month
      start = startOfMonth(subMonths(now, 1));
      // Get the last day of the previous month
      end = endOfMonth(subMonths(now, 1));
      break;
    case '7d':
    default:
      start = startOfDay(subDays(now, 7));
  }

  const startDate = formatDateToUTC(start);
  const endDate = formatDateToUTC(end);

  logger.debug('Calculated date range:', { filter, startDate, endDate });
  
  return { startDate, endDate };
};

export const useDateRangeStore = create<DateRangeState>()(
  persist(
    (set) => ({
      ...calculateDateRange('7d'),
      selectedFilter: '7d',
      isUpdating: false,
      setDateRange: (filter) => {
        const { startDate, endDate } = calculateDateRange(filter);
        set({ startDate, endDate, selectedFilter: filter });
        
        logger.info('Date range updated:', { 
          filter,
          dateRange: { startDate, endDate }
        });
      },
      setCustomDateRange: (start, end) => {
        set({
          startDate: start,
          endDate: end,
          selectedFilter: '7d'
        });
      },
      setIsUpdating: (isUpdating) => set({ isUpdating }),
      reset: () => set({
        ...calculateDateRange('7d'),
        selectedFilter: '7d',
        isUpdating: false
      })
    }),
    {
      name: 'date-range-store',
      version: 1
    }
  )
); 