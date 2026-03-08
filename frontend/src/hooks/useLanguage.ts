import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

type SupportedLanguage = 'en' | 'fr';

interface UseLanguageResult {
  currentLanguage: SupportedLanguage;
  changeLanguage: (lng: SupportedLanguage) => Promise<void>;
  languages: Array<{ code: SupportedLanguage; label: string; flag: string }>;
}

export const useLanguage = (): UseLanguageResult => {
  const { i18n } = useTranslation();

  const currentLanguage = (i18n.language?.substring(0, 2) as SupportedLanguage) || 'en';

  const changeLanguage = useCallback(async (lng: SupportedLanguage) => {
    await i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  }, [i18n]);

  const languages: Array<{ code: SupportedLanguage; label: string; flag: string }> = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  return { currentLanguage, changeLanguage, languages };
};
