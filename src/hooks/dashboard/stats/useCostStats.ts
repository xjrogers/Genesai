import { useMemo } from 'react';
import type { Call } from '../../../types';
import { formatCurrency } from '../../../utils/formatters/currencyFormatter';
import { logger } from '../../../utils/logger';

export function useCostStats(calls: Call[]) {
  return useMemo(() => {
    try {
      const totalCost = calls.reduce((acc, call) => acc + (call.cost || 0), 0);
      return { totalCost: formatCurrency(totalCost) };
    } catch (error) {
      logger.error('Error calculating cost stats:', { error });
      return { totalCost: formatCurrency(0) };
    }
  }, [calls]);
}