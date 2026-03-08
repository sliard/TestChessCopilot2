import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

type SupportedLanguage = 'en' | 'fr';

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
}

interface UseLanguageResult {
  currentLanguage: SupportedLanguage;
  changeLanguage: (lng: SupportedLanguage) => Promise<void>;
  languages: LanguageOption[];
  t: TFunction;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export const useLanguage = (): UseLanguageResult => {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (lng: SupportedLanguage): Promise<void> => {
    await i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  return {
    currentLanguage: (i18n.language?.substring(0, 2) as SupportedLanguage) || 'fr',
    changeLanguage,
    languages: LANGUAGES,
    t,
  };
};
