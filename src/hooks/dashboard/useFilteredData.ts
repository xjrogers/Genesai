import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDataFetching } from './useDataFetching';
import { getDateRangeForFilter } from '../../utils/filters/dateFilters';
import type { DateFilterOption } from '../../types/filters';
import { logger } from '../../utils/logger';

export function useFilteredData() {
  const [searchParams] = useSearchParams();
  const { fetchData } = useDataFetching();

  const selectedFilter = (searchParams.get('dateFilter') || '7d') as DateFilterOption;

  const refreshData = useCallback(async () => {
    try {
      const { startDate, endDate } = getDateRangeForFilter(selectedFilter);
      
      logger.info('Refreshing filtered data', {
        filter: selectedFilter,
        dateRange: { startDate, endDate }
      });

      await fetchData(startDate, endDate);
    } catch (error) {
      logger.error('Error refreshing data:', { error });
    }
  }, [selectedFilter, fetchData]);

  // Initial load and filter changes
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return { refreshData };
}