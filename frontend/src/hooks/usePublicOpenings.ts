import { useCallback, useEffect, useState } from 'react';
import type { Page } from '../types/common';
import type { OpeningListItem } from '../types/opening';
import { publicOpeningService } from '../services/publicOpeningService';

interface UsePublicOpeningsResult {
  openings: OpeningListItem[];
  page: Page<OpeningListItem> | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePublicOpenings = (
  currentPage = 0,
  search?: string,
  ecoCode?: string,
  moves?: string,
  sort?: string,
  order?: string,
  size = 20,
): UsePublicOpeningsResult => {
  const [page, setPage] = useState<Page<OpeningListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOpenings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await publicOpeningService.getPublicOpenings({
        q: search,
        ecoCode,
        moves,
        sort,
        order,
        page: currentPage,
        size,
      });
      setPage(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, ecoCode, moves, sort, order, size]);

  useEffect(() => {
    fetchOpenings();
  }, [fetchOpenings]);

  return {
    openings: page?.content ?? [],
    page,
    loading,
    error,
    refetch: fetchOpenings,
  };
};
