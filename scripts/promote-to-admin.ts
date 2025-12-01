/**
 * Script to promote a user to admin role
 * Usage: npx tsx scripts/promote-to-admin.ts <user-email>
 * 
 * Requires environment variables:
 * - DATABASE_URL
 * 
 * Note: This script automatically loads variables from .env.local
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@/lib/neon/server'
import { updateProfile } from '@/lib/database/profiles'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

async function promoteToAdmin(email: string) {
  console.log(`Promoting user ${email} to admin...`)

  const sql = createClient()
  
  // Find the user by email in profiles table
  const result = await sql`
    SELECT id FROM profiles WHERE email = ${email} LIMIT 1
  `

  if (!result || (Array.isArray(result) && result.length === 0)) {
    console.error(`User with email ${email} not found`)
    process.exit(1)
  }

  const rows = Array.isArray(result) ? result : [result]
  const userId = (rows[0] as { id: string }).id

  // Update the profile role
  const profile = await updateProfile(userId, { role: 'admin' })

  if (!profile) {
    console.error('Error updating profile')
    process.exit(1)
  }

  console.log(`✅ User ${email} has been promoted to admin!`)
  console.log(`Profile ID: ${profile.id}`)
  console.log(`Role: ${profile.role}`)
}

// Get email from command line arguments
const email = process.argv[2]

if (!email) {
  console.error('Usage: npx tsx scripts/promote-to-admin.ts <user-email>')
  process.exit(1)
}

promoteToAdmin(email)
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
