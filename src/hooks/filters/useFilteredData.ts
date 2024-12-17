import { useMemo } from 'react';
import { useFilterState } from './useFilterState';
import { createSearchMatcher } from '../../utils/filters/searchUtils';
import { validateDateRange } from '../../utils/filters/dateRangeUtils';
import type { FilterResult } from '../../types/filters';

export function useFilteredData<T extends { createdAt: string }>(
  items: T[],
  getSearchableText: (item: T) => string
): FilterResult<T> {
  const { startDate, endDate, searchTerm } = useFilterState();

  return useMemo(() => {
    const matcher = createSearchMatcher(searchTerm);
    const isDateRangeValid = validateDateRange(startDate, endDate);

    const filtered = items.filter(item => {
      const matchesSearch = matcher(getSearchableText(item));
      
      if (!isDateRangeValid) return matchesSearch;
      
      const itemDate = new Date(item.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return matchesSearch && itemDate >= start && itemDate <= end;
    });

    return {
      data: filtered,
      total: items.length,
      filtered: filtered.length
    };
  }, [items, startDate, endDate, searchTerm, getSearchableText]);
}