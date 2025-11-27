/**
 * Utility script to create profiles for existing users who don't have one
 * This fixes cases where the database trigger didn't work
 * 
 * Usage: This can be run as a one-time script or scheduled job
 * 
 * Note: This script requires server-side execution (cannot run in browser)
 */

import { createClient } from '@/lib/supabase/server'
import { ensureProfileExists } from '@/lib/database/profiles'
import { logger } from '@/lib/logger'

/**
 * Creates profiles for all users in auth.users who don't have a profile
 * @returns Number of profiles created
 */
export async function createMissingProfiles(): Promise<number> {
  try {
    const supabase = await createClient()
    
    // Get all users from auth.users
    // Note: This requires admin access or a service role key
    // In production, you might want to use a service role client for this
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      logger.error('Error fetching users', usersError)
      return 0
    }

    if (!users || users.users.length === 0) {
      logger.info('No users found')
      return 0
    }

    let createdCount = 0

    // For each user, ensure they have a profile
    for (const user of users.users) {
      const profile = await ensureProfileExists(
        user.id,
        user.email || '',
        user.user_metadata?.full_name || undefined
      )

      if (profile) {
        createdCount++
        logger.info(`Created profile for user: ${user.email}`)
      }
    }

    logger.info(`Created ${createdCount} missing profiles`)
    return createdCount
  } catch (error) {
    logger.error('Error creating missing profiles', error)
    return 0
  }
}

// If running as a standalone script
if (require.main === module) {
  createMissingProfiles()
    .then((count) => {
      console.log(`✅ Created ${count} missing profiles`)
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}

