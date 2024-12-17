declare module '@vapi-ai/web' {
  export interface VapiSDKOptions {
    apiKey: string;
    baseUrl?: string;
  }

  export interface CallsAPI {
    list(params?: {
      startDate?: string;
      endDate?: string;
      limit?: number;
      cursor?: string;
      signal?: AbortSignal;
    }): Promise<Call[]>;
    get(callId: string): Promise<Call>;
  }

  export interface AssistantsAPI {
    list(): Promise<Assistant[]>;
    get(assistantId: string): Promise<Assistant>;
    update(assistantId: string, updates: Partial<Assistant>): Promise<Assistant>;
  }

  export interface AnalyticsAPI {
    query(params: {
      startDate: string;
      endDate: string;
      metrics: string[];
    }): Promise<AnalyticsQueryResult[]>;
  }

  export interface VapiSDK {
    calls: CallsAPI;
    assistants: AssistantsAPI;
    analytics: AnalyticsAPI;
  }

  const createClient: (options: VapiSDKOptions) => VapiSDK;
  export default createClient;
} 