import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enOpenings from './locales/en/openings.json';
import enErrors from './locales/en/errors.json';

import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frOpenings from './locales/fr/openings.json';
import frErrors from './locales/fr/errors.json';

export const defaultNS = 'common';
export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    openings: enOpenings,
    errors: enErrors,
  },
  fr: {
    common: frCommon,
    auth: frAuth,
    openings: frOpenings,
    errors: frErrors,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    fallbackLng: 'fr',
    supportedLngs: ['en', 'fr'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
