import { ApiClient } from './base';
import type { AnalyticsQueryResult } from '../../types/AnalyticsQueryResult';

export interface AnalyticsQuery {
  table: string;
  name: string;
  operations: Array<{
    operation: 'count' | 'sum' | 'avg';
    column: string;
  }>;
}

export class AnalyticsApi extends ApiClient {
  async query(queries: AnalyticsQuery[]): Promise<AnalyticsQueryResult[]> {
    return this.post<AnalyticsQueryResult[]>('/analytics', { queries });
  }
}