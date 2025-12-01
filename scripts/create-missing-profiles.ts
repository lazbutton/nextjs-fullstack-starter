/**
 * Utility script to create profiles for existing users who don't have one
 * This fixes cases where the database trigger didn't work
 * 
 * Usage: This can be run as a one-time script or scheduled job
 * 
 * Note: This script requires server-side execution (cannot run in browser)
 * Requires: DATABASE_URL environment variable
 */

import { createClient } from '@/lib/neon/server'
import { ensureProfileExists } from '@/lib/database/profiles'
import { logger } from '@/lib/logger'

/**
 * Creates profiles for all users who don't have a profile
 * @returns Number of profiles created
 */
export async function createMissingProfiles(): Promise<number> {
  try {
    const sql = createClient()
    
    // Get all users who have passwords but no profile
    const usersResult = await sql`
      SELECT DISTINCT user_id, email FROM user_passwords
      LEFT JOIN profiles ON user_passwords.user_id = profiles.id
      WHERE profiles.id IS NULL
    `

    if (!usersResult || (Array.isArray(usersResult) && usersResult.length === 0)) {
      logger.info('No users without profiles found')
      return 0
    }

    const users = Array.isArray(usersResult) ? usersResult : [usersResult]
    let createdCount = 0

    // For each user, ensure they have a profile
    for (const user of users) {
      const userRow = user as { user_id: string; email?: string | null }
      const profile = await ensureProfileExists(
        userRow.user_id,
        userRow.email || '',
        undefined
      )

      if (profile) {
        createdCount++
        logger.info(`Created profile for user: ${userRow.email}`)
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
