// src/utils/stats/successRateCalculator.ts
import type { Call } from '../../types';
import { logger } from '../logger';

export function calculateSuccessRate(calls: Call[]): string {
  try {
    if (calls.length === 0) return '0.0';

    const successfulCalls = calls.filter(call => 
      call.status === 'ended' && 
      !call.endedReason?.includes('error')
    ).length;

    const rate = (successfulCalls / calls.length) * 100;
    return rate.toFixed(1);
  } catch (error) {
    logger.error('Error calculating success rate:', { error });
    return '0.0';
  }
}
