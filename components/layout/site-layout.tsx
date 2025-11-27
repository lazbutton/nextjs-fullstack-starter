import { Header } from './header'
import { Footer } from './footer'

/**
 * Main site layout wrapper
 * Includes header and footer for public pages
 */
export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-14">{children}</main>
      <Footer />
    </div>
  )
}

