import { type FC, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { LanguageSwitcher } from './LanguageSwitcher';
import './Header.css';

export const Header: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const userInitials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '';

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo" onClick={closeMobileMenu}>
          ♟ Chess<span>OT</span>
        </Link>

        <nav className="header-nav">
          <NavLink to="/openings">{t('nav.openings')}</NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard">{t('nav.dashboard')}</NavLink>
          )}
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <div className="header-user">
                <div className="header-user-avatar">{userInitials}</div>
                <span>{user?.firstName}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                {t('nav.login')}
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>

        <button
          className="hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <nav className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <NavLink to="/openings" onClick={closeMobileMenu}>
          {t('nav.openings')}
        </NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" onClick={closeMobileMenu}>
              {t('nav.dashboard')}
            </NavLink>
            <button className="btn btn-ghost" onClick={handleLogout}>
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={closeMobileMenu}>
              {t('nav.login')}
            </NavLink>
            <NavLink to="/register" onClick={closeMobileMenu}>
              {t('nav.register')}
            </NavLink>
          </>
        )}
        <LanguageSwitcher />
      </nav>
    </header>
  );
};
