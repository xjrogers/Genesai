import { useMemo } from 'react';
import { useCallMetrics } from './stats/useCallMetrics';
import { useCostMetrics } from './stats/useCostMetrics';
import { useDurationMetrics } from './stats/useDurationMetrics';
import { formatCurrency } from '../../utils/formatters/currencyFormatter';
import { formatNumber } from '../../utils/formatters/numberFormatter';
import { formatDuration } from '../../utils/time/durationCalculator';
import type { Call } from '../../types';
import { logger } from '../../utils/logger';

export interface DashboardStat {
  name: string;
  value: string;
  type: 'calls' | 'cost' | 'duration' | 'success';
}

export function useDashboardStats(calls: Call[]): DashboardStat[] {
  const { totalCalls, successRate } = useCallMetrics(calls);
  const { totalCost } = useCostMetrics(calls);
  const { avgDuration } = useDurationMetrics(calls);

  return useMemo(() => {
    try {
      logger.debug('Generating dashboard stats', {
        totalCalls,
        totalCost,
        avgDuration,
        successRate
      });

      return [
        {
          name: 'Total Calls',
          value: formatNumber(totalCalls),
          type: 'calls'
        },
        {
          name: 'Total Cost',
          value: formatCurrency(totalCost),
          type: 'cost'
        },
        {
          name: 'Avg. Duration',
          value: formatDuration(avgDuration),
          type: 'duration'
        },
        {
          name: 'Success Rate',
          value: `${successRate.toFixed(1)}%`,
          type: 'success'
        }
      ];
    } catch (error) {
      logger.error('Error generating dashboard stats:', { error });
      return [];
    }
  }, [totalCalls, totalCost, avgDuration, successRate]);
}