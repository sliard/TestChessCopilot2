import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__brand">♟️ {t('app.name')}</Link>
        <Link to="/openings" className="navbar__link">{t('nav.openings')}</Link>
        {isAuthenticated && (
          <Link to="/my-openings" className="navbar__link">{t('nav.myOpenings')}</Link>
        )}
      </div>
      <div className="navbar__right">
        <LanguageSwitcher />
        {isAuthenticated ? (
          <button className="btn btn-sm btn-outline" onClick={logout}>
            {t('nav.logout')}
          </button>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-outline">{t('nav.login')}</Link>
            <Link to="/register" className="btn btn-sm btn-primary">{t('nav.register')}</Link>
          </>
        )}
      </div>
    </nav>
  );
};
