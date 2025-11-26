/**
 * Middleware for Supabase session management
 * 
 * Note: Next.js 16 deprecates the middleware file convention in favor of "proxy".
 * However, this middleware is required for Supabase SSR session handling.
 * The middleware ensures user sessions are refreshed and managed correctly.
 * 
 * See: https://nextjs.org/docs/messages/middleware-to-proxy
 * Supabase SSR: https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

