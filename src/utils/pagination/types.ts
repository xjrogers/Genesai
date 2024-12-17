// src/utils/pagination/types.ts
export interface PaginationParams {
  limit: number;
  cursor?: string;
}

export interface PaginationConfig {
  batchSize?: number;
  onProgress?: (progress: number) => void;
  maxItems?: number;
}

export interface BatchInfo {
  batchNumber: number;
  totalFetched: number;
  hasMore: boolean;
}
