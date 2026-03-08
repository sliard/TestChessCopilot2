import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="page home-page">
      <div className="container">
        <div className="hero">
          <h1>{t('home.title')}</h1>
          <p className="subtitle">{t('home.tagline')}</p>
          <p className="hero__description">{t('home.description')}</p>
        </div>

        <div className="home-actions">
          <Link to="/openings" className="btn btn-primary btn-lg">
            {t('home.browseOpenings')}
          </Link>

          {isAuthenticated ? (
            <div className="welcome-section">
              <p>{t('home.welcomeBack', { name: `${user?.firstName} ${user?.lastName}` })}</p>
              <div className="btn-group">
                <Link to="/my-openings" className="btn btn-secondary">
                  {t('nav.myOpenings')}
                </Link>
                <Link to="/dashboard" className="btn btn-outline">
                  {t('nav.dashboard')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <p>{t('home.createAccount')}</p>
              <div className="btn-group">
                <Link to="/login" className="btn btn-secondary">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-outline">
                  {t('nav.register')}
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="features-section">
          <div className="feature-card">
            <h3>📚 {t('home.featureLibrary')}</h3>
            <p>{t('home.featureLibraryDesc')}</p>
          </div>
          <div className="feature-card">
            <h3>♟️ {t('home.featureBoard')}</h3>
            <p>{t('home.featureBoardDesc')}</p>
          </div>
          <div className="feature-card">
            <h3>📝 {t('home.featureRepertoire')}</h3>
            <p>{t('home.featureRepertoireDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

