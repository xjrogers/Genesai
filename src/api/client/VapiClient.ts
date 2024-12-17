import createClient, { VapiSDK } from '@vapi-ai/web';
import { EventEmitter } from 'events';
import { logger } from '../../utils/logger';
import type { Call, Assistant, AnalyticsQueryResult } from '../../types';
import { API_CONFIG } from '../../config/api';

interface VapiEvents {
  callUpdate: (call: Call) => void;
  connectionChange: (status: boolean) => void;
  assistantUpdate: (assistant: Assistant) => void;
}

interface GetCallsParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
  cursor?: string;
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
}

export class VapiClient extends EventEmitter {
  private sdk: VapiSDK;
  private ws: WebSocket | null = null;
  private _isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private apiKey: string;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(apiKey: string, options?: { baseUrl?: string }) {
    super();
    if (!apiKey) {
      throw new Error(API_CONFIG.errorMessages.INVALID_CREDENTIALS);
    }

    this.apiKey = apiKey;
    this.sdk = createClient({
      apiKey,
      baseUrl: options?.baseUrl || API_CONFIG.baseUrl
    });

    this.setupWebSocket();
    this.startHeartbeat();
    logger.info('VapiClient initialized');
  }

  private setupWebSocket() {
    try {
      const wsUrl = `${API_CONFIG.wsUrl}?token=${this.apiKey}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this._isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connectionChange', true);
        logger.info('WebSocket connection established');
        
        // Subscribe to real-time updates
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ 
            type: 'subscribe', 
            channels: ['calls', 'assistants'] 
          }));
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'call_update' && data.call) {
            this.emit('callUpdate', data.call);
          } else if (data.type === 'assistant_update' && data.assistant) {
            this.emit('assistantUpdate', data.assistant);
          } else if (data.type === 'pong') {
            logger.debug('Heartbeat pong received');
          }
        } catch (error) {
          logger.error('Failed to parse WebSocket message:', { error });
        }
      };

      this.ws.onclose = () => {
        this._isConnected = false;
        this.emit('connectionChange', false);
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        logger.error('WebSocket error:', { error });
        this._isConnected = false;
        this.emit('connectionChange', false);
      };
    } catch (error) {
      logger.error('Failed to setup WebSocket:', { error });
      this.handleReconnect();
    }
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, API_CONFIG.ws.heartbeatInterval);
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= API_CONFIG.ws.reconnectAttempts) {
      logger.error(API_CONFIG.errorMessages.WS_MAX_RETRIES);
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      logger.info(API_CONFIG.errorMessages.WS_RECONNECTING, {
        attempt: this.reconnectAttempts
      });
      this.setupWebSocket();
    }, API_CONFIG.ws.reconnectDelay * Math.pow(2, this.reconnectAttempts));
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  async getCalls(params: GetCallsParams = {}): Promise<Call[]> {
    try {
      const { startDate, endDate, limit = 100, cursor, signal, onProgress } = params;

      const response = await this.sdk.calls.list({
        startDate,
        endDate,
        limit,
        cursor,
        signal
      });

      if (!Array.isArray(response)) {
        throw new Error('Invalid response from API');
      }

      if (onProgress) {
        onProgress(100);
      }

      return response.map(call => ({
        ...call,
        _lastUpdate: new Date().toISOString()
      }));
    } catch (error) {
      logger.error('Failed to fetch calls:', { error });
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error('Invalid API key');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error - please check your connection');
        }
      }
      throw error;
    }
  }

  async getAssistants(): Promise<Assistant[]> {
    try {
      const response = await this.sdk.assistants.list();
      if (!Array.isArray(response)) {
        throw new Error('Invalid response from API');
      }
      return response;
    } catch (error) {
      logger.error('Failed to fetch assistants:', { error });
      throw error;
    }
  }

  async updateAssistant(assistantId: string, updates: Partial<Assistant>): Promise<Assistant> {
    try {
      const response = await this.sdk.assistants.update(assistantId, updates);
      if (!response) {
        throw new Error('Invalid response from API');
      }
      return response;
    } catch (error) {
      logger.error('Failed to update assistant:', { error });
      throw error;
    }
  }

  async getAnalytics(startDate: string, endDate: string): Promise<AnalyticsQueryResult[]> {
    try {
      const response = await this.sdk.analytics.query({
        startDate,
        endDate,
        metrics: ['calls', 'duration', 'cost']
      });
      return response;
    } catch (error) {
      logger.error('Failed to fetch analytics:', { error });
      throw error;
    }
  }

  // Type-safe event emitter methods
  on<K extends keyof VapiEvents>(event: K, listener: VapiEvents[K]): this {
    return super.on(event, listener);
  }

  off<K extends keyof VapiEvents>(event: K, listener: VapiEvents[K]): this {
    return super.off(event, listener);
  }

  emit<K extends keyof VapiEvents>(event: K, ...args: Parameters<VapiEvents[K]>): boolean {
    return super.emit(event, ...args);
  }

  cleanup() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
    this.ws = null;
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.removeAllListeners();
    logger.info('VapiClient cleanup completed');
  }
}