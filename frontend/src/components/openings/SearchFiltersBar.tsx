import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchBar } from './SearchBar';
import './SearchFiltersBar.css';

interface SearchFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  ecoCode: string;
  onEcoCodeChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  order: string;
  onOrderChange: (value: string) => void;
  onReset: () => void;
}

export const SearchFiltersBar: FC<SearchFiltersBarProps> = ({
  search,
  onSearchChange,
  ecoCode,
  onEcoCodeChange,
  sort,
  onSortChange,
  order,
  onOrderChange,
  onReset,
}) => {
  const { t } = useTranslation();

  const hasActiveFilters = search || ecoCode || sort !== 'createdAt' || order !== 'desc';

  return (
    <div className="search-filters">
      <SearchBar value={search} onChange={onSearchChange} />

      <div className="search-filters-eco">
        <input
          type="text"
          value={ecoCode}
          onChange={(e) => onEcoCodeChange(e.target.value)}
          placeholder={t('openings.filters.ecoCodePlaceholder')}
          aria-label={t('openings.filters.ecoCode')}
        />
      </div>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label={t('openings.filters.sort')}
      >
        <option value="createdAt">{t('openings.filters.sortOptions.createdAt')}</option>
        <option value="name">{t('openings.filters.sortOptions.name')}</option>
        <option value="ecoCode">{t('openings.filters.sortOptions.ecoCode')}</option>
      </select>

      <select
        value={order}
        onChange={(e) => onOrderChange(e.target.value)}
        aria-label={t('openings.filters.order.asc')}
      >
        <option value="desc">{t('openings.filters.order.desc')}</option>
        <option value="asc">{t('openings.filters.order.asc')}</option>
      </select>

      {hasActiveFilters && (
        <button className="btn btn-ghost btn-sm" onClick={onReset}>
          {t('openings.filters.reset')}
        </button>
      )}
    </div>
  );
};
