import { useLanguage } from '../hooks/useLanguage';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'buttons' }) => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  if (variant === 'buttons') {
    return (
      <div className="language-switcher" role="group" aria-label="Language selection">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`language-switcher__btn ${currentLanguage === lang.code ? 'language-switcher__btn--active' : ''}`}
            onClick={() => changeLanguage(lang.code)}
            aria-pressed={currentLanguage === lang.code}
            aria-label={lang.label}
          >
            {lang.flag} {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <select
      className="language-switcher__select"
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value as 'en' | 'fr')}
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.label}
        </option>
      ))}
    </select>
  );
};
