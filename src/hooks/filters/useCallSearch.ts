import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Call } from '../../types';
import { logger } from '../../utils/logger';

export function useCallSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const updateSearch = useCallback((term: string) => {
    try {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }
      setSearchParams(params);
      logger.info('Search updated:', { term });
    } catch (error) {
      logger.error('Failed to update search:', { error });
    }
  }, [searchParams, setSearchParams]);

  const filterCalls = useCallback((calls: Call[]) => {
    if (!searchTerm) return calls;

    const normalized = searchTerm.toLowerCase();
    return calls.filter(call => {
      const phoneNumber = call.customer?.number || '';
      const name = call.name || '';
      const id = call.id || '';
      
      return (
        phoneNumber.toLowerCase().includes(normalized) ||
        name.toLowerCase().includes(normalized) ||
        id.toLowerCase().includes(normalized)
      );
    });
  }, [searchTerm]);

  return {
    searchTerm,
    updateSearch,
    filterCalls
  };
}