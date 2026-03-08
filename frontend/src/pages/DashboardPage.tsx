import { type FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { OpeningListItem } from '../types/opening';
import { userOpeningService } from '../services/userOpeningService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const DashboardPage: FC = () => {
  const { t } = useTranslation();
  const [openings, setOpenings] = useState<OpeningListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOpenings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userOpeningService.getMyOpenings(page, 12);
      setOpenings(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchOpenings(); }, [fetchOpenings]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('dashboard.confirmDelete'))) return;
    try {
      await userOpeningService.deleteOpening(id);
      fetchOpenings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      await userOpeningService.toggleVisibility(id);
      fetchOpenings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ padding: 'var(--spacing-2xl) var(--content-padding)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)' }}>{t('dashboard.title')}</h1>
          <Link to="/openings/new" className="btn btn-primary">{t('dashboard.createNew')}</Link>
        </div>

        {error && <ErrorMessage message={error} />}
        {loading ? <LoadingSpinner /> : openings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-3xl)', color: 'var(--color-gray-500)' }}>
            <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-lg)' }}>{t('dashboard.noOpenings')}</p>
            <Link to="/openings/new" className="btn btn-primary">{t('dashboard.createNew')}</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1" style={{ gap: 'var(--spacing-md)' }}>
              {openings.map((opening) => (
                <div key={opening.id} className="card card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                      <h3>{opening.name}</h3>
                      {opening.ecoCode && <span className="badge badge-primary">{opening.ecoCode}</span>}
                    </div>
                    {opening.description && <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>{opening.description}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleToggleVisibility(opening.id)} title={t('dashboard.toggleVisibility')}>
                      {t('dashboard.toggleVisibility')}
                    </button>
                    <Link to={`/openings/${opening.id}/edit`} className="btn btn-outline btn-sm">{t('dashboard.edit')}</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(opening.id)}>{t('dashboard.delete')}</button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-lg)', marginTop: 'var(--spacing-xl)' }}>
                <button className="btn btn-outline btn-sm" onClick={() => setPage((p) => p - 1)} disabled={page === 0}>{t('openings.pagination.previous')}</button>
                <button className="btn btn-outline btn-sm" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1}>{t('openings.pagination.next')}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
