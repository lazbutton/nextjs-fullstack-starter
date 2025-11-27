import { LoadingSpinner } from '@/components/ui/loading-spinner'

/**
 * Global loading component
 * Displays while pages are loading
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <LoadingSpinner size="lg" />
    </div>
  )
}

