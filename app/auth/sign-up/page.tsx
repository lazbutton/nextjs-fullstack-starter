import { Metadata } from 'next'
import { SignUpForm } from '@/components/auth/sign-up-form'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account to start building your application with our modern Next.js template.',
  keywords: ['sign up', 'register', 'create account', 'new user'],
  openGraph: {
    title: 'Sign Up - Next.js Template',
    description: 'Create a new account to get started with our platform.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="mt-2 text-muted-foreground">Create a new account to get started</p>
        </div>
        <SignUpForm />
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

