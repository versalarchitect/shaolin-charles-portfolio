import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '@/locales/en.json'
import fr from '@/locales/fr.json'

export const defaultNS = 'translation'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: 'fr',
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'charles-portfolio-lang',
    },
  })

const loadedLanguages = new Set(['en', 'fr'])

i18n.on('languageChanged', async (lng) => {
  const lang = lng.split('-')[0]
  if (loadedLanguages.has(lang)) return
  try {
    const res = await fetch(`/locales/${lang}.json`)
    if (res.ok) {
      const translations = await res.json()
      i18n.addResourceBundle(lang, 'translation', translations)
      loadedLanguages.add(lang)
    }
  } catch {}
})

export default i18n
