import { useTranslation } from 'react-i18next';
import type { UserOpeningListItem } from '@/types/opening';
import { VisibilityBadge } from './VisibilityBadge';
import styles from './MyOpeningCard.module.css';

interface MyOpeningCardProps {
  opening: UserOpeningListItem;
  onEdit: (id: string) => void;
  onDelete: (opening: UserOpeningListItem) => void;
}

export const MyOpeningCard: React.FC<MyOpeningCardProps> = ({ opening, onEdit, onDelete }) => {
  const { t } = useTranslation('openings');

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{opening.name}</h3>
        <VisibilityBadge isPublic={opening.isPublic} />
      </div>
      {opening.description && (
        <p className={styles.description}>{opening.description}</p>
      )}
      <div className={styles.meta}>
        {opening.ecoCode && <span className={styles.eco}>{opening.ecoCode}</span>}
        <span>{opening.movesCount} {t('detail.moves', 'coups')}</span>
        <span>{new Date(opening.createdAt).toLocaleDateString()}</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.editButton} onClick={() => onEdit(opening.id)}>
          ✏️ {t('actions.edit', 'Modifier')}
        </button>
        <button className={styles.deleteButton} onClick={() => onDelete(opening)}>
          🗑️ {t('actions.delete', 'Supprimer')}
        </button>
      </div>
    </div>
  );
};
