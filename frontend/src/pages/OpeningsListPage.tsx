import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { usePublicOpenings } from '../hooks/usePublicOpenings';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '../store/authStore';
import { OpeningList } from '../components/openings/OpeningList';
import { SearchFiltersBar } from '../components/openings/SearchFiltersBar';

export const OpeningsListPage: FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [ecoCode, setEcoCode] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const debouncedSearch = useDebounce(search, 400);
  const debouncedEco = useDebounce(ecoCode, 400);

  const { openings, loading, error, totalPages, totalElements } = usePublicOpenings(page, debouncedSearch, debouncedEco, undefined, sort, order);

  const handleReset = () => { setSearch(''); setEcoCode(''); setSort('createdAt'); setOrder('desc'); setPage(0); };

  return (
    <div className="page">
      <div className="container" style={{ padding: 'var(--spacing-2xl) var(--content-padding)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-xl)' }}>{t('openings.title')}</h1>

        <SearchFiltersBar search={search} onSearchChange={(v) => { setSearch(v); setPage(0); }} ecoCode={ecoCode} onEcoCodeChange={(v) => { setEcoCode(v); setPage(0); }} sort={sort} onSortChange={setSort} order={order} onOrderChange={setOrder} onReset={handleReset} />

        {!loading && totalElements > 0 && (
          <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>
            {t('common.results', { count: totalElements })}
          </p>
        )}

        <OpeningList openings={openings} loading={loading} error={error} currentPage={page} totalPages={totalPages} onPageChange={setPage} />

        {!isAuthenticated && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', marginTop: 'var(--spacing-2xl)', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>{t('openings.detail.cta')}</p>
            <Link to="/register" className="btn btn-primary">{t('openings.detail.ctaButton')}</Link>
          </div>
        )}
      </div>
    </div>
  );
};
