import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import type { Assistant } from '../../types';

export interface AssistantFilters {
  search: string;
}

const defaultFilters: AssistantFilters = {
  search: ''
};

export function useAssistantFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: AssistantFilters = {
    search: searchParams.get('search') || defaultFilters.search
  };

  const updateFilters = useCallback((newFilters: Partial<AssistantFilters>) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== defaultFilters[key as keyof AssistantFilters]) {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });

    setSearchParams(updatedParams);
  }, [searchParams, setSearchParams]);

  const filterAssistants = useCallback((assistants: Assistant[]) => {
    return assistants.filter(assistant => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          assistant.name?.toLowerCase().includes(searchTerm) ||
          assistant.id.toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
  }, [filters]);

  return {
    filters,
    updateFilters,
    filterAssistants
  };
}