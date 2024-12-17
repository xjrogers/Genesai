import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Call } from '../../types';
import { isWithinDateRange } from '../../utils/filters/dateUtils';
import { matchesSearchTerm } from '../../utils/filters/searchUtils';
import { logger } from '../../utils/logger';

export function useCallFilters() {
  const [searchParams] = useSearchParams();

  const filterCalls = useCallback((calls: Call[]) => {
    try {
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const search = searchParams.get('search')?.toLowerCase() || '';
      const status = searchParams.get('status');

      return calls.filter(call => {
        // Date range filter
        if (startDate && endDate && call.startedAt) {
          if (!isWithinDateRange(new Date(call.startedAt), new Date(startDate), new Date(endDate))) {
            return false;
          }
        }

        // Status filter
        if (status && status !== 'all' && call.status !== status) {
          return false;
        }

        // Search filter
        if (search) {
          return matchesSearchTerm(call, search);
        }

        return true;
      });
    } catch (error) {
      logger.error('Error filtering calls:', { error });
      return calls;
    }
  }, [searchParams]);

  const getFilterSummary = useCallback(() => {
    const total = searchParams.get('total');
    const filtered = searchParams.get('filtered');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');

    return {
      total: total ? parseInt(total) : 0,
      filtered: filtered ? parseInt(filtered) : 0,
      dateRange: startDate && endDate ? { startDate, endDate } : null,
      searchTerm: search || null
    };
  }, [searchParams]);

  return {
    filterCalls,
    getFilterSummary
  };
}