import { type FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../store/authStore';
import './AuthForm.css';

const loginSchema = z.object({
  email: z.string().min(1, 'required').email('invalidEmail'),
  password: z.string().min(1, 'required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: FC = () => {
  const { t } = useTranslation();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : t('auth.errors.invalidCredentials'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form-card">
        <h1 className="auth-form-title">{t('auth.login.title')}</h1>

        {serverError && (
          <div className="auth-form-error" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t('auth.login.email')}
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              {...register('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="form-error" role="alert">
                {t(`auth.errors.${errors.email.message}`)}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {t('auth.login.password')}
            </label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              {...register('password')}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" className="form-error" role="alert">
                {t(`auth.errors.${errors.password.message}`)}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? t('common.loading') : t('auth.login.submit')}
          </button>
        </form>

        <div className="auth-form-footer">
          <p>
            {t('auth.login.noAccount')}{' '}
            <Link to="/register">{t('auth.login.register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
