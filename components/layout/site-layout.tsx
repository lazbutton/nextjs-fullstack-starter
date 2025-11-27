import { Header } from './header'
import { Footer } from './footer'
import { getCurrentUserRole } from '@/lib/auth/utils'
import { isAdmin } from '@/lib/auth/roles'

/**
 * Main site layout wrapper
 * Includes header and footer for public pages
 * Dynamically adjusts padding based on admin status
 */
export async function SiteLayout({ children }: { children: React.ReactNode }) {
  const userRole = await getCurrentUserRole()
  const userIsAdmin = isAdmin(userRole)
  // Padding: 10 (admin banner) + 56 (header height) = 66px when admin, 56px when not admin
  const paddingTop = userIsAdmin ? 'pt-[66px]' : 'pt-14'

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`flex-1 ${paddingTop}`}>{children}</main>
      <Footer />
    </div>
  )
}

