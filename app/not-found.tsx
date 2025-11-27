import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * 404 Not Found page
 * Displays when a page is not found
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold">404</CardTitle>
          <CardDescription className="text-lg">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/">Go home</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1"
            >
              Go back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

