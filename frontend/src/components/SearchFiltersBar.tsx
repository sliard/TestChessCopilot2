import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';

interface SearchFiltersBarProps {
  onFiltersChange: (filters: {
    q?: string;
    ecoCode?: string;
    moves?: string;
    sort?: string;
    order?: string;
  }) => void;
}

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Most recent', order: 'desc' },
  { value: 'name', label: 'Name A-Z', order: 'asc' },
  { value: 'name', label: 'Name Z-A', order: 'desc' },
];

export const SearchFiltersBar: React.FC<SearchFiltersBarProps> = ({ onFiltersChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchText, setSearchText] = useState(searchParams.get('q') || '');
  const [ecoCode, setEcoCode] = useState(searchParams.get('eco') || '');
  const [sortIndex, setSortIndex] = useState(0);

  const debouncedSearch = useDebounce(searchText, 300);
  const debouncedEco = useDebounce(ecoCode, 300);

  const updateFilters = useCallback(() => {
    const sort = SORT_OPTIONS[sortIndex];
    const filters: Record<string, string> = {};
    if (debouncedSearch) filters.q = debouncedSearch;
    if (debouncedEco) filters.eco = debouncedEco;
    if (sortIndex > 0) filters.sort = String(sortIndex);

    setSearchParams(filters, { replace: true });
    onFiltersChange({
      q: debouncedSearch || undefined,
      ecoCode: debouncedEco || undefined,
      sort: sort.value,
      order: sort.order,
    });
  }, [debouncedSearch, debouncedEco, sortIndex, onFiltersChange, setSearchParams]);

  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  const hasActiveFilters = !!searchText || !!ecoCode || sortIndex > 0;

  const resetFilters = () => {
    setSearchText('');
    setEcoCode('');
    setSortIndex(0);
  };

  return (
    <div className="search-filters">
      <div className="search-filters__row">
        <div className="search-filters__input-group">
          <input
            type="text"
            className="form-input"
            placeholder="Search openings..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Search openings"
          />
          {searchText && (
            <button className="search-filters__clear-btn" onClick={() => setSearchText('')} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <input
          type="text"
          className="form-input search-filters__eco"
          placeholder="ECO code"
          value={ecoCode}
          onChange={(e) => setEcoCode(e.target.value)}
          maxLength={10}
          aria-label="Filter by ECO code"
        />

        <select
          className="form-input search-filters__sort"
          value={sortIndex}
          onChange={(e) => setSortIndex(Number(e.target.value))}
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((opt, idx) => (
            <option key={idx} value={idx}>{opt.label}</option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <div className="search-filters__active">
          {searchText && (
            <span className="filter-badge">
              Search: {searchText} <button onClick={() => setSearchText('')}>✕</button>
            </span>
          )}
          {ecoCode && (
            <span className="filter-badge">
              ECO: {ecoCode} <button onClick={() => setEcoCode('')}>✕</button>
            </span>
          )}
          <button className="btn btn-sm btn-outline" onClick={resetFilters}>
            Reset all
          </button>
        </div>
      )}
    </div>
  );
};
