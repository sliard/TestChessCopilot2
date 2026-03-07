import { type ChangeEvent } from 'react';
import type { SortOption } from '../types/opening';
import { EcoCodeFilter } from './EcoCodeFilter';
import { SearchBar } from './SearchBar';
import { SortDropdown } from './SortDropdown';

interface SearchFiltersBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  ecoCode: string;
  onEcoCodeChange: (ecoCode: string) => void;
  movesValue: string;
  onMovesChange: (moves: string) => void;
  sortValue: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SearchFiltersBar: React.FC<SearchFiltersBarProps> = ({
  searchValue,
  onSearchChange,
  ecoCode,
  onEcoCodeChange,
  movesValue,
  onMovesChange,
  sortValue,
  onSortChange,
}) => {
  const handleMovesChange = (e: ChangeEvent<HTMLInputElement>) => {
    onMovesChange(e.target.value);
  };

  return (
    <div className="search-filters-bar">
      <div className="search-filters-row search-filters-row--full">
        <SearchBar value={searchValue} onChange={onSearchChange} />
      </div>
      <div className="search-filters-row search-filters-row--controls">
        <EcoCodeFilter value={ecoCode} onChange={onEcoCodeChange} />
        <div className="moves-filter">
          <input
            type="text"
            className="filter-input"
            value={movesValue}
            onChange={handleMovesChange}
            placeholder="Premiers coups (ex: 1.e4 c5)"
            aria-label="Filtrer par premiers coups"
          />
        </div>
        <SortDropdown value={sortValue} onChange={onSortChange} />
      </div>
    </div>
  );
};
