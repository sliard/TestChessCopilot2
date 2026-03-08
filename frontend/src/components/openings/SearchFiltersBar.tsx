import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SortOption, VisibilityFilter } from '@/types/search';
import { SearchBar } from './SearchBar';
import { EcoCodeFilter } from './EcoCodeFilter';
import { SortDropdown } from './SortDropdown';
import { ActiveFilters } from './ActiveFilters';
import styles from './SearchFiltersBar.module.css';

interface SearchFiltersBarProps {
  query: string;
  ecoCode: string;
  moves: string;
  visibility?: VisibilityFilter;
  sort: SortOption;
  sortOptions: SortOption[];
  totalResults?: number;
  showVisibilityFilter?: boolean;
  hasActiveFilters: boolean;
  onQueryChange: (value: string) => void;
  onEcoCodeChange: (value: string) => void;
  onMovesChange: (value: string) => void;
  onVisibilityChange?: (value: VisibilityFilter) => void;
  onSortChange: (option: SortOption) => void;
  onResetFilters: () => void;
}

const VISIBILITY_OPTIONS: VisibilityFilter[] = ['all', 'public', 'private'];

export const SearchFiltersBar: React.FC<SearchFiltersBarProps> = ({
  query,
  ecoCode,
  moves,
  visibility,
  sort,
  sortOptions,
  totalResults,
  showVisibilityFilter = false,
  hasActiveFilters,
  onQueryChange,
  onEcoCodeChange,
  onMovesChange,
  onVisibilityChange,
  onSortChange,
  onResetFilters,
}) => {
  const { t } = useTranslation('openings');
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const activeFilterValues: Record<string, string | undefined> = {
    ...(query ? { q: query } : {}),
    ...(ecoCode ? { ecoCode } : {}),
    ...(moves ? { moves } : {}),
    ...(visibility && visibility !== 'all' ? { visibility: t(`filter.visibility.${visibility}`) } : {}),
  };

  const handleRemoveFilter = (filterKey: string) => {
    switch (filterKey) {
      case 'q':
        onQueryChange('');
        break;
      case 'ecoCode':
        onEcoCodeChange('');
        break;
      case 'moves':
        onMovesChange('');
        break;
      case 'visibility':
        onVisibilityChange?.('all');
        break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchRow}>
        <SearchBar
          value={query}
          onChange={onQueryChange}
          placeholder={t('list.searchPlaceholder')}
        />
      </div>

      <button
        type="button"
        className={styles.filtersToggle}
        onClick={() => setFiltersExpanded(!filtersExpanded)}
        aria-expanded={filtersExpanded}
      >
        <span>{t('filter.advancedFilters')}</span>
        <span className={`${styles.toggleIcon} ${filtersExpanded ? styles.expanded : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      <div className={`${styles.filtersRow} ${filtersExpanded ? styles.filtersRowExpanded : ''}`}>
        <EcoCodeFilter value={ecoCode} onChange={onEcoCodeChange} />

        <div className={styles.movesFilter}>
          <label className={styles.filterLabel} htmlFor="moves-filter">
            {t('filter.movesLabel')}
          </label>
          <div className={styles.movesInputWrapper}>
            <input
              id="moves-filter"
              type="text"
              value={moves}
              onChange={(e) => onMovesChange(e.target.value)}
              placeholder={t('filter.movesPlaceholder')}
              className={styles.movesInput}
              aria-label={t('filter.movesLabel')}
            />
            {moves && (
              <button
                onClick={() => onMovesChange('')}
                className={styles.clearButton}
                aria-label={t('filter.clearMoves')}
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {showVisibilityFilter && onVisibilityChange && (
          <div className={styles.visibilityFilter}>
            <span className={styles.filterLabel}>{t('filter.visibilityLabel')}</span>
            <div className={styles.visibilityOptions} role="radiogroup" aria-label={t('filter.visibilityLabel')}>
              {VISIBILITY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={visibility === option}
                  className={`${styles.visibilityOption} ${visibility === option ? styles.visibilityOptionActive : ''}`}
                  onClick={() => onVisibilityChange(option)}
                >
                  {t(`filter.visibility.${option}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        <SortDropdown value={sort} onChange={onSortChange} options={sortOptions} />
      </div>

      {hasActiveFilters && (
        <ActiveFilters
          filters={activeFilterValues}
          totalResults={totalResults}
          onRemoveFilter={handleRemoveFilter}
          onResetAll={onResetFilters}
        />
      )}
    </div>
  );
};
