// src/store/useDateRangeStore.ts
import { create } from 'zustand';
import type { DateFilterOption } from '../types/filters';
import { logger } from '../utils/logger';

interface DateRangeState {
  selectedFilter: DateFilterOption | null;
  isUpdating: boolean;
  setDateRange: (filter: DateFilterOption) => void;
  setIsUpdating: (isUpdating: boolean) => void;
}

const DEFAULT_FILTER: DateFilterOption = '7d';

export const useDateRangeStore = create<DateRangeState>((set, get) => ({
  selectedFilter: null,
  isUpdating: false,
  setDateRange: (filter: DateFilterOption) => {
    const prevFilter = get().selectedFilter;
    logger.info('Setting date range filter:', {
      prevFilter,
      newFilter: filter,
      timestamp: new Date().toISOString()
    });
    set({ selectedFilter: filter });
  },
  setIsUpdating: (isUpdating: boolean) => {
    const currentFilter = get().selectedFilter || DEFAULT_FILTER;
    logger.debug('Setting update state:', {
      isUpdating,
      currentFilter,
      timestamp: new Date().toISOString()
    });
    set({ isUpdating });
  }
}));
