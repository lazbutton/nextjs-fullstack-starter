/**
 * Script to create or update a test admin user
 * Usage: npx tsx scripts/create-test-admin.ts
 * 
 * Requires environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
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

const TEST_EMAIL = 'doejohn@email.com'
const TEST_PASSWORD = 'test'

async function createOrUpdateTestAdmin() {
  console.log('Creating/updating test admin user...')
  console.log(`Email: ${TEST_EMAIL}`)
  console.log(`Password: ${TEST_PASSWORD}`)
  console.log(`Role: admin\n`)

  try {
    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error fetching users:', listError)
      process.exit(1)
    }

    const existingUser = existingUsers.users.find((u) => u.email === TEST_EMAIL)

    let userId: string

    if (existingUser) {
      console.log('User already exists, updating password and role...')
      userId = existingUser.id

      // Update password
      const { error: passwordError } = await supabase.auth.admin.updateUserById(userId, {
        password: TEST_PASSWORD,
      })

      if (passwordError) {
        console.error('Error updating password:', passwordError)
        process.exit(1)
      }

      console.log('✅ Password updated')
    } else {
      console.log('Creating new user...')
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        email_confirm: true, // Auto-confirm email
      })

      if (createError) {
        console.error('Error creating user:', createError)
        process.exit(1)
      }

      if (!newUser.user) {
        console.error('Failed to create user: No user returned')
        process.exit(1)
      }

      userId = newUser.user.id
      console.log('✅ User created')
    }

    // Ensure profile exists with admin role
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (existingProfile) {
      // Update existing profile to admin
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin', email: TEST_EMAIL })
        .eq('id', userId)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating profile:', updateError)
        process.exit(1)
      }

      console.log('✅ Profile updated to admin role')
      console.log(`Profile ID: ${updatedProfile.id}`)
      console.log(`Role: ${updatedProfile.role}`)
    } else {
      // Create new profile with admin role
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: TEST_EMAIL,
          role: 'admin',
          full_name: 'John Doe (Test Admin)',
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating profile:', insertError)
        process.exit(1)
      }

      console.log('✅ Profile created with admin role')
      console.log(`Profile ID: ${newProfile.id}`)
      console.log(`Role: ${newProfile.role}`)
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

