import { useEffect, useRef } from 'react';
import { useVapi } from '../../contexts/vapi';
import { useFilteredData } from './useFilteredData';
import { getDateRangeForFilter } from '../../utils/filters/dateFilters';
import { logger } from '../../utils/logger';

export function useInitialData() {
  const { client, loading } = useVapi();
  const { fetchData } = useFilteredData();
  const initializeRef = useRef(false);

  useEffect(() => {
    async function initializeData() {
      if (!client || initializeRef.current) return;
      
      try {
        initializeRef.current = true;
        const { startDate, endDate } = getDateRangeForFilter('7d');
        await fetchData(startDate, endDate);
      } catch (error) {
        logger.error('Failed to initialize data:', { error });
      }
    }

    initializeData();
  }, [client, fetchData]);

  return { loading };
}