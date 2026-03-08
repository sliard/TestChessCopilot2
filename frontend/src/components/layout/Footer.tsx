import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};
