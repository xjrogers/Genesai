import { VapiClient } from '../api/client';
import type { Call } from '../types/Call';
import type { Assistant } from '../types/Assistant';
import type { AnalyticsQueryResult } from '../types/AnalyticsQueryResult';

export class VapiService {
  private static client: VapiClient | null = null;

  static initialize(privateApiKey: string) {
    this.client = new VapiClient({
      token: privateApiKey,
      environment: 'https://api.vapi.ai'
    });
  }

  static getClient(): VapiClient {
    if (!this.client) {
      throw new Error('VapiService not initialized');
    }
    return this.client;
  }

  static async validateCredentials(credentials: {
    privateApiKey: string;
    publicApiKey: string;
    organizationId: string;
    assistantId: string;
  }): Promise<void> {
    try {
      const tempClient = new VapiClient({
        token: credentials.privateApiKey,
      });

      await Promise.all([
        tempClient.assistants().get(credentials.assistantId),
        tempClient.calls().list({ limit: 1 })
      ]);
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  }

  static async getCalls(): Promise<Call[]> {
    return await this.getClient().calls().list();
  }

  static async getAssistants(): Promise<Assistant[]> {
    return await this.getClient().assistants().list();
  }

  static async getAnalytics(): Promise<AnalyticsQueryResult[]> {
    return await this.getClient().analytics().get({
      queries: [{
        table: 'call',
        name: 'Call Metrics',
        operations: [
          { operation: 'count', column: 'id' },
          { operation: 'sum', column: 'cost' },
          { operation: 'avg', column: 'duration' }
        ]
      }]
    });
  }

  static resetClient() {
    this.client = null;
  }
}