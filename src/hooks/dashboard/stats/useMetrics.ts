import { useMemo } from 'react';
import type { Call } from '../../../types';
import { calculateTotalCost } from '../../../utils/cost/costCalculator';
import { calculateAverageDuration } from '../../../utils/time/durationCalculator';
import { logger } from '../../../utils/logger';

export function useMetrics(calls: Call[]) {
  return useMemo(() => {
    try {
      // Calculate total calls
      const totalCalls = calls.length;

      // Calculate total cost
      const totalCost = calculateTotalCost(calls);

      // Calculate average duration
      const avgDuration = calculateAverageDuration(calls);

      // Calculate success rate
      const successfulCalls = calls.filter(call => 
        call.status === 'ended' && 
        !call.endedReason?.includes('error') &&
        !call.endedReason?.includes('failed')
      ).length;
      
      const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;

      logger.debug('Metrics calculated', {
        totalCalls,
        totalCost,
        avgDuration,
        successRate,
        successfulCalls
      });

      return {
        totalCalls,
        totalCost,
        avgDuration,
        successRate
      };
    } catch (error) {
      logger.error('Error calculating metrics:', { error });
      return {
        totalCalls: 0,
        totalCost: 0,
        avgDuration: 0,
        successRate: 0
      };
    }
  }, [calls]);
}