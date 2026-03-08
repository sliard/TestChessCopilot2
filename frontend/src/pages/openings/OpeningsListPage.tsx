import { useTranslation } from 'react-i18next';
import { useOpeningSearch } from '@/hooks/useOpeningSearch';
import { OpeningCard } from '@/components/openings/OpeningCard';
import { SearchFiltersBar } from '@/components/openings/SearchFiltersBar';
import { SORT_OPTIONS } from '@/types/search';
import styles from './OpeningsListPage.module.css';

export const OpeningsListPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    openings, loading, error, totalResults,
    query, ecoCode, moves, sort, page,
    setQuery, setEcoCode, setMoves, setSort, setPage,
    resetFilters, hasActiveFilters,
  } = useOpeningSearch({ mode: 'public' });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('list.title', { ns: 'openings' })}</h1>
        </div>

        <SearchFiltersBar
          query={query}
          ecoCode={ecoCode}
          moves={moves}
          sort={sort}
          sortOptions={SORT_OPTIONS}
          totalResults={totalResults}
          showVisibilityFilter={false}
          hasActiveFilters={hasActiveFilters}
          onQueryChange={setQuery}
          onEcoCodeChange={setEcoCode}
          onMovesChange={setMoves}
          onSortChange={setSort}
          onResetFilters={resetFilters}
        />

        {loading && <p className={styles.loading}>{t('actions.loading')}</p>}
        {error && <p className={styles.error}>{error.message}</p>}

        {openings && (
          <>
            {openings.content.length === 0 ? (
              <p className={styles.empty}>{t('list.empty', { ns: 'openings' })}</p>
            ) : (
              <div className={styles.grid}>
                {openings.content.map((opening) => (
                  <OpeningCard key={opening.id} opening={opening} />
                ))}
              </div>
            )}

            {openings.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.paginationButton}
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  {t('pagination.previous')}
                </button>
                <span className={styles.pageInfo}>
                  {t('pagination.page', { current: page + 1, total: openings.totalPages })}
                </span>
                <button
                  className={styles.paginationButton}
                  disabled={page >= openings.totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t('pagination.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
