import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { OpeningListItem } from '../../types/opening';
import './OpeningCard.css';

interface OpeningCardProps {
  opening: OpeningListItem;
}

export const OpeningCard: FC<OpeningCardProps> = ({ opening }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <article
      className="card opening-card"
      onClick={() => navigate(`/openings/${opening.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/openings/${opening.id}`);
        }
      }}
    >
      <div className="opening-card-body">
        <div className="opening-card-header">
          <h3 className="opening-card-name">{opening.name}</h3>
          {opening.ecoCode && (
            <span className="badge badge-primary">{opening.ecoCode}</span>
          )}
        </div>
        {opening.description && (
          <p className="opening-card-description">{opening.description}</p>
        )}
        <div className="opening-card-meta">
          <span>♟ {t('openings.movesCount', { count: opening.movesCount })}</span>
          <span>
            👤{' '}
            {opening.author
              ? t('openings.author', { name: opening.author })
              : t('openings.system')}
          </span>
        </div>
      </div>
    </article>
  );
};
