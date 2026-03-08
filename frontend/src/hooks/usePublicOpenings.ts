import { useCallback, useEffect, useState } from 'react';
import type { OpeningListItem } from '../types/opening';
import { publicOpeningService } from '../services/publicOpeningService';

interface UsePublicOpeningsResult {
  openings: OpeningListItem[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalElements: number;
}

export const usePublicOpenings = (
  page: number,
  search?: string,
  ecoCode?: string,
  moves?: string,
  sort?: string,
  order?: string,
): UsePublicOpeningsResult => {
  const [openings, setOpenings] = useState<OpeningListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchOpenings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const hasFilters = search || ecoCode || moves;
      const response = hasFilters
        ? await publicOpeningService.searchPublicOpenings({
            q: search,
            ecoCode,
            moves,
            page,
            size: 12,
            sort: sort || 'createdAt',
            order: order || 'desc',
          })
        : await publicOpeningService.getPublicOpenings(
            page,
            12,
            sort || 'createdAt',
            order || 'desc',
          );

      setOpenings(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, search, ecoCode, moves, sort, order]);

  useEffect(() => {
    fetchOpenings();
  }, [fetchOpenings]);

  return { openings, loading, error, totalPages, totalElements };
};
