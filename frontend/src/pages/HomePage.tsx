import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import styles from './HomePage.module.css';

interface PopularOpening {
  name: string;
  ecoCode: string;
  moves: string;
  description: string;
}

const POPULAR_OPENINGS: PopularOpening[] = [
  {
    name: 'Défense Sicilienne',
    ecoCode: 'B20',
    moves: '1.e4 c5',
    description: "Une des ouvertures les plus populaires au plus haut niveau.",
  },
  {
    name: 'Ruy Lopez',
    ecoCode: 'C60',
    moves: '1.e4 e5 2.Nf3 Nc6 3.Bb5',
    description: "Ouverture classique nommée d'après un prêtre espagnol du 16e siècle.",
  },
  {
    name: 'Gambit du Roi',
    ecoCode: 'C30',
    moves: '1.e4 e5 2.f4',
    description: 'Ouverture agressive sacrifiant un pion pour le développement.',
  },
];

const FEATURE_KEYS = ['library', 'chessboard', 'progress'] as const;
const FEATURE_ICONS = { library: '📚', chessboard: '♟', progress: '📈' };

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('landing.hero.title')}</h1>
          <p className={styles.heroSubtitle}>{t('landing.hero.subtitle')}</p>
          <Link to="/openings" className={styles.heroCta}>
            {t('landing.hero.cta')}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.featureGrid}>
            {FEATURE_KEYS.map((key) => (
              <div key={key} className={styles.featureCard}>
                <span className={styles.featureIcon} aria-hidden="true">
                  {FEATURE_ICONS[key]}
                </span>
                <h3 className={styles.featureTitle}>
                  {t(`landing.features.${key}.title`)}
                </h3>
                <p className={styles.featureDescription}>
                  {t(`landing.features.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className={styles.preview}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('landing.preview.title')}</h2>
          <p className={styles.sectionSubtitle}>{t('landing.preview.subtitle')}</p>
          <div className={styles.openingsGrid}>
            {POPULAR_OPENINGS.map((opening) => (
              <div key={opening.ecoCode} className={styles.openingCard}>
                <div className={styles.openingHeader}>
                  <h3 className={styles.openingName}>{opening.name}</h3>
                  <span className={styles.openingEco}>{opening.ecoCode}</span>
                </div>
                <p className={styles.openingMoves}>{opening.moves}</p>
                <p className={styles.openingDescription}>{opening.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          {isAuthenticated && user ? (
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                {t('landing.authenticated.welcome', { firstName: user.firstName })}
              </h2>
              <Link to="/dashboard" className={styles.ctaButton}>
                {t('landing.authenticated.dashboardLink')}
              </Link>
            </div>
          ) : (
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>{t('landing.cta.title')}</h2>
              <p className={styles.ctaSubtitle}>{t('landing.cta.subtitle')}</p>
              <Link to="/register" className={styles.ctaButton}>
                {t('landing.cta.button')}
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
