import type { Call } from '../../types';
import { logger } from '../logger';

export function calculateTotalCost(calls: Call[]): number {
  try {
    return calls.reduce((acc, call) => {
      const baseCost = call.cost || 0;
      const breakdownCost = call.costBreakdown ? (
        (call.costBreakdown.llm || 0) +
        (call.costBreakdown.stt || 0) +
        (call.costBreakdown.tts || 0) +
        (call.costBreakdown.vapi || 0)
      ) : 0;
      return acc + Math.max(baseCost, breakdownCost);
    }, 0);
  } catch (error) {
    logger.error('Error calculating total cost:', { error });
    return 0;
  }
}

export function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    logger.error('Error formatting currency:', { error });
    return '$0.00';
  }
}