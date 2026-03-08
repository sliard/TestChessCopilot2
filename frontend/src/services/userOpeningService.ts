import { api } from '@/services/api';
import type {
  PageResponse,
  UserOpening,
  UserOpeningListItem,
  CreateOpeningRequest,
  UpdateOpeningRequest,
  UpdateVisibilityRequest,
} from '@/types/opening';

interface GetMyOpeningsParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: string;
  q?: string;
}

export const userOpeningService = {
  async getMyOpenings(params?: GetMyOpeningsParams): Promise<PageResponse<UserOpeningListItem>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.set('page', String(params.page));
    if (params?.size) searchParams.set('size', String(params.size));
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.order) searchParams.set('order', params.order);
    if (params?.q) searchParams.set('q', params.q);
    const query = searchParams.toString();
    return api<PageResponse<UserOpeningListItem>>(`/v1/openings${query ? `?${query}` : ''}`);
  },

  async getOpening(id: string): Promise<UserOpening> {
    return api<UserOpening>(`/v1/openings/${id}`);
  },

  async createOpening(data: CreateOpeningRequest): Promise<UserOpening> {
    return api<UserOpening>('/v1/openings', {
      method: 'POST',
      body: data,
    });
  },

  async updateOpening(id: string, data: UpdateOpeningRequest): Promise<UserOpening> {
    return api<UserOpening>(`/v1/openings/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  async deleteOpening(id: string): Promise<void> {
    await api<void>(`/v1/openings/${id}`, {
      method: 'DELETE',
    });
  },

  async updateVisibility(id: string, data: UpdateVisibilityRequest): Promise<UserOpening> {
    return api<UserOpening>(`/v1/openings/${id}/visibility`, {
      method: 'PATCH',
      body: data,
    });
  },
};
