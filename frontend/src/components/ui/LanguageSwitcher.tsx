import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons';
  showFlags?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  showFlags = true,
}) => {
  const { currentLanguage, changeLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === currentLanguage) ?? languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (variant === 'buttons') {
    return (
      <div className={styles.buttons} role="group" aria-label={t('language.select')}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`${styles.button} ${lang.code === currentLanguage ? styles.active : ''}`}
            onClick={() => changeLanguage(lang.code)}
            aria-pressed={lang.code === currentLanguage}
          >
            {showFlags && <span aria-hidden="true">{lang.flag}</span>} {lang.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.dropdown} ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('language.select')}
      >
        {showFlags && <span aria-hidden="true">{currentLang.flag}</span>}
        <span>{currentLang.code.toUpperCase()}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>
      {isOpen && (
        <ul className={styles.menu} role="listbox" aria-label={t('language.select')}>
          {languages.map((lang) => (
            <li key={lang.code} role="option" aria-selected={lang.code === currentLanguage}>
              <button
                className={`${styles.option} ${lang.code === currentLanguage ? styles.active : ''}`}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
              >
                {showFlags && <span aria-hidden="true">{lang.flag}</span>} {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
