import { renderHook, act } from '@testing-library/react';
import { useOpeningSearch } from './useOpeningSearch';
import { publicOpeningService } from '@/services/publicOpeningService';
import { userOpeningService } from '@/services/userOpeningService';
import type { PageResponse, OpeningListItem, UserOpeningListItem } from '@/types/opening';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockSetSearchParams = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

vi.mock('@/services/publicOpeningService', () => ({
  publicOpeningService: {
    getPublicOpenings: vi.fn(),
  },
}));

vi.mock('@/services/userOpeningService', () => ({
  userOpeningService: {
    getMyOpenings: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// ---------------------------------------------------------------------------
// Typed mock references
// ---------------------------------------------------------------------------

const mockGetPublicOpenings = publicOpeningService.getPublicOpenings as ReturnType<typeof vi.fn>;
const mockGetMyOpenings = userOpeningService.getMyOpenings as ReturnType<typeof vi.fn>;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const emptyPublicPage: PageResponse<OpeningListItem> = {
  content: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
};

const populatedPublicPage: PageResponse<OpeningListItem> = {
  content: [
    {
      id: '1',
      name: 'Sicilian Defense',
      description: 'A sharp opening',
      ecoCode: 'B20',
      movesCount: 2,
      author: 'Bobby Fischer',
      createdAt: '2024-01-01T00:00:00Z',
    },
  ],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
};

const emptyUserPage: PageResponse<UserOpeningListItem> = {
  content: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Renders the hook and flushes the initial mount effects + async API call.
 */
const renderAndFlush = async (mode: 'public' | 'personal' = 'public') => {
  const rendered = renderHook(() => useOpeningSearch({ mode }));
  // Flush microtasks so the initial fetchData() promise settles
  await act(async () => {});
  return rendered;
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useOpeningSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    mockGetPublicOpenings.mockResolvedValue(emptyPublicPage);
    mockGetMyOpenings.mockResolvedValue(emptyUserPage);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // -----------------------------------------------------------------------
  // Initialization
  // -----------------------------------------------------------------------

  describe('initialization', () => {
    it('should initialize with default filter values', async () => {
      // Given — no URL params
      // When
      const { result } = await renderAndFlush('public');

      // Then
      expect(result.current.query).toBe('');
      expect(result.current.ecoCode).toBe('');
      expect(result.current.moves).toBe('');
      expect(result.current.page).toBe(0);
      expect(result.current.visibility).toBe('all');
      expect(result.current.sort).toEqual({
        field: 'createdAt',
        order: 'desc',
        label: 'sort.newest',
      });
    });

    it('should read initial values from URL search params', async () => {
      // Given
      mockSearchParams = new URLSearchParams({
        q: 'sicilian',
        eco: 'B',
        moves: '1. e4 c5',
        sort: 'name',
        order: 'asc',
        page: '2',
      });

      // When
      const { result } = await renderAndFlush('public');

      // Then
      expect(result.current.query).toBe('sicilian');
      expect(result.current.ecoCode).toBe('B');
      expect(result.current.moves).toBe('1. e4 c5');
      expect(result.current.page).toBe(2);
      expect(result.current.sort).toEqual({
        field: 'name',
        order: 'asc',
        label: 'sort.nameAsc',
      });
    });
  });

  // -----------------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------------

  describe('data fetching', () => {
    it('should fetch public openings on mount', async () => {
      // When
      await renderAndFlush('public');

      // Then
      expect(mockGetPublicOpenings).toHaveBeenCalledTimes(1);
      expect(mockGetPublicOpenings).toHaveBeenCalledWith({
        q: undefined,
        ecoCode: undefined,
        moves: undefined,
        sort: 'createdAt',
        order: 'desc',
        page: 0,
        size: 20,
      });
    });

    it('should fetch user openings when mode is personal', async () => {
      // When
      await renderAndFlush('personal');

      // Then
      expect(mockGetMyOpenings).toHaveBeenCalledTimes(1);
      expect(mockGetMyOpenings).toHaveBeenCalledWith({
        q: undefined,
        ecoCode: undefined,
        moves: undefined,
        sort: 'createdAt',
        order: 'desc',
        page: 0,
        size: 20,
        visibility: undefined,
      });
      expect(mockGetPublicOpenings).not.toHaveBeenCalled();
    });

    it('should populate openings and totalResults after successful fetch', async () => {
      // Given
      mockGetPublicOpenings.mockResolvedValue(populatedPublicPage);

      // When
      const { result } = await renderAndFlush('public');

      // Then
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.openings).toEqual(populatedPublicPage);
      expect(result.current.totalResults).toBe(1);
    });

    it('should set error when fetch fails', async () => {
      // Given
      mockGetPublicOpenings.mockRejectedValue(new Error('Network error'));

      // When
      const { result } = await renderAndFlush('public');

      // Then
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Network error');
      expect(result.current.openings).toBeNull();
    });

    it('should wrap non-Error rejection in a generic Error', async () => {
      // Given
      mockGetPublicOpenings.mockRejectedValue('string error');

      // When
      const { result } = await renderAndFlush('public');

      // Then
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('An error occurred');
    });
  });

  // -----------------------------------------------------------------------
  // setQuery
  // -----------------------------------------------------------------------

  describe('setQuery', () => {
    it('should update query when setQuery is called', async () => {
      // Given
      const { result } = await renderAndFlush('public');

      // When
      act(() => {
        result.current.setQuery('sicilian');
      });

      // Then — local state updates immediately (before debounce)
      expect(result.current.query).toBe('sicilian');
    });

    it('should trigger a new API call only after the debounce delay', async () => {
      // Given
      const { result } = await renderAndFlush('public');
      mockGetPublicOpenings.mockClear();

      // When — update query
      act(() => {
        result.current.setQuery('sicilian');
      });

      // Then — debounce has not elapsed yet
      expect(mockGetPublicOpenings).not.toHaveBeenCalled();

      // When — advance past 300 ms debounce
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // Then
      expect(mockGetPublicOpenings).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'sicilian' }),
      );
    });
  });

  // -----------------------------------------------------------------------
  // hasActiveFilters
  // -----------------------------------------------------------------------

  describe('hasActiveFilters', () => {
    it('should have hasActiveFilters false when no filters set', async () => {
      const { result } = await renderAndFlush('public');

      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should have hasActiveFilters true when query is set', async () => {
      // Given
      const { result } = await renderAndFlush('public');

      // When
      act(() => {
        result.current.setQuery('test');
      });

      // Then — before debounce, debouncedQuery is still ''
      expect(result.current.hasActiveFilters).toBe(false);

      // When — debounce fires
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // Then
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should have hasActiveFilters true when ecoCode is present in URL', async () => {
      // Given
      mockSearchParams = new URLSearchParams({ eco: 'B' });

      // When
      const { result } = await renderAndFlush('public');

      // Then
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should have hasActiveFilters true when moves is set', async () => {
      // Given
      const { result } = await renderAndFlush('public');

      // When
      act(() => {
        result.current.setMoves('1. e4');
      });
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // Then
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should have hasActiveFilters true when visibility is not all', async () => {
      // Given
      mockSearchParams = new URLSearchParams({ visibility: 'public' });

      // When
      const { result } = await renderAndFlush('personal');

      // Then
      expect(result.current.hasActiveFilters).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // resetFilters
  // -----------------------------------------------------------------------

  describe('resetFilters', () => {
    it('should reset all filters when resetFilters is called', async () => {
      // Given — set some local-state filters
      const { result } = await renderAndFlush('public');

      act(() => {
        result.current.setQuery('sicilian');
        result.current.setMoves('1. e4 c5');
      });
      expect(result.current.query).toBe('sicilian');
      expect(result.current.moves).toBe('1. e4 c5');

      // When
      act(() => {
        result.current.resetFilters();
      });

      // Then — local state reset
      expect(result.current.query).toBe('');
      expect(result.current.moves).toBe('');
      // URL params cleared via setSearchParams({})
      expect(mockSetSearchParams).toHaveBeenCalledWith({}, { replace: true });
    });
  });

  // -----------------------------------------------------------------------
  // Sort
  // -----------------------------------------------------------------------

  describe('sort', () => {
    it('should return correct default sort option', async () => {
      const { result } = await renderAndFlush('public');

      expect(result.current.sort).toEqual({
        field: 'createdAt',
        order: 'desc',
        label: 'sort.newest',
      });
    });

    it('should return sort option matching URL params', async () => {
      // Given
      mockSearchParams = new URLSearchParams({ sort: 'name', order: 'asc' });

      // When
      const { result } = await renderAndFlush('public');

      // Then
      expect(result.current.sort).toEqual({
        field: 'name',
        order: 'asc',
        label: 'sort.nameAsc',
      });
    });

    it('should fall back to default sort for invalid URL values', async () => {
      // Given
      mockSearchParams = new URLSearchParams({ sort: 'invalid', order: 'wrong' });

      // When
      const { result } = await renderAndFlush('public');

      // Then
      expect(result.current.sort).toEqual({
        field: 'createdAt',
        order: 'desc',
        label: 'sort.newest',
      });
    });

    it('should update URL params when setSort is called', async () => {
      // Given
      const { result } = await renderAndFlush('public');
      mockSetSearchParams.mockClear();

      // When
      act(() => {
        result.current.setSort({ field: 'name', order: 'desc', label: 'sort.nameDesc' });
      });

      // Then — verify the updater function produces correct params
      expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function), { replace: true });
      const updater = mockSetSearchParams.mock.calls[0][0] as (prev: URLSearchParams) => URLSearchParams;
      const newParams = updater(new URLSearchParams());
      expect(newParams.get('sort')).toBe('name');
      expect(newParams.get('order')).toBe('desc');
    });
  });

  // -----------------------------------------------------------------------
  // setPage
  // -----------------------------------------------------------------------

  describe('setPage', () => {
    it('should set page param in URL', async () => {
      // Given
      const { result } = await renderAndFlush('public');
      mockSetSearchParams.mockClear();

      // When
      act(() => {
        result.current.setPage(3);
      });

      // Then
      const updater = mockSetSearchParams.mock.calls[0][0] as (prev: URLSearchParams) => URLSearchParams;
      const newParams = updater(new URLSearchParams());
      expect(newParams.get('page')).toBe('3');
    });

    it('should remove page param when setting page to 0', async () => {
      // Given
      const { result } = await renderAndFlush('public');
      mockSetSearchParams.mockClear();

      // When
      act(() => {
        result.current.setPage(0);
      });

      // Then
      const updater = mockSetSearchParams.mock.calls[0][0] as (prev: URLSearchParams) => URLSearchParams;
      const newParams = updater(new URLSearchParams({ page: '5' }));
      expect(newParams.has('page')).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // setEcoCode
  // -----------------------------------------------------------------------

  describe('setEcoCode', () => {
    it('should set eco param and reset page in URL', async () => {
      // Given
      const { result } = await renderAndFlush('public');
      mockSetSearchParams.mockClear();

      // When
      act(() => {
        result.current.setEcoCode('B');
      });

      // Then
      const updater = mockSetSearchParams.mock.calls[0][0] as (prev: URLSearchParams) => URLSearchParams;
      const newParams = updater(new URLSearchParams({ page: '3' }));
      expect(newParams.get('eco')).toBe('B');
      expect(newParams.has('page')).toBe(false);
    });

    it('should remove eco param when setting empty string', async () => {
      // Given
      const { result } = await renderAndFlush('public');
      mockSetSearchParams.mockClear();

      // When
      act(() => {
        result.current.setEcoCode('');
      });

      // Then
      const updater = mockSetSearchParams.mock.calls[0][0] as (prev: URLSearchParams) => URLSearchParams;
      const newParams = updater(new URLSearchParams({ eco: 'B' }));
      expect(newParams.has('eco')).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // setVisibility
  // -----------------------------------------------------------------------

  describe('setVisibility', () => {
    it('should set visibility param in URL', async () => {
      // Given
      const { result } = await renderAndFlush('personal');
      mockSetSearchParams.mockClear();

      // When
      act(() => {
        result.current.setVisibility('private');
      });

      // Then
      const updater = mockSetSearchParams.mock.calls[0][0] as (prev: URLSearchParams) => URLSearchParams;
      const newParams = updater(new URLSearchParams());
      expect(newParams.get('visibility')).toBe('private');
    });

    it('should remove visibility param when set to all', async () => {
      // Given
      const { result } = await renderAndFlush('personal');
      mockSetSearchParams.mockClear();

      // When
      act(() => {
        result.current.setVisibility('all');
      });

      // Then
      const updater = mockSetSearchParams.mock.calls[0][0] as (prev: URLSearchParams) => URLSearchParams;
      const newParams = updater(new URLSearchParams({ visibility: 'private' }));
      expect(newParams.has('visibility')).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // refetch
  // -----------------------------------------------------------------------

  describe('refetch', () => {
    it('should trigger a new API call when refetch is called', async () => {
      // Given
      const { result } = await renderAndFlush('public');
      mockGetPublicOpenings.mockClear();

      // When
      await act(async () => {
        result.current.refetch();
      });

      // Then
      expect(mockGetPublicOpenings).toHaveBeenCalledTimes(1);
    });
  });
});
