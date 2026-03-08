import { useTranslation } from 'react-i18next';
import type { SortOption } from '@/types/search';
import styles from './SortDropdown.module.css';

interface SortDropdownProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
  options: SortOption[];
}

const toOptionValue = (option: SortOption): string =>
  `${option.field}-${option.order}`;

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange, options }) => {
  const { t } = useTranslation('openings');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = options.find((opt) => toOptionValue(opt) === e.target.value);
    if (selected) {
      onChange(selected);
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="sort-dropdown">
        {t('filter.sortBy')}
      </label>
      <div className={styles.selectWrapper}>
        <select
          id="sort-dropdown"
          value={toOptionValue(value)}
          onChange={handleChange}
          className={styles.select}
          aria-label={t('filter.sortBy')}
        >
          {options.map((option) => (
            <option key={toOptionValue(option)} value={toOptionValue(option)}>
              {t(option.label)}
            </option>
          ))}
        </select>
        <span className={styles.arrow} aria-hidden="true">▾</span>
      </div>
    </div>
  );
};
