import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Each locale directory is globbed independently. Adding a language means
// dropping in ./locales/<code>/*.json and adding an entry to LOCALE_MODULES +
// SUPPORTED_LANGUAGES below — namespaces are derived from the filenames, and
// any key missing from a locale falls back to English.
const LOCALE_MODULES = {
  en: import.meta.glob('./locales/en/*.json', { eager: true }),
  de: import.meta.glob('./locales/de/*.json', { eager: true }),
  ka: import.meta.glob('./locales/ka/*.json', { eager: true })
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'de', short: 'DE', label: 'Deutsch' },
  { code: 'ka', short: 'KA', label: 'ქართული' }
];

const buildResources = (modules) => {
  const result = {};
  for (const path in modules) {
    const ns = path.match(/([^/]+)\.json$/)[1];
    result[ns] = modules[path].default;
  }
  return result;
};

const resources = {};
for (const lng in LOCALE_MODULES) {
  resources[lng] = buildResources(LOCALE_MODULES[lng]);
}

const namespaces = Array.from(
  new Set(Object.values(resources).flatMap((r) => Object.keys(r)))
);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns: namespaces,
    defaultNS: 'common',
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'kairosLanguage'
    },
    returnEmptyString: false
  });

// Keep <html lang> in sync so the Georgian webfont rule (and screen readers)
// resolve against the active language.
const syncHtmlLang = (lng) => {
  document.documentElement.setAttribute('lang', (lng || 'en').split('-')[0]);
};
syncHtmlLang(i18n.resolvedLanguage || i18n.language);
i18n.on('languageChanged', syncHtmlLang);

export default i18n;
