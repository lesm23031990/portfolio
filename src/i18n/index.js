import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

const STORAGE_KEY = 'portfolio-locale'

export const SUPPORTED_LOCALES = ['es', 'en']

function isSupportedLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale)
}

function syncDocumentLanguage(locale) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale
  }
}

function getBrowserLocale() {
  if (typeof navigator === 'undefined') return 'es'

  const browserLocale = navigator.language?.split('-')[0]?.toLowerCase()
  return isSupportedLocale(browserLocale) ? browserLocale : 'es'
}

function getInitialLocale() {
  if (typeof window === 'undefined') return 'es'

  const storedLocale = window.localStorage.getItem(STORAGE_KEY)

  if (isSupportedLocale(storedLocale)) {
    return storedLocale
  }

  return getBrowserLocale()
}

const locale = getInitialLocale()

syncDocumentLanguage(locale)

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale,
  fallbackLocale: 'es',
  warnHtmlMessage: false,
  messages: {
    es,
    en
  }
})

export function setLocale(localeToSet) {
  if (!isSupportedLocale(localeToSet)) return

  i18n.global.locale.value = localeToSet
  syncDocumentLanguage(localeToSet)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, localeToSet)
  }
}

export default i18n
