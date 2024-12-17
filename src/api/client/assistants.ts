import { ApiClient } from './base';
import type { Assistant } from '../../types/Assistant';

export class AssistantsApi extends ApiClient {
  async list(): Promise<Assistant[]> {
    return this.get<Assistant[]>('/assistant');
  }

  async get(id: string): Promise<Assistant> {
    return this.get<Assistant>(`/assistant/${id}`);
  }

  async create(data: Partial<Assistant>): Promise<Assistant> {
    return this.post<Assistant>('/assistant', data);
  }

  async update(id: string, data: Partial<Assistant>): Promise<Assistant> {
    return this.patch<Assistant>(`/assistant/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.delete(`/assistant/${id}`);
  }
}