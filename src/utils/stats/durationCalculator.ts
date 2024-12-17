// src/utils/stats/durationCalculator.ts
import type { Call } from '../../types';
import { logger } from '../logger';

export function calculateAverageDuration(calls: Call[]): number {
  try {
    if (calls.length === 0) return 0;

    const totalDuration = calls.reduce((acc, call) => {
      if (call.startedAt && call.endedAt) {
        return acc + (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime());
      }
      return acc;
    }, 0);

    // Convert to minutes
    return totalDuration / calls.length / 60000;
  } catch (error) {
    logger.error('Error calculating average duration:', { error });
    return 0;
  }
}
