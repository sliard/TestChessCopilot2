import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './NotFoundPage.module.css';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('errors');

  return (
    <div className={styles.container}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>{t('pages.notFound.title')}</h2>
      <p className={styles.message}>{t('pages.notFound.message')}</p>
      <Link to="/" className={styles.link}>
        {t('pages.notFound.backHome')}
      </Link>
    </div>
  );
};
