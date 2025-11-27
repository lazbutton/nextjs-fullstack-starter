import { Sidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { requireAdmin } from '@/lib/auth/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Admin Panel',
    template: '%s | Admin Panel',
  },
  description: 'Administrative panel for managing the application.',
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * Admin layout
 * Protected layout that requires admin role
 * Provides a sidebar navigation and header for admin pages
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Require admin role - redirects to home if not admin
  await requireAdmin()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

