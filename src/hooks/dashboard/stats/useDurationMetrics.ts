import { useMemo } from 'react';
import type { Call } from '../../../types';
import { logger } from '../../../utils/logger';

export function useDurationMetrics(calls: Call[]) {
  return useMemo(() => {
    try {
      const totalDuration = calls.reduce((acc, call) => {
        if (!call.startedAt || !call.endedAt) return acc;
        return acc + (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime());
      }, 0);
      
      const avgDuration = calls.length > 0 ? totalDuration / calls.length / 60000 : 0;

      logger.debug('Duration metrics calculated', { avgDuration });

      return { avgDuration };
    } catch (error) {
      logger.error('Error calculating duration metrics:', { error });
      return { avgDuration: 0 };
    }
  }, [calls]);
}