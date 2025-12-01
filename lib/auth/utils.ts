import { auth } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/database/profiles'
import { isAdmin } from '@/lib/auth/roles'
import type { UserRole } from '@/lib/auth/roles'

export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  return session.user
}

/**
 * Require user to be authenticated and have admin role
 * Redirects to home if not admin
 * @returns User and profile with admin role
 */
export async function requireAdmin() {
  const user = await requireAuth()
  const profile = await getProfile(user.id)

  if (!profile || !isAdmin(profile.role)) {
    redirect('/')
  }

  return { user, profile }
}

export async function requireNoAuth() {
  const session = await auth()

  if (session?.user) {
    redirect('/')
  }

  return null
}

/**
 * Get current user role without redirecting
 * Returns null if user is not authenticated or has no profile
 * @returns User role or null
 */
export async function getCurrentUserRole(): Promise<'admin' | 'moderator' | 'user' | null> {
  try {
    const session = await auth()

    if (!session?.user) {
      return null
    }

    const profile = await getProfile(session.user.id)
    return profile?.role ?? null
  } catch (error) {
    return null
  }
}
