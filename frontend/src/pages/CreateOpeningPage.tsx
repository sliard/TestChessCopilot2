import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCreateOpening } from '@/hooks/useCreateOpening';
import { OpeningForm } from '@/components/openings/OpeningForm';
import styles from './CreateOpeningPage.module.css';

export const CreateOpeningPage: React.FC = () => {
  const { t } = useTranslation('openings');
  const navigate = useNavigate();
  const { createOpening, loading, error } = useCreateOpening();

  const handleSubmit = async (data: { name: string; description: string; ecoCode?: string; moves: string; isPublic: boolean }) => {
    const result = await createOpening({
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('form.createTitle', 'Créer une ouverture')}</h1>
        {error && <p className={styles.error}>{error.message}</p>}
        <OpeningForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/my-openings')}
          submitLabel={t('actions.create', 'Créer')}
          loading={loading}
        />
      </div>
    </div>
  );
};
