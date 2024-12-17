import { useMemo } from 'react';
import type { Call } from '../../../types';
import { logger } from '../../../utils/logger';

export function useStatsData(calls: Call[]) {
  return useMemo(() => {
    try {
      // Calculate total calls
      const totalCalls = calls.length;

      // Calculate total cost including all components
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

      // Calculate average duration
      const totalDuration = calls.reduce((acc, call) => {
        if (!call.startedAt || !call.endedAt) return acc;
        return acc + (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime());
      }, 0);
      
      const avgDuration = totalCalls > 0 ? totalDuration / totalCalls / 60000 : 0;

      // Calculate success rate
      const successfulCalls = calls.filter(call => 
        call.status === 'ended' && 
        !call.endedReason?.includes('error') &&
        !call.endedReason?.includes('failed')
      ).length;
      
      const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;

      logger.debug('Stats calculated', {
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
      logger.error('Error calculating stats:', { error });
      return {
        totalCalls: 0,
        totalCost: 0,
        avgDuration: 0,
        successRate: 0
      };
    }
  }, [calls]);
}