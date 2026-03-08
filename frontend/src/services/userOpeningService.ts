import type { OpeningDetail, OpeningListItem, OpeningRequest } from '../types/opening';
import type { PageResponse } from '../types/common';
import { api } from './api';

export const userOpeningService = {
  async getMyOpenings(page = 0, size = 20): Promise<PageResponse<OpeningListItem>> {
    return api.get<PageResponse<OpeningListItem>>(`/v1/openings?page=${page}&size=${size}`);
  },

  async getMyOpening(id: string): Promise<OpeningDetail> {
    return api.get<OpeningDetail>(`/v1/openings/${id}`);
  },

  async createOpening(data: OpeningRequest): Promise<OpeningDetail> {
    return api.post<OpeningDetail>('/v1/openings', data);
  },

  async updateOpening(id: string, data: OpeningRequest): Promise<OpeningDetail> {
    return api.put<OpeningDetail>(`/v1/openings/${id}`, data);
  },

  async deleteOpening(id: string): Promise<void> {
    return api.delete<void>(`/v1/openings/${id}`);
  },

  async toggleVisibility(id: string): Promise<OpeningDetail> {
    return api.patch<OpeningDetail>(`/v1/openings/${id}/visibility`);
  },

  async searchMyOpenings(params: {
    q?: string;
    ecoCode?: string;
    moves?: string;
    visibility?: string;
    page?: number;
    size?: number;
    sort?: string;
    order?: string;
  }): Promise<PageResponse<OpeningListItem>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') searchParams.append(key, String(value));
    });
    return api.get<PageResponse<OpeningListItem>>(
      `/v1/openings/search?${searchParams.toString()}`,
    );
  },
};
