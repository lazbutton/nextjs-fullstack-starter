import { cookies } from 'next/headers'
import { defaultLocale, type Locale, locales } from '@/i18n/config'

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME)
  
  if (localeCookie?.value && locales.includes(localeCookie.value as Locale)) {
    return localeCookie.value as Locale
  }
  
  return defaultLocale
}

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    httpOnly: false, // Allow client-side access if needed
  })
}

