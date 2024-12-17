import { useState, useCallback } from 'react';
import { useFilteredData } from '../data/useFilteredData';
import { getDateRangeForFilter } from '../../utils/filters/dateFilters';
import type { DateFilterOption } from '../../types/filters';
import { logger } from '../../utils/logger';

export function useDateFilter() {
  const { fetchData } = useFilteredData();
  const [selectedFilter, setSelectedFilter] = useState<DateFilterOption>('7d');
  const [isUpdating, setIsUpdating] = useState(false);

  const updateFilter = useCallback(async (filter: DateFilterOption) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      const { startDate, endDate } = getDateRangeForFilter(filter);
      
      logger.info('Updating date filter', {
        filter,
        dateRange: { startDate, endDate }
      });

      setSelectedFilter(filter);
      await fetchData(startDate, endDate);
    } catch (error) {
      logger.error('Error updating filter:', { error });
    } finally {
      setIsUpdating(false);
    }
  }, [fetchData, isUpdating]);

  return {
    selectedFilter,
    updateFilter,
    isUpdating
  };
}