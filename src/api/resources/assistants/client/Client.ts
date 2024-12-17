import type { Assistant, AssistantCreateRequest, AssistantUpdateRequest, AssistantListRequest } from '../types';
import { BaseClient } from '../../base/BaseClient';

export class Assistants extends BaseClient {
  async list(params: AssistantListRequest = {}): Promise<Assistant[]> {
    return this.get<Assistant[]>('/assistant', { params });
  }

  async create(data: AssistantCreateRequest): Promise<Assistant> {
    return this.post<Assistant>('/assistant', data);
  }

  async get(id: string): Promise<Assistant> {
    return this.get<Assistant>(`/assistant/${id}`);
  }

  async update(id: string, data: AssistantUpdateRequest): Promise<Assistant> {
    return this.patch<Assistant>(`/assistant/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.delete(`/assistant/${id}`);
  }
}