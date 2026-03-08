import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const LoadingSpinner: FC = () => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
      <div style={{ textAlign: 'center', color: 'var(--color-gray-500)' }}>
        <div style={{ width: 40, height: 40, border: '4px solid var(--color-gray-200)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p>{t('common.loading')}</p>
      </div>
    </div>
  );
};
