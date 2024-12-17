import { useMemo } from 'react';
import type { Call } from '../../../types';
import { formatNumber } from '../../../utils/formatters/numberFormatter';
import { logger } from '../../../utils/logger';

export function useCallsStats(calls: Call[]) {
  return useMemo(() => {
    try {
      // Calculate total calls
      const totalCalls = formatNumber(calls.length);

      // Calculate success rate
      const successfulCalls = calls.filter(call => 
        call.status === 'ended' && !call.endedReason?.includes('error')
      ).length;
      
      const successRate = calls.length > 0 
        ? `${((successfulCalls / calls.length) * 100).toFixed(1)}%` 
        : '0%';

      logger.debug('Call stats calculated', {
        totalCalls,
        successfulCalls,
        successRate
      });

      return { totalCalls, successRate };
    } catch (error) {
      logger.error('Error calculating call stats:', { error });
      return { totalCalls: '0', successRate: '0%' };
    }
  }, [calls]);
}