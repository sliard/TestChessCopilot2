import { api } from '@/services/api';
import type { PageResponse, OpeningListItem, OpeningDetail } from '@/types/opening';

export const publicOpeningService = {
  async getPublicOpenings(page = 0, size = 20, search?: string): Promise<PageResponse<OpeningListItem>> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) {
      return api<PageResponse<OpeningListItem>>(`/v1/public/openings/search?q=${encodeURIComponent(search)}&${params}`);
    }
    return api<PageResponse<OpeningListItem>>(`/v1/public/openings?${params}`);
  },

  async getPublicOpening(id: string): Promise<OpeningDetail> {
    return api<OpeningDetail>(`/v1/public/openings/${id}`);
  },
};
