import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useValidateMoves } from '@/hooks/useValidateMoves';
import { MovesInput } from './MovesInput';
import { Chessboard } from '@/components/chessboard/Chessboard';
import styles from './OpeningForm.module.css';

const openingSchema = z.object({
  name: z.string().min(1, 'form.nameRequired').max(255),
  description: z.string().max(2000),
  ecoCode: z.string().max(10),
  moves: z.string().min(1, 'form.movesRequired'),
  isPublic: z.boolean(),
});

type OpeningFormData = z.infer<typeof openingSchema>;

interface OpeningFormProps {
  initialValues?: {
    name: string;
    description: string;
    ecoCode?: string;
    moves: string;
    isPublic: boolean;
  };
  onSubmit: (data: OpeningFormData) => void;
  onCancel: () => void;
  submitLabel: string;
  loading?: boolean;
}

export const OpeningForm: React.FC<OpeningFormProps> = ({ initialValues, onSubmit, onCancel, submitLabel, loading }) => {
  const { t } = useTranslation('openings');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OpeningFormData>({
    resolver: zodResolver(openingSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      ecoCode: initialValues?.ecoCode ?? '',
      moves: initialValues?.moves ?? '',
      isPublic: initialValues?.isPublic ?? false,
    },
  });

  const movesValue = watch('moves');
  const isPublicValue = watch('isPublic');
  const { valid, error: movesError, position } = useValidateMoves(movesValue);

  const movesCount = movesValue
    ? movesValue.trim().split(/\s+/).filter((token) => !/^\d+\.+$/.test(token)).length
    : 0;

  const handleFormSubmit = (data: OpeningFormData) => {
    if (!valid) return;
    onSubmit(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="opening-name">
          {t('form.name', 'Nom')} *
        </label>
        <input
          id="opening-name"
          className={styles.input}
          {...register('name')}
          placeholder={t('form.namePlaceholder', 'ex: Défense Sicilienne')}
          aria-invalid={!!errors.name}
        />
        {errors.name && <span className={styles.error}>{t(errors.name.message as never)}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="opening-description">
          {t('form.description', 'Description')}
        </label>
        <textarea
          id="opening-description"
          className={styles.textarea}
          {...register('description')}
          placeholder={t('form.descriptionPlaceholder', 'Décrivez cette ouverture...')}
          rows={3}
          aria-invalid={!!errors.description}
        />
        {errors.description && <span className={styles.error}>{t(errors.description.message as never)}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="opening-eco">
          {t('form.ecoCode', 'Code ECO')}
        </label>
        <input
          id="opening-eco"
          className={styles.inputSmall}
          {...register('ecoCode')}
          placeholder="B20"
        />
      </div>

      <div className={styles.movesSection}>
        <MovesInput
          value={movesValue}
          onChange={(val) => setValue('moves', val, { shouldValidate: true })}
          valid={valid}
          error={movesError}
          movesCount={valid ? movesCount : undefined}
        />
        {valid && position && (
          <div className={styles.preview}>
            <Chessboard moves={movesValue} showControls={false} showMovesList={false} />
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.toggle}>
          <input type="checkbox" {...register('isPublic')} />
          <span>{isPublicValue ? '🔓' : '🔒'}</span>
          {isPublicValue
            ? t('visibility.public', 'Public')
            : t('visibility.private', 'Privé')}
        </label>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          {t('actions.cancel', 'Annuler')}
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!valid || loading}
        >
          {loading ? t('actions.saving', 'Enregistrement...') : submitLabel}
        </button>
      </div>
    </form>
  );
};
