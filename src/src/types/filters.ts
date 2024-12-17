export type DateFilterOption = '24h' | '7d' | '30d' | 'month' | 'lastMonth';

export interface DateRange {
  startDate: string;
  endDate: string;
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