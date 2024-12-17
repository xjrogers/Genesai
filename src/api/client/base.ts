export interface ApiRequestConfig extends RequestInit {
  params?: Record<string, string>;
}

export abstract class ApiClient {
  protected constructor(
    protected readonly baseUrl: string,
    protected readonly token: string
  ) {}

  protected async request<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<T> {
    const { params, ...requestConfig } = config;
    
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      ...requestConfig,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...requestConfig.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  protected get<T>(endpoint: string, config: ApiRequestConfig = {}) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  protected post<T>(endpoint: string, data?: unknown, config: ApiRequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected patch<T>(endpoint: string, data?: unknown, config: ApiRequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected delete<T>(endpoint: string, config: ApiRequestConfig = {}) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}