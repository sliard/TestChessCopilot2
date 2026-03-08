import { useTranslation } from 'react-i18next';
import styles from './VisibilityBadge.module.css';

interface VisibilityBadgeProps {
  isPublic: boolean;
}

export const VisibilityBadge: React.FC<VisibilityBadgeProps> = ({ isPublic }) => {
  const { t } = useTranslation('openings');

  return (
    <span className={`${styles.badge} ${isPublic ? styles.public : styles.private}`}>
      {isPublic ? '🔓' : '🔒'} {isPublic ? t('visibility.public', 'Public') : t('visibility.private', 'Privé')}
    </span>
  );
};
