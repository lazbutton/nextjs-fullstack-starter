/**
 * Admin API route to create a profile for the current authenticated user
 * This is useful to fix users who don't have a profile
 * 
 * Usage: GET /api/admin/create-profile
 * Requires: Authenticated user
 */

import { NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { ensureProfileExists } from '@/lib/database/profiles'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    // Get current authenticated user
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Ensure profile exists for this user
    const profile = await ensureProfileExists(
      session.user.id,
      session.user.email || '',
      session.user.name || undefined
    )

    if (!profile) {
      logger.error(`Failed to create profile for user ${session.user.id}`)
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      profile,
    })
  } catch (error) {
    logger.error('Error in create-profile route', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

