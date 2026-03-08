import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

export const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};
