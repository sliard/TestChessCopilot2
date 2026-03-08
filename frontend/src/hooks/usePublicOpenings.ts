import { useState, useEffect, useCallback } from 'react';
import { publicOpeningService } from '../services/publicOpeningService';
import type { OpeningListItem } from '../types/opening';
import type { Page } from '../types/common';

interface UsePublicOpeningsParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: string;
  q?: string;
  ecoCode?: string;
  moves?: string;
}

interface UsePublicOpeningsResult {
  openings: OpeningListItem[];
  pageData: Page<OpeningListItem> | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePublicOpenings = (params: UsePublicOpeningsParams = {}): UsePublicOpeningsResult => {
  const [pageData, setPageData] = useState<Page<OpeningListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOpenings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const hasSearch = params.q || params.ecoCode || params.moves;
      const data = hasSearch
        ? await publicOpeningService.searchPublicOpenings(params)
        : await publicOpeningService.getPublicOpenings(params);
      setPageData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch openings'));
    } finally {
      setLoading(false);
    }
  }, [params.page, params.size, params.sort, params.order, params.q, params.ecoCode, params.moves]);

  useEffect(() => {
    fetchOpenings();
  }, [fetchOpenings]);

  return {
    openings: pageData?.content ?? [],
    pageData,
    loading,
    error,
    refetch: fetchOpenings,
  };
};
