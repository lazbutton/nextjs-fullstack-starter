'use client'

import { useEffect, useState } from 'react'
import { type Locale, defaultLocale } from '@/i18n/config'
import { LOCALE_COOKIE_NAME } from './cookies'

export function useClientLocale(): Locale {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Read locale from cookie on client side
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
      ?.split('=')[1]

    if (cookieValue && ['en', 'fr'].includes(cookieValue)) {
      setLocale(cookieValue as Locale)
    }
  }, [])

  return locale
}

