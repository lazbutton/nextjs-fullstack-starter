import { createClient } from '@/lib/supabase/server'
import { ensureProfileExists } from '@/lib/database/profiles'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    // Ensure profile exists after email verification (fallback if trigger doesn't work)
    if (data?.user) {
      await ensureProfileExists(
        data.user.id,
        data.user.email || '',
        data.user.user_metadata?.full_name || undefined
      )
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}

