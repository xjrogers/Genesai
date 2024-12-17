// src/hooks/cost/useCostDisplay.ts
import { useCallback } from 'react';
import { formatCurrency } from '../../utils/cost/costCalculator';

export function useCostDisplay() {
  const formatCost = useCallback((amount: number) => {
    return formatCurrency(amount);
  }, []);

  return { formatCost };
}
