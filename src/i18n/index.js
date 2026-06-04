import { createI18n } from 'vue-i18n'
import { loadContent } from '@/content/loadContent'

const content = loadContent()

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
    es: content.es || {},
    en: content.en || {}
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

export function reloadMessages() {
  const refreshed = loadContent()
  if (refreshed.es) i18n.global.setLocaleMessage('es', refreshed.es)
  if (refreshed.en) i18n.global.setLocaleMessage('en', refreshed.en)
}

export default i18n
