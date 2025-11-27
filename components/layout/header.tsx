import Link from 'next/link'
import { UserButton } from '@/components/auth/user-button'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { getLocale } from '@/lib/i18n/cookies'
import { getCurrentUserRole } from '@/lib/auth/utils'
import { isAdmin } from '@/lib/auth/roles'
import { Shield } from 'lucide-react'

/**
 * Site header component
 * Displays navigation links, locale switcher, and user button
 */
export async function Header() {
  const locale = await getLocale()
  const userRole = await getCurrentUserRole()
  const userIsAdmin = isAdmin(userRole)

  return (
    <>
      {/* Admin banner above navbar */}
      {userIsAdmin && (
        <div className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-primary text-primary-foreground">
          <div className="container flex h-10 items-center justify-center px-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ cursor: 'pointer' }}
            >
              <Shield className="h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      )}
      <header
        className={`fixed left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          userIsAdmin ? 'top-10' : 'top-0'
        }`}
      >
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Next.js Template</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/docs"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Documentation
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LocaleSwitcher currentLocale={locale} />
            <UserButton />
          </div>
        </div>
      </header>
    </>
  )
}

