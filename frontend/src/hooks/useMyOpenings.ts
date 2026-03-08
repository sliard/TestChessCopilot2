import { useState, useEffect, useCallback } from 'react';
import { userOpeningService } from '@/services/userOpeningService';
import type { PageResponse, UserOpeningListItem } from '@/types/opening';

interface UseMyOpeningsReturn {
  openings: PageResponse<UserOpeningListItem> | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useMyOpenings = (
  page: number,
  search: string,
  sort: string = 'createdAt',
  order: string = 'desc',
): UseMyOpeningsReturn => {
  const [openings, setOpenings] = useState<PageResponse<UserOpeningListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchOpenings = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await userOpeningService.getMyOpenings({
          page,
          size: 20,
          sort,
          order,
          q: search || undefined,
        });
        setOpenings(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch openings'));
      } finally {
        setLoading(false);
      }
    };
    fetchOpenings();
  }, [page, search, sort, order, refreshKey]);

  return { openings, loading, error, refetch };
};
