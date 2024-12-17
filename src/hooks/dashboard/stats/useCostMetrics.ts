import { useMemo } from 'react';
import type { Call } from '../../../types';
import { logger } from '../../../utils/logger';

export function useCostMetrics(calls: Call[]) {
  return useMemo(() => {
    try {
      const totalCost = calls.reduce((acc, call) => {
        const baseCost = call.cost || 0;
        const breakdownCost = call.costBreakdown ? (
          (call.costBreakdown.llm || 0) +
          (call.costBreakdown.stt || 0) +
          (call.costBreakdown.tts || 0) +
          (call.costBreakdown.vapi || 0)
        ) : 0;
        return acc + Math.max(baseCost, breakdownCost);
      }, 0);

      logger.debug('Cost metrics calculated', { totalCost });

      return { totalCost };
    } catch (error) {
      logger.error('Error calculating cost metrics:', { error });
      return { totalCost: 0 };
    }
  }, [calls]);
}