import { useState, useEffect, useCallback } from 'react';
import { userOpeningService } from '../services/userOpeningService';
import type { UserOpeningListItem } from '../types/opening';
import type { Page } from '../types/common';

interface UseMyOpeningsParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: string;
  q?: string;
}

interface UseMyOpeningsResult {
  openings: UserOpeningListItem[];
  pageData: Page<UserOpeningListItem> | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useMyOpenings = (params: UseMyOpeningsParams = {}): UseMyOpeningsResult => {
  const [pageData, setPageData] = useState<Page<UserOpeningListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOpenings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userOpeningService.getMyOpenings(params);
      setPageData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch openings'));
    } finally {
      setLoading(false);
    }
  }, [params.page, params.size, params.sort, params.order, params.q]);

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
