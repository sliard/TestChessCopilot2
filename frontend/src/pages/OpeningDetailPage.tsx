import type { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePublicOpening } from '../hooks/usePublicOpening';
import { useAuthStore } from '../store/authStore';
import { Chessboard } from '../components/chessboard/Chessboard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const OpeningDetailPage: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const { opening, loading, error } = usePublicOpening(id || '');

  if (loading) return <div className="container" style={{ padding: 'var(--spacing-2xl) var(--content-padding)' }}><LoadingSpinner /></div>;
  if (error) return <div className="container" style={{ padding: 'var(--spacing-2xl) var(--content-padding)' }}><ErrorMessage message={error} /></div>;
  if (!opening) return null;

  return (
    <div className="page">
      <div className="container" style={{ padding: 'var(--spacing-2xl) var(--content-padding)' }}>
        <Link to="/openings" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)', color: 'var(--color-gray-600)' }}>
          ← {t('openings.detail.back')}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-3xl)' }}>{opening.name}</h1>
          {opening.ecoCode && <span className="badge badge-primary" style={{ fontSize: 'var(--font-size-sm)' }}>{opening.ecoCode}</span>}
        </div>

        <Chessboard moves={opening.moves} />

        {opening.description && (
          <div style={{ marginTop: 'var(--spacing-xl)' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-sm)' }}>{t('openings.detail.description')}</h2>
            <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.7 }}>{opening.description}</p>
          </div>
        )}

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
