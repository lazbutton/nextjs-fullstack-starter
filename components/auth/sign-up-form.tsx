'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { signUp } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SignUpForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await signUp(formData)
      if (!result.success) {
        setError(result.error || 'An error occurred')
      } else {
        // After successful signup, sign in the user automatically
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        
        const signInResult = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })
        
        if (signInResult?.ok) {
          // User is logged in - redirect to home
          router.push('/')
          router.refresh()
        } else {
          // Signup succeeded but sign-in failed - show error
          setError('Account created but failed to sign in. Please sign in manually.')
        }
      }
    })
  }

  if (success) {
    // Check if email verification is enabled
    // Note: This is a client-side check, the actual verification status is handled server-side
    const emailVerificationEnabled =
      process.env.NEXT_PUBLIC_ENABLE_EMAIL_VERIFICATION !== 'false'

    if (emailVerificationEnabled) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>We've sent you a verification link</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please check your email and click the verification link to complete your registration.
            </p>
          </CardContent>
        </Card>
      )
    } else {
      // This case should not happen if auto-login works correctly
      // But keeping it as fallback in case email verification was just disabled
      return (
        <Card>
          <CardHeader>
            <CardTitle>Account created successfully!</CardTitle>
            <CardDescription>Please sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your account has been created. Please sign in to continue.
            </p>
            <Button onClick={() => router.push('/auth/sign-in')} className="w-full">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

