import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { OpeningListItem } from '../../types/opening';
import { OpeningCard } from './OpeningCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import './OpeningList.css';

interface OpeningListProps {
  openings: OpeningListItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const OpeningList: FC<OpeningListProps> = ({
  openings,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (openings.length === 0) {
    return <p className="opening-list-empty">{t('openings.noResults')}</p>;
  }

  return (
    <div>
      <div className="opening-list-grid">
        {openings.map((opening) => (
          <OpeningCard key={opening.id} opening={opening} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="opening-list-pagination">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            {t('openings.pagination.previous')}
          </button>
          <span>
            {t('openings.pagination.page', {
              current: currentPage + 1,
              total: totalPages,
            })}
          </span>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            {t('openings.pagination.next')}
          </button>
        </div>
      )}
    </div>
  );
};
