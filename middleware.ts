/**
 * Middleware for NextAuth session management and route protection
 * 
 * Note: Next.js 16 deprecates the middleware file convention in favor of "proxy".
 * However, this middleware is required for NextAuth session handling.
 * 
 * See: https://nextjs.org/docs/messages/middleware-to-proxy
 * NextAuth: https://next-auth.js.org
 */

import { auth } from '@/app/api/auth/[...nextauth]/route'
import { NextRequest, NextResponse } from 'next/server'
import { getProfile } from '@/lib/database/profiles'
import { isAdmin } from '@/lib/auth/roles'

export async function middleware(request: NextRequest) {
  // NextAuth handles session management automatically via cookies
  // Protect /admin routes - require admin role
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const session = await auth()

      if (!session?.user) {
        // Not authenticated - redirect to sign in
        const signInUrl = new URL('/auth/sign-in', request.url)
        signInUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(signInUrl)
      }

      // Check if user has admin role by querying profile directly
      const profile = await getProfile(session.user.id)

      if (!profile || !isAdmin(profile.role)) {
        // Not admin - redirect to home
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      // On error, redirect to home for security
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (NextAuth routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
