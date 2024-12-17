import { AuthService } from '../auth/authService';
import type { Call, Assistant, AnalyticsQueryResult } from '../../api/types';
import { handleApiError } from '../../utils/errors';

export class VapiService {
  static async getCalls(): Promise<Call[]> {
    try {
      const client = AuthService.getInstance().getClient();
      return await client.listCalls();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getAssistants(): Promise<Assistant[]> {
    try {
      const client = AuthService.getInstance().getClient();
      return await client.listAssistants();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async getAnalytics(): Promise<AnalyticsQueryResult[]> {
    try {
      const client = AuthService.getInstance().getClient();
      return await client.getAnalytics({
        timeRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        },
        metrics: [
          { name: 'total_calls', aggregation: 'count', field: 'id' },
          { name: 'total_cost', aggregation: 'sum', field: 'cost' },
          { name: 'avg_duration', aggregation: 'avg', field: 'duration' }
        ]
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}