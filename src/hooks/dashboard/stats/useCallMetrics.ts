import { useMemo } from 'react';
import type { Call } from '../../../types';
import { logger } from '../../../utils/logger';

export function useCallMetrics(calls: Call[]) {
  return useMemo(() => {
    try {
      const totalCalls = calls.length;
      
      const successfulCalls = calls.filter(call => 
        call.status === 'ended' && 
        !call.endedReason?.includes('error') &&
        !call.endedReason?.includes('failed')
      ).length;
      
      const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;

      logger.debug('Call metrics calculated', {
        totalCalls,
        successfulCalls,
        successRate
      });

      return { totalCalls, successRate };
    } catch (error) {
      logger.error('Error calculating call metrics:', { error });
      return { totalCalls: 0, successRate: 0 };
    }
  }, [calls]);
}