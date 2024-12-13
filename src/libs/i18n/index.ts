import { languageOptions, namespaces } from '@/config/locales';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend'; // adding lazy loading for translations, more information here: https://github.com/i18next/i18next-http-backend
import { initReactI18next } from 'react-i18next';
import { i18nextPlugin } from 'translation-check';
import { LocaleObject, setLocale } from 'yup';

const customSaveMissingKeys = (
  key: string,
  defaultValue: any,
  ns: string,
  lng: readonly string[]
) => {
  // Get array of missing keys from localstorage
  const missingKeysArray = JSON.parse(localStorage.getItem('missingKeys') || '[]');
  // If key, ns and lng already exist, return
  const existingKey = missingKeysArray.find(
    (item: any) => item.key === key && item.ns === ns && item.lng.includes(lng[0])
  );
  if (existingKey) return;
  missingKeysArray.push({ key, defaultValue, ns, lng });
  // Save to localstorage
  localStorage.setItem('missingKeys', JSON.stringify(missingKeysArray));
};

export interface LanguageOptions {
  [key: string]: {
    icon: string;
    label: string;
  };
}

const missingKeys: Record<string, string> = {};

const initI18n = () => {
  i18n
    .use(Backend) // Load translations dynamically if needed
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Bind i18n to React
    .use(i18nextPlugin) // GUI
    .init({
      fallbackLng: 'en',
      supportedLngs: Object.keys(languageOptions),
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json', // locale files path
      },
      saveMissing: true, // Enable missing key reporting
      defaultNS: 'common',
      ns: namespaces,
      debug: true, // Optional: Debug missing keys in the console
      interpolation: {
        escapeValue: false, // React already escapes
      },
      saveMissingTo: 'current',
      missingKeyHandler: (lng, ns, key, fallbackValue) => {
        // Save missing keys and their fallback
        missingKeys[key] = fallbackValue || '';
        console.warn(`[i18n] Missing key: "${key}"`);
        customSaveMissingKeys(key, fallbackValue || '', ns, lng);
      },
      returnObjects: true,
    });
};

const localeSettings: LocaleObject = {
  mixed: {
    default: 'common:errors.default',
    required: ({ path }) => ({ key: 'common:errors.fieldRequired', values: { field: path } }),
    defined: ({ path }) => ({ key: 'common:errors.fieldDefined', values: { field: path } }),
    notNull: ({ path }) => ({ key: 'common:errors.fieldNotNull', values: { field: path } }),
    oneOf: ({ path, values }) => ({
      key: 'common:errors.fieldOneOf',
      values: { field: path, values },
    }),
    notOneOf: ({ path, values }) => ({
      key: 'common:errors.fieldNotOneOf',
      values: { field: path, values },
    }),
  },
  string: {
    // email: 'field_invalid_email',
    // url: 'field_invalid_url',
    length: ({ path, length }) => ({
      key: 'common:errors.stringLength',
      values: { field: path, length },
    }),
    min: ({ min, path }) => ({
      key: 'common:errors.fieldMin',
      values: { length: min, field: path },
    }),
    max: ({ max, path }) => ({
      key: 'common:errors.fieldMax',
      values: { length: max, field: path },
    }),
    email: ({ path }) => ({ key: 'common:errors.fieldEmail', values: { field: path } }),
    url: ({ path }) => ({ key: 'common:errors.fieldUrl', values: { field: path } }),
    uuid: ({ path }) => ({ key: 'common:errors.fieldUuid', values: { field: path } }),
    trim: ({ path }) => ({ key: 'common:errors.fieldTrim', values: { field: path } }),
    lowercase: ({ path }) => ({ key: 'common:errors.fieldLowercase', values: { field: path } }),
    uppercase: ({ path }) => ({ key: 'common:errors.fieldUppercase', values: { field: path } }),
  },
  number: {
    min: ({ min, path }) => ({
      key: 'common:errors.fieldMinValue',
      values: { length: min, field: path },
    }),
    max: ({ max, path }) => ({
      key: 'common:errors.fieldMaxValue',
      values: { length: max, field: path },
    }),
    lessThan: ({ path, less }) => ({
      key: 'common:errors.fieldMinValueLength',
      values: { field: path, length: less },
    }),
    moreThan: ({ path, more }) => ({
      key: 'common:errors.fieldMaxValueLength',
      values: { field: path, length: more },
    }),
    positive: ({ path }) => ({ key: 'common:errors.fieldPositive', values: { field: path } }),
    negative: ({ path }) => ({ key: 'common:errors.fieldNegative', values: { field: path } }),
    integer: ({ path }) => ({ key: 'common:errors.fieldInteger', values: { field: path } }),
  },
  date: {
    min: ({ min, path }) => ({
      key: 'common:errors.fieldMinDate',
      values: { length: min, field: path },
    }),
    max: ({ max, path }) => ({
      key: 'common:errors.fieldMaxDate',
      values: { length: max, field: path },
    }),
  },
  boolean: {
    isValue: ({ path, value }) => ({
      key: 'common:errors.fieldBoolean',
      values: { field: path, value },
    }),
  },
  object: {
    noUnknown: ({ path }) => ({ key: 'common:errors.fieldNoUnknown', values: { field: path } }),
  },
  array: {
    min: ({ min, path }) => ({
      key: 'common:errors.fieldMinArray',
      values: { length: min, field: path },
    }),
    max: ({ max, path }) => ({
      key: 'common:errors.fieldMaxArray',
      values: { length: max, field: path },
    }),
    length: ({ length, path }) => ({
      key: 'common:errors.fieldLengthArray',
      values: { length, field: path },
    }),
  },
  // use functions to generate an error object that includes the value from the schema
  // number: {
  //   min: ({ min }) => ({ key: 'field_too_short', values: { min } }),
  //   max: ({ max }) => ({ key: 'field_too_big', values: { max } }),
  // },
};

if (!i18n.isInitialized) {
  initI18n();
  setLocale(localeSettings);
}

// i18n
//   .use(Backend) // Load translations dynamically if needed
//   .use(LanguageDetector) // Detect user language
//   .use(initReactI18next) // Bind i18n to React
//   .use(i18nextPlugin) // GUI
//   .init({
//     fallbackLng: 'en',
//     supportedLngs: Object.keys(languageOptions),
//     backend: {
//       loadPath: '/locales/{{lng}}/{{ns}}.json', // locale files path
//     },
//     saveMissing: true, // Enable missing key reporting
//     defaultNS: 'common',
//     ns: namespaces,
//     debug: true, // Optional: Debug missing keys in the console
//     interpolation: {
//       escapeValue: false, // React already escapes
//     },
//     saveMissingTo: 'current',
//     missingKeyHandler: (lng, ns, key, fallbackValue) => {
//       // Save missing keys and their fallback
//       missingKeys[key] = fallbackValue || '';
//       console.warn(`[i18n] Missing key: "${key}"`);
//     },
//     returnObjects: true,
//   });

export default initI18n;
