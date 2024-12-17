import VapiSDK from '@vapi-ai/web';

export interface Call {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  duration: number;
  transcript?: string;
  metadata?: Record<string, any>;
  assistantId?: string;
  customer?: {
    name?: string;
    number?: string;
  };
  cost?: number;
  endedReason?: string;
  analysis?: {
    summary?: string;
  };
  _lastUpdate?: string;
  [key: string]: any;
}

export interface Assistant {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  [key: string]: any;
}

export interface AnalyticsQueryResult {
  id: string;
  timestamp: string;
  metric: string;
  value: number;
  metadata?: Record<string, any>;
  [key: string]: any;
}

// Export the SDK client type
export type SDKClient = typeof VapiSDK;