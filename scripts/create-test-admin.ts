/**
 * Script to create or update a test admin user
 * Usage: npx tsx scripts/create-test-admin.ts
 * 
 * Requires environment variables:
 * - DATABASE_URL
 * 
 * Creates user with:
 * - Email: doejohn@email.com
 * - Password: test
 * - Role: admin
 * 
 * Note: This script automatically loads variables from .env.local
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@/lib/neon/server'
import { getProfile, createProfile, updateProfile } from '@/lib/database/profiles'
import bcrypt from 'bcryptjs'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const TEST_EMAIL = 'doejohn@email.com'
const TEST_PASSWORD = 'test'

async function createOrUpdateTestAdmin() {
  console.log('Creating/updating test admin user...')
  console.log(`Email: ${TEST_EMAIL}`)
  console.log(`Password: ${TEST_PASSWORD}`)
  console.log(`Role: admin\n`)

  try {
    const sql = createClient()
    
    // Check if user already exists
    const existingResult = await sql`
      SELECT id FROM profiles WHERE email = ${TEST_EMAIL} LIMIT 1
    `

    let userId: string

    if (existingResult && (Array.isArray(existingResult) ? existingResult.length > 0 : true)) {
      console.log('User already exists, updating password and role...')
      const rows = Array.isArray(existingResult) ? existingResult : [existingResult]
      userId = (rows[0] as { id: string }).id

      // Update password
      const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)
      await sql`
        INSERT INTO user_passwords (user_id, password_hash)
        VALUES (${userId}, ${hashedPassword})
        ON CONFLICT (user_id) DO UPDATE SET password_hash = ${hashedPassword}
      `

      console.log('✅ Password updated')
    } else {
      console.log('Creating new user...')
      // Generate user ID
      userId = crypto.randomUUID()

      // Create profile
      const newProfile = await createProfile({
        id: userId,
        email: TEST_EMAIL,
        role: 'admin',
        full_name: 'John Doe (Test Admin)',
      })

      if (!newProfile) {
        console.error('Failed to create profile')
        process.exit(1)
      }

      // Hash and store password
      const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10)
      await sql`
        INSERT INTO user_passwords (user_id, password_hash)
        VALUES (${userId}, ${hashedPassword})
      `

      console.log('✅ User created')
    }

    // Ensure profile has admin role
    const existingProfile = await getProfile(userId)

    if (existingProfile && existingProfile.role !== 'admin') {
      // Update existing profile to admin
      const updatedProfile = await updateProfile(userId, {
        role: 'admin',
        email: TEST_EMAIL,
      })

      if (!updatedProfile) {
        console.error('Error updating profile')
        process.exit(1)
      }

      console.log('✅ Profile updated to admin role')
      console.log(`Profile ID: ${updatedProfile.id}`)
      console.log(`Role: ${updatedProfile.role}`)
    } else if (existingProfile) {
      console.log('✅ Profile already has admin role')
      console.log(`Profile ID: ${existingProfile.id}`)
      console.log(`Role: ${existingProfile.role}`)
    }

    console.log('\n✅ Test admin user is ready!')
    console.log(`\nYou can now sign in with:`)
    console.log(`  Email: ${TEST_EMAIL}`)
    console.log(`  Password: ${TEST_PASSWORD}`)
    console.log(`\nThe user has admin privileges and can access /admin`)
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

createOrUpdateTestAdmin()
  .then(() => {
    console.log('\nDone!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
