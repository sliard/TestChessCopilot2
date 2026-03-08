import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePublicOpening } from '@/hooks/usePublicOpening';
import { useAuth } from '@/hooks/useAuth';
import { Chessboard } from '@/components/chessboard/Chessboard';
import styles from './OpeningDetailPage.module.css';

export const OpeningDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { opening, loading, error } = usePublicOpening(id!);
  const { isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.loading}>{t('actions.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !opening) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.error}>{error?.message || 'Opening not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button onClick={() => navigate('/openings')} className={styles.backButton}>
          ← {t('pagination.previous')}
        </button>

        <div className={styles.header}>
          <h1 className={styles.title}>{opening.name}</h1>
          {opening.ecoCode && <span className={styles.ecoCode}>{opening.ecoCode}</span>}
        </div>

        <div className={styles.content}>
          <div className={styles.boardSection}>
            <Chessboard moves={opening.moves} />
          </div>

          <div className={styles.infoSection}>
            <div className={styles.descriptionBlock}>
              <h2 className={styles.sectionTitle}>{t('detail.description', { ns: 'openings' })}</h2>
              <p className={styles.description}>{opening.description}</p>
            </div>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>{t('detail.ecoCode', { ns: 'openings' })}</span>
                <span className={styles.metaValue}>{opening.ecoCode}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>{t('detail.createdBy', { ns: 'openings' })}</span>
                <span className={styles.metaValue}>{opening.author}</span>
              </div>
            </div>

            {!isAuthenticated && (
              <div className={styles.cta}>
                <p className={styles.ctaText}>{t('cta.register', { ns: 'openings' })}</p>
                <Link to="/register" className={styles.ctaButton}>
                  {t('cta.registerButton', { ns: 'openings' })}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
