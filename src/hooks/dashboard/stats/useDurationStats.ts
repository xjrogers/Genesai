import { useMemo } from 'react';
import type { Call } from '../../../types';
import { calculateDuration } from '../../../utils/time/durationCalculator';
import { logger } from '../../../utils/logger';

export function useDurationStats(calls: Call[]) {
  return useMemo(() => {
    try {
      const totalDuration = calls.reduce((acc, call) => {
        if (!call.startedAt || !call.endedAt) return acc;
        return acc + calculateDuration(call.startedAt, call.endedAt);
      }, 0);
      
      const avgDuration = calls.length > 0 ? totalDuration / calls.length / 60000 : 0;
      return { avgDuration: `${avgDuration.toFixed(1)}m` };
    } catch (error) {
      logger.error('Error calculating duration stats:', { error });
      return { avgDuration: '0.0m' };
    }
  }, [calls]);
}