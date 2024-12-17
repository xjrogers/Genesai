import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterState } from '../../types/filters';

interface FilterStore extends FilterState {
  setDateRange: (startDate: string, endDate: string) => void;
  setSearchTerm: (search: string) => void;
  setPreset: (preset: string) => void;
  reset: () => void;
}

const initialState: FilterState = {
  startDate: '',
  endDate: '',
  searchTerm: '',
  selectedPreset: 'last7Days'
};

export const useFilterState = create<FilterStore>()(
  persist(
    (set) => ({
      ...initialState,
      setDateRange: (startDate, endDate) => set({ startDate, endDate }),
      setSearchTerm: (searchTerm) => set({ searchTerm }),
      setPreset: (selectedPreset) => set({ selectedPreset }),
      reset: () => set(initialState)
    }),
    {
      name: 'filter-state'
    }
  )
);