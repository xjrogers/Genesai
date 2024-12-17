import { useMemo } from 'react';
import type { Call } from '../../../types';
import { formatCurrency } from '../../../utils/formatters/currencyFormatter';
import { formatNumber } from '../../../utils/formatters/numberFormatter';
import { formatDuration } from '../../../utils/time/durationCalculator';
import { logger } from '../../../utils/logger';

export function useStatsCalculator(calls: Call[]) {
  return useMemo(() => {
    try {
      logger.debug('Calculating stats', { totalCalls: calls.length });

      // Calculate total calls
      const totalCalls = formatNumber(calls.length);

      // Calculate total cost with breakdown
      const totalCost = formatCurrency(calls.reduce((acc, call) => {
        const baseCost = call.cost || 0;
        const breakdownCost = call.costBreakdown ? (
          (call.costBreakdown.llm || 0) +
          (call.costBreakdown.stt || 0) +
          (call.costBreakdown.tts || 0) +
          (call.costBreakdown.vapi || 0)
        ) : 0;
        return acc + Math.max(baseCost, breakdownCost);
      }, 0));

      // Calculate average duration
      const totalDuration = calls.reduce((acc, call) => {
        if (!call.startedAt || !call.endedAt) return acc;
        return acc + (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime());
      }, 0);
      
      const avgDuration = formatDuration(calls.length > 0 ? totalDuration / calls.length / 60000 : 0);

      // Calculate success rate
      const successfulCalls = calls.filter(call => 
        call.status === 'ended' && 
        !call.endedReason?.includes('error') &&
        !call.endedReason?.includes('failed')
      ).length;
      
      const successRate = `${calls.length > 0 ? ((successfulCalls / calls.length) * 100).toFixed(1) : '0.0'}%`;

      const stats = {
        totalCalls,
        totalCost,
        avgDuration,
        successRate
      };

      logger.debug('Stats calculated', stats);

      return stats;
    } catch (error) {
      logger.error('Error calculating stats:', { error });
      return {
        totalCalls: '0',
        totalCost: '$0.00',
        avgDuration: '0.0m',
        successRate: '0.0%'
      };
    }
  }, [calls]);
}