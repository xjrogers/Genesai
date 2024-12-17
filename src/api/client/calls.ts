import { ApiClient } from './base';
import type { Call } from '../../types/Call';

export class CallsApi extends ApiClient {
  async list(): Promise<Call[]> {
    return this.get<Call[]>('/call');
  }

  async get(id: string): Promise<Call> {
    return this.get<Call>(`/call/${id}`);
  }

  async create(data: Partial<Call>): Promise<Call> {
    return this.post<Call>('/call', data);
  }

  async update(id: string, data: Partial<Call>): Promise<Call> {
    return this.patch<Call>(`/call/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.delete(`/call/${id}`);
  }
}