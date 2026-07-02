import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from './locales/en/common.json';
import ruCommon from './locales/ru/common.json';
import ruAuth from './locales/ru/auth.json';
import enAuth from './locales/en/auth.json';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        common: enCommon,
        auth: enAuth,
    },
    ru: {
        common: ruCommon,
        auth: ruAuth,
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "ru",
        load: "languageOnly",
        defaultNS: "common",
        ns: ['common', 'auth'],

        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'language',
        }
    });

export default i18n;