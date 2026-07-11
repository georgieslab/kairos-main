import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const enModules = import.meta.glob('./locales/en/*.json', { eager: true });
const deModules = import.meta.glob('./locales/de/*.json', { eager: true });

const buildResources = (modules) => {
  const result = {};
  for (const path in modules) {
    const ns = path.match(/([^/]+)\.json$/)[1];
    result[ns] = modules[path].default;
  }
  return result;
};

const enResources = buildResources(enModules);
const deResources = buildResources(deModules);
const namespaces = Array.from(new Set([...Object.keys(enResources), ...Object.keys(deResources)]));

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: enResources,
      de: deResources
    },
    ns: namespaces,
    defaultNS: 'common',
    fallbackLng: 'en',
    supportedLngs: ['en', 'de'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'kairosLanguage'
    },
    returnEmptyString: false
  });

export default i18n;
