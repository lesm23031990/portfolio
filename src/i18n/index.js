import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

const STORAGE_KEY = 'portfolio-locale'

export const SUPPORTED_LOCALES = ['es', 'en']

function getMessageMetadata(value) {
  return {
    exists: typeof value === 'string',
    length: typeof value === 'string' ? value.length : null,
    containsAt: typeof value === 'string' ? value.includes('@') : false,
    containsColon: typeof value === 'string' ? value.includes(':') : false
  }
}

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
  messages: {
    es,
    en
  }
})

// #region agent log
fetch('http://127.0.0.1:7592/ingest/f20cbc4f-e99d-4090-95ce-53ddee1a70ec',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'58aca7'},body:JSON.stringify({sessionId:'58aca7',runId:'email-i18n-debug',hypothesisId:'H1,H3,H4',location:'src/i18n/index.js:60',message:'i18n bootstrap metadata for contact email',data:{locale,es:getMessageMetadata(es?.home?.contact?.email),en:getMessageMetadata(en?.home?.contact?.email)},timestamp:Date.now()})}).catch(()=>{})
// #endregion

export function setLocale(localeToSet) {
  if (!isSupportedLocale(localeToSet)) return

  i18n.global.locale.value = localeToSet
  syncDocumentLanguage(localeToSet)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, localeToSet)
  }

  // #region agent log
  fetch('http://127.0.0.1:7592/ingest/f20cbc4f-e99d-4090-95ce-53ddee1a70ec',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'58aca7'},body:JSON.stringify({sessionId:'58aca7',runId:'email-i18n-debug',hypothesisId:'H4',location:'src/i18n/index.js:72',message:'locale changed',data:{locale:localeToSet,messageMeta:getMessageMetadata(i18n.global.messages.value?.[localeToSet]?.home?.contact?.email)},timestamp:Date.now()})}).catch(()=>{})
  // #endregion
}

export default i18n
