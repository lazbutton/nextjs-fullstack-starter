'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { locales, type Locale } from '@/i18n/config'
import { changeLocale } from '@/app/actions/locale'

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale || isPending) return
    
    startTransition(async () => {
      await changeLocale(newLocale)
      router.refresh()
    })
  }

  return (
    <div className="flex gap-2">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          disabled={isPending}
          className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
            currentLocale === loc
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

