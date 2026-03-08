import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <span aria-hidden="true">♟</span> {t('app.name')}
        </Link>

        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerOpen : ''}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerOpen : ''}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerOpen : ''}`} />
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <Link to="/openings" className={styles.navLink} onClick={closeMenu}>
            {t('nav.openings')}
          </Link>

          <LanguageSwitcher />

          <div className={styles.authZone}>
            {isAuthenticated && user ? (
              <>
                <Link to="/my-openings" className={styles.navLink} onClick={closeMenu}>
                  {t('nav.myOpenings')}
                </Link>
                <Link to="/dashboard" className={styles.navLink} onClick={closeMenu}>
                  {t('nav.dashboard')}
                </Link>
                <button
                  className={styles.logoutButton}
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.authLink} onClick={closeMenu}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className={styles.registerLink} onClick={closeMenu}>
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
