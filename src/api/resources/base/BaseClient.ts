import { handleApiError } from '../../../utils/errors';

export abstract class BaseClient {
  constructor(
    protected readonly baseUrl: string,
    protected readonly token: string
  ) {}

  protected async request<T>(endpoint: string, config: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          ...config.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  protected get<T>(endpoint: string, config: RequestInit = {}) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  protected post<T>(endpoint: string, data?: unknown, config: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected patch<T>(endpoint: string, data?: unknown, config: RequestInit = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected delete<T>(endpoint: string, config: RequestInit = {}) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}