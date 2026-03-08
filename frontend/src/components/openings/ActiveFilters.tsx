import { useTranslation } from 'react-i18next';
import styles from './ActiveFilters.module.css';

interface ActiveFiltersProps {
  filters: {
    q?: string;
    ecoCode?: string;
    moves?: string;
    visibility?: string;
  };
  totalResults?: number;
  onRemoveFilter: (filterKey: string) => void;
  onResetAll: () => void;
}

const FILTER_LABEL_KEYS: Record<string, string> = {
  q: 'filter.badges.search',
  ecoCode: 'filter.badges.eco',
  moves: 'filter.badges.moves',
  visibility: 'filter.badges.visibility',
};

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  totalResults,
  onRemoveFilter,
  onResetAll,
}) => {
  const { t } = useTranslation('openings');

  const activeEntries = Object.entries(filters).filter(
    ([, value]) => value !== undefined && value !== '',
  );

  if (activeEntries.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.badges}>
        {activeEntries.map(([key, value]) => (
          <span key={key} className={styles.badge}>
            <span className={styles.badgeLabel}>
              {t(FILTER_LABEL_KEYS[key])}: {value}
            </span>
            <button
              onClick={() => onRemoveFilter(key)}
              className={styles.badgeRemove}
              aria-label={t('filter.removeBadge', { filter: t(FILTER_LABEL_KEYS[key]) })}
              type="button"
            >
              ✕
            </button>
          </span>
        ))}
        <button
          onClick={onResetAll}
          className={styles.resetButton}
          type="button"
        >
          {t('filter.reset')}
        </button>
      </div>
      {totalResults !== undefined && (
        <span className={styles.resultsCount}>
          {t('filter.results', { count: totalResults })}
        </span>
      )}
    </div>
  );
};
