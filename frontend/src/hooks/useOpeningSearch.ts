import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { publicOpeningService } from '@/services/publicOpeningService';
import { userOpeningService } from '@/services/userOpeningService';
import type { PageResponse, OpeningListItem, UserOpeningListItem } from '@/types/opening';
import type { SortField, SortOrder, VisibilityFilter, SortOption } from '@/types/search';
import { DEFAULT_SEARCH_FILTERS, SORT_OPTIONS } from '@/types/search';

interface UseOpeningSearchOptions {
  mode: 'public' | 'personal';
}

interface UseOpeningSearchReturn {
  openings: PageResponse<OpeningListItem> | PageResponse<UserOpeningListItem> | null;
  loading: boolean;
  error: Error | null;
  totalResults: number;

  query: string;
  ecoCode: string;
  moves: string;
  visibility: VisibilityFilter;
  sort: SortOption;
  page: number;

  setQuery: (value: string) => void;
  setEcoCode: (value: string) => void;
  setMoves: (value: string) => void;
  setVisibility: (value: VisibilityFilter) => void;
  setSort: (option: SortOption) => void;
  setPage: (page: number) => void;

  resetFilters: () => void;
  hasActiveFilters: boolean;
  refetch: () => void;
}

const isValidSortField = (value: string): value is SortField =>
  ['createdAt', 'updatedAt', 'name'].includes(value);

const isValidSortOrder = (value: string): value is SortOrder =>
  ['asc', 'desc'].includes(value);

const isValidVisibility = (value: string): value is VisibilityFilter =>
  ['all', 'public', 'private'].includes(value);

const findSortOption = (field: SortField, order: SortOrder): SortOption =>
  SORT_OPTIONS.find((o) => o.field === field && o.order === order) ?? SORT_OPTIONS[0];

export const useOpeningSearch = ({ mode }: UseOpeningSearchOptions): UseOpeningSearchReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL
  const urlSort = searchParams.get('sort');
  const urlOrder = searchParams.get('order');
  const urlPage = searchParams.get('page');

  const sortField: SortField = urlSort && isValidSortField(urlSort) ? urlSort : DEFAULT_SEARCH_FILTERS.sort;
  const sortOrder: SortOrder = urlOrder && isValidSortOrder(urlOrder) ? urlOrder : DEFAULT_SEARCH_FILTERS.order;
  const currentPage = urlPage ? Math.max(0, parseInt(urlPage, 10) || 0) : DEFAULT_SEARCH_FILTERS.page;
  const ecoCode = searchParams.get('eco') ?? '';
  const urlVisibility = searchParams.get('visibility');
  const visibility: VisibilityFilter = urlVisibility && isValidVisibility(urlVisibility) ? urlVisibility : 'all';

  // Local state for immediate input responsiveness (debounced before API call)
  const [query, setQueryLocal] = useState(searchParams.get('q') ?? '');
  const [moves, setMovesLocal] = useState(searchParams.get('moves') ?? '');

  const debouncedQuery = useDebounce(query, 300);
  const debouncedMoves = useDebounce(moves, 300);

  // API state
  const [openings, setOpenings] = useState<PageResponse<OpeningListItem> | PageResponse<UserOpeningListItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Track whether a filter change should reset the page
  const isFilterChangeRef = useRef(false);

  // --- URL sync for debounced values ---
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedQuery) {
        next.set('q', debouncedQuery);
      } else {
        next.delete('q');
      }
      if (debouncedMoves) {
        next.set('moves', debouncedMoves);
      } else {
        next.delete('moves');
      }
      return next;
    }, { replace: true });
  }, [debouncedQuery, debouncedMoves, setSearchParams]);

  // --- Page reset on filter change ---
  useEffect(() => {
    if (isFilterChangeRef.current) {
      isFilterChangeRef.current = false;
      if (currentPage !== 0) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete('page');
          return next;
        }, { replace: true });
      }
    }
  }, [debouncedQuery, debouncedMoves, ecoCode, visibility, currentPage, setSearchParams]);

  // --- Setters ---
  const setQuery = useCallback((value: string) => {
    isFilterChangeRef.current = true;
    setQueryLocal(value);
  }, []);

  const setMoves = useCallback((value: string) => {
    isFilterChangeRef.current = true;
    setMovesLocal(value);
  }, []);

  const setEcoCode = useCallback((value: string) => {
    isFilterChangeRef.current = true;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set('eco', value);
      } else {
        next.delete('eco');
      }
      next.delete('page');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setVisibility = useCallback((value: VisibilityFilter) => {
    isFilterChangeRef.current = true;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'all') {
        next.set('visibility', value);
      } else {
        next.delete('visibility');
      }
      next.delete('page');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setSort = useCallback((option: SortOption) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('sort', option.field);
      next.set('order', option.order);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setPage = useCallback((page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (page > 0) {
        next.set('page', String(page));
      } else {
        next.delete('page');
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const resetFilters = useCallback(() => {
    setQueryLocal('');
    setMovesLocal('');
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const refetch = useCallback(() => {
    setRefreshCounter((c) => c + 1);
  }, []);

  // --- API call ---
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {
          q: debouncedQuery || undefined,
          ecoCode: ecoCode || undefined,
          moves: debouncedMoves || undefined,
          sort: sortField,
          order: sortOrder,
          page: currentPage,
          size: DEFAULT_SEARCH_FILTERS.size,
        };

        let result: PageResponse<OpeningListItem> | PageResponse<UserOpeningListItem>;
        if (mode === 'public') {
          result = await publicOpeningService.getPublicOpenings(filters);
        } else {
          result = await userOpeningService.getMyOpenings({
            ...filters,
            visibility: visibility !== 'all' ? visibility : undefined,
          });
        }

        if (!cancelled) {
          setOpenings(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
          setOpenings(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [mode, debouncedQuery, debouncedMoves, ecoCode, visibility, sortField, sortOrder, currentPage, refreshCounter]);

  // --- Computed values ---
  const sortOption = findSortOption(sortField, sortOrder);
  const hasActiveFilters = !!(debouncedQuery || ecoCode || debouncedMoves || visibility !== 'all');
  const totalResults = openings?.totalElements ?? 0;

  return {
    openings,
    loading,
    error,
    totalResults,

    query,
    ecoCode,
    moves,
    visibility,
    sort: sortOption,
    page: currentPage,

    setQuery,
    setEcoCode,
    setMoves,
    setVisibility,
    setSort,
    setPage,

    resetFilters,
    hasActiveFilters,
    refetch,
  };
};
