import { api } from '@/services/api';
import type { PageResponse, OpeningListItem, OpeningDetail } from '@/types/opening';
import type { SearchFilters } from '@/types/search';

export const publicOpeningService = {
  async getPublicOpenings(filters: Partial<SearchFilters> = {}): Promise<PageResponse<OpeningListItem>> {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.ecoCode) params.set('ecoCode', filters.ecoCode);
    if (filters.moves) params.set('moves', filters.moves);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.order) params.set('order', filters.order);
    params.set('page', String(filters.page ?? 0));
    params.set('size', String(filters.size ?? 20));
    return api<PageResponse<OpeningListItem>>(`/v1/public/openings?${params}`);
  },

  async getPublicOpening(id: string): Promise<OpeningDetail> {
    return api<OpeningDetail>(`/v1/public/openings/${id}`);
  },
};
