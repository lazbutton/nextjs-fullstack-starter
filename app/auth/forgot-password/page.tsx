import { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your password',
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>
        <ForgotPasswordForm />
        <div className="text-center text-sm">
          Remember your password?{' '}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

