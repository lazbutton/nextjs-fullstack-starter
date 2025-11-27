'use client'

import { useEffect } from 'react'

/**
 * Global error boundary for the root layout
 * This catches errors in the root layout itself
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background p-8">
          <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-6">
            <h1 className="text-2xl font-bold">Application Error</h1>
            <p className="text-muted-foreground">
              A critical error occurred. Please refresh the page or contact support if the problem persists.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-mono text-xs text-muted-foreground">
                  {error.message}
                </p>
              </div>
            )}
            <button
              onClick={reset}
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

