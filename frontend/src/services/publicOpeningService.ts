import type { Page } from '../types/common';
import type { OpeningDetail, OpeningListItem } from '../types/opening';
import { apiClient } from './apiClient';

export const publicOpeningService = {
  async getPublicOpenings(page = 0, size = 20): Promise<Page<OpeningListItem>> {
    return apiClient.get<Page<OpeningListItem>>(
      `/v1/public/openings?page=${page}&size=${size}`,
      false,
    );
  },

  async getPublicOpening(id: string): Promise<OpeningDetail> {
    return apiClient.get<OpeningDetail>(`/v1/public/openings/${id}`, false);
  },

  async searchPublicOpenings(
    query: string,
    page = 0,
    size = 20,
  ): Promise<Page<OpeningListItem>> {
    return apiClient.get<Page<OpeningListItem>>(
      `/v1/public/openings/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
      false,
    );
  },
};
