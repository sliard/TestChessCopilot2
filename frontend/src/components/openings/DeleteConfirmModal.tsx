import { useTranslation } from 'react-i18next';
import styles from './DeleteConfirmModal.module.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  openingName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, openingName, onConfirm, onCancel }) => {
  const { t } = useTranslation('openings');

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{t('delete.title', 'Confirmer la suppression')}</h3>
        <p className={styles.message}>
          {t('delete.message', 'Êtes-vous sûr de vouloir supprimer')} <strong>{openingName}</strong> ?
        </p>
        <p className={styles.warning}>
          {t('delete.warning', 'Cette action est irréversible.')}
        </p>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel}>
            {t('actions.cancel', 'Annuler')}
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            {t('actions.confirmDelete', 'Supprimer')}
          </button>
        </div>
      </div>
    </div>
  );
};
