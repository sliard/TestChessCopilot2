import { type FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../store/authStore';
import './AuthForm.css';

const registerSchema = z
  .object({
    email: z.string().min(1, 'required').email('invalidEmail'),
    password: z.string().min(8, 'passwordTooShort'),
    confirmPassword: z.string().min(1, 'required'),
    firstName: z.string().min(1, 'required'),
    lastName: z.string().min(1, 'required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwordMismatch',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: FC = () => {
  const { t } = useTranslation();
  const registerUser = useAuthStore((state) => state.register);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : t('auth.errors.emailExists'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form-card">
        <h1 className="auth-form-title">{t('auth.register.title')}</h1>

        {serverError && (
          <div className="auth-form-error" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                {t('auth.register.firstName')}
              </label>
              <input
                id="firstName"
                type="text"
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                {...register('firstName')}
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && (
                <p className="form-error" role="alert">
                  {t(`auth.errors.${errors.firstName.message}`)}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                {t('auth.register.lastName')}
              </label>
              <input
                id="lastName"
                type="text"
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                {...register('lastName')}
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <p className="form-error" role="alert">
                  {t(`auth.errors.${errors.lastName.message}`)}
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t('auth.register.email')}
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="form-error" role="alert">
                {t(`auth.errors.${errors.email.message}`)}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t('auth.register.password')}
            </label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="form-error" role="alert">
                {t(`auth.errors.${errors.password.message}`)}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              {t('auth.register.confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              {...register('confirmPassword')}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="form-error" role="alert">
                {t(`auth.errors.${errors.confirmPassword.message}`)}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? t('common.loading') : t('auth.register.submit')}
          </button>
        </form>

        <div className="auth-form-footer">
          <p>
            {t('auth.register.hasAccount')}{' '}
            <Link to="/login">{t('auth.register.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
