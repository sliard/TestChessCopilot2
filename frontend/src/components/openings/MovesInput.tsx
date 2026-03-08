import { useTranslation } from 'react-i18next';
import styles from './MovesInput.module.css';

interface MovesInputProps {
  value: string;
  onChange: (value: string) => void;
  valid: boolean;
  error?: string;
  movesCount?: number;
}

export const MovesInput: React.FC<MovesInputProps> = ({ value, onChange, valid, error, movesCount }) => {
  const { t } = useTranslation('openings');

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        {t('form.moves', 'Coups')} *
      </label>
      <textarea
        className={`${styles.textarea} ${value ? (valid ? styles.valid : styles.invalid) : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('form.movesPlaceholder', '1. e4 c5 2. Nf3...')}
        rows={3}
      />
      {value && (
        <div className={styles.feedback}>
          {valid ? (
            <span className={styles.success}>✅ {movesCount} {t('form.validMoves', 'coups valides')}</span>
          ) : (
            <span className={styles.errorText}>❌ {error}</span>
          )}
        </div>
      )}
    </div>
  );
};
