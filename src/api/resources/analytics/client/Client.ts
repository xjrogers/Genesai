import type { AnalyticsQueryResult } from '../types';
import { BaseClient } from '../../base/BaseClient';

export class Analytics extends BaseClient {
  async get(params: { queries: Array<{ table: string; name: string; operations: Array<{ operation: string; column: string }> }> }): Promise<AnalyticsQueryResult[]> {
    const response = await this.post<AnalyticsQueryResult[]>('/analytics', params);
    return response;
  }
}