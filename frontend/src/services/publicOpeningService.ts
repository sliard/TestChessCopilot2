import type { Page } from '../types/common';
import type { OpeningDetail, OpeningListItem } from '../types/opening';
import { apiClient } from './apiClient';

export interface OpeningSearchParams {
  q?: string;
  ecoCode?: string;
  moves?: string;
  sort?: string;
  order?: string;
  page?: number;
  size?: number;
}

export const publicOpeningService = {
  async getPublicOpenings(params: OpeningSearchParams = {}): Promise<Page<OpeningListItem>> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.ecoCode) searchParams.set('ecoCode', params.ecoCode);
    if (params.moves) searchParams.set('moves', params.moves);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.order) searchParams.set('order', params.order);
    searchParams.set('page', String(params.page ?? 0));
    searchParams.set('size', String(params.size ?? 20));

    const query = searchParams.toString();
    return apiClient.get<Page<OpeningListItem>>(
      `/v1/public/openings?${query}`,
      false,
    );
  },

  async getPublicOpening(id: string): Promise<OpeningDetail> {
    return apiClient.get<OpeningDetail>(`/v1/public/openings/${id}`, false);
  },
};
