import { Metadata } from 'next'
import { SignInForm } from '@/components/auth/sign-in-form'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="mt-2 text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        <SignInForm />
        <div className="text-center text-sm">
          <Link
            href="/auth/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

