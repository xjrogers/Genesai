// src/hooks/data/types.ts
export interface UseOverviewDataProps {
  startDate?: string;
  endDate?: string;
}

export interface UseOverviewDataReturn {
  fetchData: () => Promise<void>;
}
