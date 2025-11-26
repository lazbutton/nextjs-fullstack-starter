'use server'

import { revalidatePath } from 'next/cache'
import { type Locale, locales, defaultLocale } from '@/i18n/config'
import { setLocale } from '@/lib/i18n/cookies'

export async function changeLocale(locale: Locale) {
  // Validate locale
  if (!locales.includes(locale)) {
    locale = defaultLocale
  }

  // Set cookie using the helper function
  await setLocale(locale)

  // Revalidate all pages to update with new locale
  revalidatePath('/', 'layout')
  
  return { success: true, locale }
}

