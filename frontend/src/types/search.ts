export type SortField = 'createdAt' | 'updatedAt' | 'name';
export type SortOrder = 'asc' | 'desc';
export type VisibilityFilter = 'all' | 'public' | 'private';

export interface SortOption {
  field: SortField;
  order: SortOrder;
  label: string;
}

export interface SearchFilters {
  q?: string;
  ecoCode?: string;
  moves?: string;
  visibility?: VisibilityFilter;
  sort: SortField;
  order: SortOrder;
  page: number;
  size: number;
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  sort: 'createdAt',
  order: 'desc',
  page: 0,
  size: 20,
};

export const SORT_OPTIONS: SortOption[] = [
  { field: 'createdAt', order: 'desc', label: 'sort.newest' },
  { field: 'createdAt', order: 'asc', label: 'sort.oldest' },
  { field: 'updatedAt', order: 'desc', label: 'sort.recentlyUpdated' },
  { field: 'name', order: 'asc', label: 'sort.nameAsc' },
  { field: 'name', order: 'desc', label: 'sort.nameDesc' },
];

export const ECO_CATEGORIES = [
  { code: 'A', label: 'A — Flank openings' },
  { code: 'B', label: 'B — Semi-open games (1.e4, not 1...e5)' },
  { code: 'C', label: 'C — Open games (1.e4 e5)' },
  { code: 'D', label: 'D — Closed & semi-closed (1.d4 d5)' },
  { code: 'E', label: 'E — Indian defences (1.d4 Nf6)' },
];
