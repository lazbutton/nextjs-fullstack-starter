'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales, type Locale } from '@/i18n/config'
import { getLocalizedPathname } from '@/lib/i18n'

export function LocaleSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (locale: Locale) => {
    const localizedPath = getLocalizedPathname(pathname, locale)
    router.push(localizedPath)
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className="rounded px-3 py-1 text-sm hover:bg-accent"
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

