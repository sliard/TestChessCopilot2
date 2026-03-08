import { useState, useEffect } from 'react';
import { publicOpeningService } from '@/services/publicOpeningService';
import type { PageResponse, OpeningListItem } from '@/types/opening';
import type { SearchFilters } from '@/types/search';

interface UsePublicOpeningsReturn {
  openings: PageResponse<OpeningListItem> | null;
  loading: boolean;
  error: Error | null;
}

export const usePublicOpenings = (params: Partial<SearchFilters>): UsePublicOpeningsReturn => {
  const [openings, setOpenings] = useState<PageResponse<OpeningListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOpenings = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await publicOpeningService.getPublicOpenings(params);
        setOpenings(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch openings'));
      } finally {
        setLoading(false);
      }
    };
    fetchOpenings();
  }, [params.page, params.q, params.ecoCode, params.moves, params.sort, params.order]);

  return { openings, loading, error };
};
