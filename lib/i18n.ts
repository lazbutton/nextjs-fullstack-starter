import { defaultLocale, locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'

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

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  
  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment
  }
  
  return defaultLocale
}

export function getLocalizedPathname(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  
  // If already has a locale, replace it
  if (firstSegment && isValidLocale(firstSegment)) {
    segments[0] = locale
    return '/' + segments.join('/')
  }
  
  // Otherwise, prepend the locale
  return '/' + [locale, ...segments].join('/')
}

