import { apiClient } from './apiClient';
import type { Page } from '../types/common';
import type { OpeningListItem, OpeningDetail } from '../types/opening';

const BASE_URL = '/v1/public/openings';

export const publicOpeningService = {
  async getPublicOpenings(params?: {
    page?: number;
    size?: number;
    sort?: string;
    order?: string;
  }): Promise<Page<OpeningListItem>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.set('page', String(params.page));
    if (params?.size) searchParams.set('size', String(params.size));
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.order) searchParams.set('order', params.order);
    const query = searchParams.toString();
    return apiClient.get(`${BASE_URL}${query ? `?${query}` : ''}`, false);
  },

  async getPublicOpening(id: string): Promise<OpeningDetail> {
    return apiClient.get(`${BASE_URL}/${id}`, false);
  },

  async searchPublicOpenings(params?: {
    q?: string;
    ecoCode?: string;
    moves?: string;
    page?: number;
    size?: number;
    sort?: string;
    order?: string;
  }): Promise<Page<OpeningListItem>> {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.ecoCode) searchParams.set('ecoCode', params.ecoCode);
    if (params?.moves) searchParams.set('moves', params.moves);
    if (params?.page !== undefined) searchParams.set('page', String(params.page));
    if (params?.size) searchParams.set('size', String(params.size));
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.order) searchParams.set('order', params.order);
    const query = searchParams.toString();
    return apiClient.get(`${BASE_URL}/search${query ? `?${query}` : ''}`, false);
  },
};
