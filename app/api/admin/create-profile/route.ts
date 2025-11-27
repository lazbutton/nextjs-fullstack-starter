/**
 * Admin API route to create a profile for the current authenticated user
 * This is useful to fix users who don't have a profile
 * 
 * Usage: GET /api/admin/create-profile
 * Requires: Authenticated user
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureProfileExists } from '@/lib/database/profiles'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Ensure profile exists for this user
    const profile = await ensureProfileExists(
      user.id,
      user.email || '',
      user.user_metadata?.full_name || undefined
    )

    if (!profile) {
      logger.error(`Failed to create profile for user ${user.id}`)
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

