import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';
import paTranslation from './locales/pa.json';
import mrTranslation from './locales/mr.json';
import taTranslation from './locales/ta.json';
import teTranslation from './locales/te.json';
import guTranslation from './locales/gu.json';
import bnTranslation from './locales/bn.json';
import knTranslation from './locales/kn.json';
import orTranslation from './locales/or.json';

const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  pa: { translation: paTranslation },
  mr: { translation: mrTranslation },
  ta: { translation: taTranslation },
  te: { translation: teTranslation },
  gu: { translation: guTranslation },
  bn: { translation: bnTranslation },
  kn: { translation: knTranslation },
  or: { translation: orTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('language') || 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

// Save language preference
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
