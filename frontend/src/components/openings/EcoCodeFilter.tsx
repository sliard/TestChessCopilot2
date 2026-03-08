import { useTranslation } from 'react-i18next';
import { ECO_CATEGORIES } from '@/types/search';
import styles from './EcoCodeFilter.module.css';

interface EcoCodeFilterProps {
  value: string;
  onChange: (ecoCode: string) => void;
}

export const EcoCodeFilter: React.FC<EcoCodeFilterProps> = ({ value, onChange }) => {
  const { t } = useTranslation('openings');

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="eco-code-filter">
        {t('filter.ecoCode')}
      </label>
      <div className={styles.inputWrapper}>
        <span className={styles.icon} aria-hidden="true">♟</span>
        <input
          id="eco-code-filter"
          type="text"
          list="eco-categories"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('filter.ecoCodePlaceholder')}
          className={styles.input}
          aria-label={t('filter.ecoCode')}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className={styles.clearButton}
            aria-label={t('filter.clearEcoCode')}
            type="button"
          >
            ✕
          </button>
        )}
      </div>
      <datalist id="eco-categories">
        {ECO_CATEGORIES.map((cat) => (
          <option key={cat.code} value={cat.code}>
            {cat.label}
          </option>
        ))}
      </datalist>
    </div>
  );
};
