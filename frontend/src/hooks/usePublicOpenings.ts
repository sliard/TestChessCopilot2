import { useState, useEffect } from 'react';
import { publicOpeningService } from '@/services/publicOpeningService';
import type { PageResponse, OpeningListItem } from '@/types/opening';

interface UsePublicOpeningsReturn {
  openings: PageResponse<OpeningListItem> | null;
  loading: boolean;
  error: Error | null;
}

export const usePublicOpenings = (page: number, search: string): UsePublicOpeningsReturn => {
  const [openings, setOpenings] = useState<PageResponse<OpeningListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOpenings = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await publicOpeningService.getPublicOpenings(page, 20, search || undefined);
        setOpenings(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch openings'));
      } finally {
        setLoading(false);
      }
    };
    fetchOpenings();
  }, [page, search]);

  return { openings, loading, error };
};
