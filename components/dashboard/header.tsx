import { UserButton } from '@/components/auth/user-button'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { getLocale } from '@/lib/i18n/cookies'

/**
 * Dashboard header
 * Displays user actions and locale switcher
 */
export async function DashboardHeader() {
  const locale = await getLocale()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <LocaleSwitcher currentLocale={locale} />
        <UserButton />
      </div>
    </header>
  )
}

