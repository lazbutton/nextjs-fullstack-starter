'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { signOut } from 'next-auth/react'
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
    await signOut({ redirect: true, callbackUrl: '/auth/sign-in' })
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">{user.email}</span>
      <Button onClick={handleSignOut} variant="outline">
        Sign Out
      </Button>
    </div>
  )
}
