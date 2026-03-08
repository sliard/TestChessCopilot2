import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/services/api';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'validation.firstNameRequired'),
    lastName: z.string().min(1, 'validation.lastNameRequired'),
    email: z.string().min(1, 'validation.emailRequired').email('validation.emailInvalid'),
    password: z.string().min(8, 'validation.passwordMinLength'),
    confirmPassword: z.string().min(1, 'validation.passwordRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordMismatch',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation('auth');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setServerError(t('register.emailTaken', 'This email is already registered'));
      } else {
        setServerError(t('register.genericError', 'An error occurred. Please try again.'));
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t('register.title')}</h1>

        {serverError && <div className="auth-error" role="alert">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">{t('register.firstName')}</label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                {...register('firstName')}
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && <span className="field-error">{t(errors.firstName.message as never)}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">{t('register.lastName')}</label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                {...register('lastName')}
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && <span className="field-error">{t(errors.lastName.message as never)}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('register.email')}</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className="field-error">{t(errors.email.message as never)}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('register.password')}</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            {errors.password && <span className="field-error">{t(errors.password.message as never)}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('register.confirmPassword')}</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <span className="field-error">{t(errors.confirmPassword.message as never)}</span>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? '...' : t('register.submit')}
          </button>
        </form>

        <p className="auth-footer">
          {t('register.hasAccount')}{' '}
          <Link to="/login">{t('register.signInLink')}</Link>
        </p>
      </div>
    </div>
  );
};
