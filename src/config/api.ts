export const API_CONFIG = {
  baseUrl: 'https://api.vapi.ai',
  wsUrl: 'wss://api.vapi.ai/ws',
  timeout: 30000, // 30 seconds
  retries: {
    max: 3,
    initialDelay: 1000,
    maxDelay: 10000
  },
  ws: {
    reconnectAttempts: 5,
    reconnectDelay: 5000,
    heartbeatInterval: 30000
  },
  cors: {
    mode: 'cors' as const,
    credentials: 'include' as const,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  errorMessages: {
    INITIALIZATION_FAILED: 'Failed to initialize API client - please check your credentials',
    INVALID_CREDENTIALS: 'Invalid or missing credentials',
    ASSISTANT_NOT_FOUND: 'Assistant not found or access denied - please check your Assistant ID',
    API_ACCESS_DENIED: 'API access denied - please check your API key',
    NETWORK_ERROR: 'Network error - please check your connection',
    CLIENT_NOT_INITIALIZED: 'Client not initialized - please login first',
    VALIDATION_FAILED: 'Validation failed - please check your credentials',
    CORS_ERROR: 'CORS error - unable to connect to API. Please check your API configuration.',
    WS_CONNECTION_FAILED: 'WebSocket connection failed - real-time updates may be delayed',
    WS_RECONNECTING: 'Reconnecting to real-time updates...',
    WS_RECONNECTED: 'Real-time updates restored',
    WS_MAX_RETRIES: 'Unable to establish real-time connection - please refresh the page'
  }
} as const;