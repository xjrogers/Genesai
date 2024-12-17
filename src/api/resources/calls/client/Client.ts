import type { Call, CallCreateRequest, CallUpdateRequest, CallListRequest } from '../types';
import { BaseClient } from '../../base/BaseClient';

export class Calls extends BaseClient {
  async list(params: CallListRequest = {}): Promise<Call[]> {
    return this.get<Call[]>('/call', { params });
  }

  async create(data: CallCreateRequest): Promise<Call> {
    return this.post<Call>('/call', data);
  }

  async get(id: string): Promise<Call> {
    return this.get<Call>(`/call/${id}`);
  }

  async update(id: string, data: CallUpdateRequest): Promise<Call> {
    return this.patch<Call>(`/call/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.delete(`/call/${id}`);
  }
}