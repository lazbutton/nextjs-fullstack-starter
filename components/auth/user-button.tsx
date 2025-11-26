'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export function UserButton() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div className="h-10 w-20 animate-pulse rounded bg-muted" />
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.push('/auth/sign-in')}>
          Sign In
        </Button>
        <Button onClick={() => router.push('/auth/sign-up')}>Sign Up</Button>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">{user.email}</span>
      <form action={handleSignOut}>
        <Button type="submit" variant="outline">
          Sign Out
        </Button>
      </form>
    </div>
  )
}

