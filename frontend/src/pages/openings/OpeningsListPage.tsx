import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePublicOpenings } from '@/hooks/usePublicOpenings';
import { useDebounce } from '@/hooks/useDebounce';
import { OpeningCard } from '@/components/openings/OpeningCard';
import { SearchBar } from '@/components/openings/SearchBar';
import styles from './OpeningsListPage.module.css';

export const OpeningsListPage: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { openings, loading, error } = usePublicOpenings(page, debouncedSearch);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('list.title', { ns: 'openings' })}</h1>
        </div>

        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder={t('list.searchPlaceholder', { ns: 'openings' })}
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
