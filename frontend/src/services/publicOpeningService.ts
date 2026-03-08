import type { OpeningDetail, OpeningListItem } from '../types/opening';
import type { PageResponse } from '../types/common';
import { api } from './api';

export const publicOpeningService = {
  async getPublicOpenings(
    page = 0,
    size = 20,
    sort = 'createdAt',
    order = 'desc',
  ): Promise<PageResponse<OpeningListItem>> {
    return api.get<PageResponse<OpeningListItem>>(
      `/v1/public/openings?page=${page}&size=${size}&sort=${sort}&order=${order}`,
    );
  },

  async getPublicOpening(id: string): Promise<OpeningDetail> {
    return api.get<OpeningDetail>(`/v1/public/openings/${id}`);
  },

  async searchPublicOpenings(params: {
    q?: string;
    ecoCode?: string;
    moves?: string;
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
      `/v1/public/openings/search?${searchParams.toString()}`,
    );
  },
};
