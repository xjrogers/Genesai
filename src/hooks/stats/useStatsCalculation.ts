// src/hooks/stats/useStatsCalculation.ts
import { useMemo } from 'react';
import { parseISO, isWithinInterval } from 'date-fns';
import { formatCurrency } from '../../utils/cost/costCalculator';
import type { Call } from '../../types';
import { logger } from '../../utils/logger';

interface StatItem {
  name: string;
  value: string;
  iconName: 'phone' | 'trending-up' | 'clock' | 'users';
  color: string;
}

export function useStatsCalculation(calls: Call[], startDate: string, endDate: string): StatItem[] {
  return useMemo(() => {
    try {
      // Parse dates
      const start = parseISO(startDate);
      const end = parseISO(endDate);

      // Filter calls within date range
      const filteredCalls = calls.filter(call => {
        if (!call.startedAt) return false;
        const callDate = parseISO(call.startedAt);
        return isWithinInterval(callDate, { start, end });
      });

      // Calculate metrics
      const totalCalls = filteredCalls.length;
      const totalCost = filteredCalls.reduce((acc, call) => acc + (call.cost || 0), 0);

      // Calculate average duration
      const totalDuration = filteredCalls.reduce((acc, call) => {
        if (call.startedAt && call.endedAt) {
          return acc + (parseISO(call.endedAt).getTime() - parseISO(call.startedAt).getTime());
        }
        return acc;
      }, 0);
      
      const avgDuration = totalCalls > 0 ? totalDuration / totalCalls / 60000 : 0;

      // Calculate success rate
      const successfulCalls = filteredCalls.filter(call => 
        call.status === 'ended' && !call.endedReason?.includes('error')
      ).length;
      
      const successRate = totalCalls > 0 ? (successfulCalls / totalCalls * 100) : 0;

      logger.debug('Stats calculated:', {
        totalCalls,
        totalCost,
        avgDuration,
        successRate,
        dateRange: { startDate, endDate }
      });

      return [
        {
          name: 'Total Calls',
          value: totalCalls.toString(),
          iconName: 'phone',
          color: 'text-blue-600'
        },
        {
          name: 'Total Cost',
          value: formatCurrency(totalCost),
          iconName: 'trending-up',
          color: 'text-green-600'
        },
        {
          name: 'Avg. Duration',
          value: `${avgDuration.toFixed(1)}m`,
          iconName: 'clock',
          color: 'text-indigo-600'
        },
        {
          name: 'Success Rate',
          value: `${successRate.toFixed(1)}%`,
          iconName: 'users',
          color: 'text-purple-600'
        }
      ];
    } catch (error) {
      logger.error('Error calculating stats:', { error });
      return [
        { name: 'Total Calls', value: '0', iconName: 'phone', color: 'text-blue-600' },
        { name: 'Total Cost', value: '$0.00', iconName: 'trending-up', color: 'text-green-600' },
        { name: 'Avg. Duration', value: '0.0m', iconName: 'clock', color: 'text-indigo-600' },
        { name: 'Success Rate', value: '0.0%', iconName: 'users', color: 'text-purple-600' }
      ];
    }
  }, [calls, startDate, endDate]);
}
