/**
 * Script to promote a user to admin role
 * Usage: npx tsx scripts/promote-to-admin.ts <user-email>
 * 
 * Requires environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * 
 * Note: This script automatically loads variables from .env.local
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function promoteToAdmin(email: string) {
  console.log(`Promoting user ${email} to admin...`)

  // First, find the user by email
  const { data: authUser, error: authError } = await supabase.auth.admin.listUsers()
  
  if (authError) {
    console.error('Error fetching users:', authError)
    process.exit(1)
  }

  const user = authUser.users.find((u) => u.email === email)

  if (!user) {
    console.error(`User with email ${email} not found`)
    process.exit(1)
  }

  // Update the profile role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', user.id)
    .select()
    .single()

  if (profileError) {
    console.error('Error updating profile:', profileError)
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

