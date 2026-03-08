import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <h1>{t('nav.dashboard')}</h1>
      {user && (
        <p>
          {t('dashboard.welcome', `Welcome, ${user.firstName}!`, { name: user.firstName })}
        </p>
      )}
    </div>
  );
};
