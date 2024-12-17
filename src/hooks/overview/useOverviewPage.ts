// src/hooks/overview/useOverviewPage.ts
import { useCallback, useRef, useEffect } from 'react';
import { useVapi } from '../../contexts/vapi';
import { useDateRangeFilter } from '../filters/useDateRangeFilter';
import { useOverviewData } from '../data/useOverviewData';

export function useOverviewPage() {
  const { loading, error } = useVapi();
  const { startDate, endDate } = useDateRangeFilter();
  const { fetchData } = useOverviewData();
  const initialLoadRef = useRef(false);

  const handleRefresh = useCallback(async () => {
    await fetchData(startDate, endDate);
  }, [fetchData, startDate, endDate]);

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      handleRefresh();
    }
  }, [handleRefresh]);

  return {
    loading,
    error,
    handleRefresh
  };
}
