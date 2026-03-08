import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div role="alert" style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)', textAlign: 'center', margin: 'var(--spacing-lg) 0' }}>
      <p>{message || t('common.error')}</p>
    </div>
  );
};
