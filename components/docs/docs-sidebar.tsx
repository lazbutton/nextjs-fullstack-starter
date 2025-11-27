'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookOpen } from 'lucide-react'
import type { DocFile } from '@/lib/docs/scan'

/**
 * Documentation sidebar navigation
 * Displays all available documentation files
 */
export function DocsSidebar({
  docs,
  isAdmin = false,
}: {
  docs: DocFile[]
  isAdmin?: boolean
}) {
  const pathname = usePathname()
  const currentSlug = pathname.split('/').pop() || 'readme'
  // Adjust top position: 40px (admin banner) + 56px (header) = 96px when admin, 56px when not
  const topPosition = isAdmin ? 'top-24' : 'top-14'

  return (
    <aside className={`fixed ${topPosition} left-0 bottom-0 z-30 w-64 border-r bg-background`}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/docs/readme" className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span className="text-lg font-bold">Documentation</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {docs.map((doc) => {
            const isActive = currentSlug === doc.slug

            return (
              <Link
                key={doc.slug}
                href={`/docs/${doc.slug}`}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <span className="text-base">{doc.icon}</span>
                <span className="flex-1 truncate">{doc.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

