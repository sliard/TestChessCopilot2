import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUpdateOpening } from '@/hooks/useUpdateOpening';
import { userOpeningService } from '@/services/userOpeningService';
import { OpeningForm } from '@/components/openings/OpeningForm';
import type { UserOpening } from '@/types/opening';
import styles from './EditOpeningPage.module.css';

export const EditOpeningPage: React.FC = () => {
  const { t } = useTranslation('openings');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateOpening, loading: updateLoading, error: updateError } = useUpdateOpening();
  const [opening, setOpening] = useState<UserOpening | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOpening = async () => {
      setLoading(true);
      try {
        const result = await userOpeningService.getOpening(id);
        setOpening(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load opening'));
      } finally {
        setLoading(false);
      }
    };
    fetchOpening();
  }, [id]);

  const handleSubmit = async (data: { name: string; description: string; ecoCode?: string; moves: string; isPublic: boolean }) => {
    if (!id) return;
    const result = await updateOpening(id, {
      name: data.name,
      description: data.description ?? '',
      ecoCode: data.ecoCode,
      moves: data.moves,
      isPublic: data.isPublic,
    });
    if (result) {
      navigate('/my-openings');
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p>{t('actions.loading', 'Chargement...')}</p>
        </div>
      </div>
    );
  }

  if (error || !opening) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.error}>{error?.message || t('errors.notFound', 'Ouverture non trouvée')}</p>
          <button onClick={() => navigate('/my-openings')}>{t('actions.back', 'Retour')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('form.editTitle', 'Modifier l\'ouverture')}</h1>
        {updateError && <p className={styles.error}>{updateError.message}</p>}
        <OpeningForm
          initialValues={{
            name: opening.name,
            description: opening.description,
            ecoCode: opening.ecoCode,
            moves: opening.moves,
            isPublic: opening.isPublic,
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/my-openings')}
          submitLabel={t('actions.save', 'Enregistrer')}
          loading={updateLoading}
        />
      </div>
    </div>
  );
};
