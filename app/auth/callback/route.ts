import { ensureProfileExists } from '@/lib/database/profiles'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const next = requestUrl.searchParams.get('next') ?? '/'

  // NextAuth handles callbacks automatically
  // Get the current user after callback
  const session = await auth()

  // Ensure profile exists after email verification (fallback if trigger doesn't work)
  if (session?.user) {
    await ensureProfileExists(
      session.user.id,
      session.user.email || '',
      session.user.name || undefined
    )
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
