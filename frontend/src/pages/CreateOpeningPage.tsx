import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chess } from 'chess.js';
import { userOpeningService } from '../services/userOpeningService';
import { Chessboard } from '../components/chessboard/Chessboard';

const openingSchema = z.object({
  name: z.string().min(1, 'required'),
  description: z.string().optional(),
  ecoCode: z.string().optional(),
  moves: z.string().min(1, 'required'),
  isPublic: z.boolean().optional(),
});

type OpeningFormData = z.infer<typeof openingSchema>;

interface CreateOpeningPageProps {
  editId?: string;
}

export const CreateOpeningPage: FC<CreateOpeningPageProps> = ({ editId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [movesPreview, setMovesPreview] = useState('');
  const [movesValid, setMovesValid] = useState(true);
  const isEdit = !!editId;

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<OpeningFormData>({
    resolver: zodResolver(openingSchema),
    defaultValues: { isPublic: false },
  });

  const watchedMoves = watch('moves', '');

  useEffect(() => {
    if (!watchedMoves) { setMovesPreview(''); setMovesValid(true); return; }
    try {
      const chess = new Chess();
      const parsed = watchedMoves.replace(/\d+\./g, '').split(/\s+/).filter((m: string) => m.length > 0);
      for (const move of parsed) chess.move(move);
      setMovesPreview(watchedMoves);
      setMovesValid(true);
    } catch {
      setMovesValid(false);
      setMovesPreview(watchedMoves);
    }
  }, [watchedMoves]);

  useEffect(() => {
    if (editId) {
      userOpeningService.getMyOpening(editId).then((opening) => {
        setValue('name', opening.name);
        setValue('description', opening.description || '');
        setValue('ecoCode', opening.ecoCode || '');
        setValue('moves', opening.moves);
        setValue('isPublic', opening.isPublic);
      }).catch((err) => setServerError(err instanceof Error ? err.message : 'Error'));
    }
  }, [editId, setValue]);

  const onSubmit = async (data: OpeningFormData) => {
    if (!movesValid) return;
    setServerError(null);
    setSubmitting(true);
    try {
      if (isEdit && editId) {
        await userOpeningService.updateOpening(editId, data);
      } else {
        await userOpeningService.createOpening(data);
      }
      navigate('/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ padding: 'var(--spacing-2xl) var(--content-padding)', maxWidth: 900 }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-xl)' }}>
          {isEdit ? t('dashboard.form.editTitle') : t('dashboard.form.title')}
        </h1>

        {serverError && <div className="auth-form-error" role="alert">{serverError}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label htmlFor="name" className="form-label">{t('dashboard.form.name')}</label>
              <input id="name" type="text" className={`form-input ${errors.name ? 'error' : ''}`} placeholder={t('dashboard.form.namePlaceholder')} {...register('name')} />
              {errors.name && <p className="form-error" role="alert">{t(`auth.errors.${errors.name.message}`)}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">{t('dashboard.form.description')}</label>
              <textarea id="description" className="form-input" placeholder={t('dashboard.form.descriptionPlaceholder')} rows={3} {...register('description')} />
            </div>

            <div className="form-group">
              <label htmlFor="ecoCode" className="form-label">{t('dashboard.form.ecoCode')}</label>
              <input id="ecoCode" type="text" className="form-input" placeholder={t('dashboard.form.ecoCodePlaceholder')} {...register('ecoCode')} />
            </div>

            <div className="form-group">
              <label htmlFor="moves" className="form-label">{t('dashboard.form.moves')}</label>
              <textarea id="moves" className={`form-input ${errors.moves || !movesValid ? 'error' : ''}`} placeholder={t('dashboard.form.movesPlaceholder')} rows={3} {...register('moves')} />
              <p className="form-help">{t('dashboard.form.movesHelp')}</p>
              {!movesValid && <p className="form-error" role="alert">{t('dashboard.form.invalidMoves')}</p>}
              {errors.moves && <p className="form-error" role="alert">{t(`auth.errors.${errors.moves.message}`)}</p>}
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <label className="toggle">
                <input type="checkbox" {...register('isPublic')} />
                <span className="toggle-slider" />
              </label>
              <span className="form-label" style={{ margin: 0 }}>{t('dashboard.form.isPublic')}</span>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting || !movesValid}>
                {submitting ? t('common.loading') : t('dashboard.form.submit')}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>{t('common.cancel')}</button>
            </div>
          </form>

          <div>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>{t('dashboard.form.preview')}</h3>
            {movesPreview ? <Chessboard moves={movesValid ? movesPreview : ''} showControls showMovesList={false} /> : (
              <div style={{ width: '100%', aspectRatio: '1', backgroundColor: 'var(--color-gray-100)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-400)' }}>
                ♟
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
