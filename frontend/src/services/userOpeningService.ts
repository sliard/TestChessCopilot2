import { apiClient } from './apiClient';
import type { Page } from '../types/common';
import type {
  UserOpening,
  UserOpeningListItem,
  CreateOpeningRequest,
  UpdateOpeningRequest,
  UpdateVisibilityRequest,
} from '../types/opening';

const BASE_URL = '/v1/openings';

export const userOpeningService = {
  async getMyOpenings(params?: {
    page?: number;
    size?: number;
    sort?: string;
    order?: string;
    q?: string;
  }): Promise<Page<UserOpeningListItem>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.set('page', String(params.page));
    if (params?.size) searchParams.set('size', String(params.size));
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.order) searchParams.set('order', params.order);
    if (params?.q) searchParams.set('q', params.q);
    const query = searchParams.toString();
    return apiClient.get(`${BASE_URL}${query ? `?${query}` : ''}`);
  },

  async getOpening(id: string): Promise<UserOpening> {
    return apiClient.get(`${BASE_URL}/${id}`);
  },

  async createOpening(data: CreateOpeningRequest): Promise<UserOpening> {
    return apiClient.post(BASE_URL, data);
  },

  async updateOpening(id: string, data: UpdateOpeningRequest): Promise<UserOpening> {
    return apiClient.put(`${BASE_URL}/${id}`, data);
  },

  async deleteOpening(id: string): Promise<void> {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  async updateVisibility(id: string, data: UpdateVisibilityRequest): Promise<UserOpening> {
    return apiClient.patch(`${BASE_URL}/${id}/visibility`, data);
  },
};
