import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDataSync } from '../dashboard/useDataSync';
import type { DateFilterOption } from '../../types/filters';
import { logger } from '../../utils/logger';

export function useFilterSync() {
  const [searchParams] = useSearchParams();
  const { startSync } = useDataSync();

  useEffect(() => {
    const filter = (searchParams.get('dateFilter') || '7d') as DateFilterOption;
    
    logger.info('Filter changed, starting sync', { filter });
    startSync(filter);
  }, [searchParams, startSync]);
}