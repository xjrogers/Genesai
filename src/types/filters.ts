import type { DateRangeType } from '../utils/date/dateUtils';

export type DateFilterOption = DateRangeType;

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DateFilter {
  startDate: string | null;
  endDate: string | null;
  filter: DateFilterOption;
}

export interface FilterState {
  startDate: string;
  endDate: string;
  searchTerm: string;
  selectedPreset: string;
}

export interface FilterResult<T> {
  data: T[];
  total: number;
  filtered: number;
}