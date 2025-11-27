import { locales, type Locale } from '@/i18n/config'
import { getLocale } from './i18n/cookies'

// Import translation files
import en from '@/i18n/messages/en.json'
import fr from '@/i18n/messages/fr.json'

const messages = {
  en,
  fr,
}

export function getTranslations(locale: Locale) {
  return messages[locale]
}

export async function getTranslationsForCurrentLocale() {
  const locale = await getLocale()
  return getTranslations(locale)
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

