/**
 * Script to validate the database migration
 * Usage: npx tsx scripts/validate-migration.ts
 * 
 * Requires environment variables:
 * - DATABASE_URL
 * 
 * This script validates that the migration creates all required tables,
 * indexes, triggers, and functions correctly.
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ Missing required environment variable: DATABASE_URL')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

interface ValidationResult {
  name: string
  passed: boolean
  error?: string
}

async function validateMigration(): Promise<void> {
  console.log('🔍 Validating database migration...\n')

  const results: ValidationResult[] = []

  // 1. Check if tables exist
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('profiles', 'user_settings')
      ORDER BY table_name
    `

    const tableNames = tables.map((t: any) => t.table_name)
    const hasProfiles = tableNames.includes('profiles')
    const hasUserSettings = tableNames.includes('user_settings')

    results.push({
      name: 'Tables exist',
      passed: hasProfiles && hasUserSettings,
      error: hasProfiles && hasUserSettings 
        ? undefined 
        : `Missing tables. Found: ${tableNames.join(', ')}`
    })
  } catch (error: any) {
    results.push({
      name: 'Tables exist',
      passed: false,
      error: error.message
    })
  }

  // 2. Check profiles table structure
  try {
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = 'profiles'
      ORDER BY ordinal_position
    `

    const requiredColumns = ['id', 'email', 'full_name', 'avatar_url', 'role', 'created_at', 'updated_at']
    const columnNames = columns.map((c: any) => c.column_name)
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col))

    results.push({
      name: 'Profiles table structure',
      passed: missingColumns.length === 0,
      error: missingColumns.length > 0 
        ? `Missing columns: ${missingColumns.join(', ')}`
        : undefined
    })
  } catch (error: any) {
    results.push({
      name: 'Profiles table structure',
      passed: false,
      error: error.message
    })
  }

  // 3. Check user_settings table structure
  try {
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = 'user_settings'
      ORDER BY ordinal_position
    `

    const requiredColumns = ['id', 'user_id', 'locale', 'theme', 'notifications_enabled', 'email_notifications_enabled', 'created_at', 'updated_at']
    const columnNames = columns.map((c: any) => c.column_name)
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col))

    results.push({
      name: 'User settings table structure',
      passed: missingColumns.length === 0,
      error: missingColumns.length > 0 
        ? `Missing columns: ${missingColumns.join(', ')}`
        : undefined
    })
  } catch (error: any) {
    results.push({
      name: 'User settings table structure',
      passed: false,
      error: error.message
    })
  }

  // 4. Check indexes
  try {
    const indexes = await sql`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename IN ('profiles', 'user_settings')
      ORDER BY tablename, indexname
    `

    const indexNames = indexes.map((i: any) => i.indexname)
    const requiredIndexes = [
      'profiles_email_idx',
      'profiles_created_at_idx',
      'idx_profiles_role',
      'user_settings_user_id_idx',
      'user_settings_locale_idx'
    ]

    const missingIndexes = requiredIndexes.filter(idx => 
      !indexNames.some((name: string) => name.includes(idx.split('_')[0]))
    )

    results.push({
      name: 'Indexes exist',
      passed: missingIndexes.length === 0,
      error: missingIndexes.length > 0 
        ? `Missing indexes: ${missingIndexes.join(', ')}`
        : undefined
    })
  } catch (error: any) {
    results.push({
      name: 'Indexes exist',
      passed: false,
      error: error.message
    })
  }

  // 5. Check triggers
  try {
    const triggers = await sql`
      SELECT trigger_name, event_object_table
      FROM information_schema.triggers
      WHERE event_object_schema = 'public'
        AND event_object_table IN ('profiles', 'user_settings')
      ORDER BY event_object_table, trigger_name
    `

    const triggerNames = triggers.map((t: any) => t.trigger_name)
    const hasProfileTrigger = triggerNames.some((name: string) => name.includes('profile'))
    const hasSettingsTrigger = triggerNames.some((name: string) => name.includes('settings'))

    results.push({
      name: 'Triggers exist',
      passed: hasProfileTrigger && hasSettingsTrigger,
      error: hasProfileTrigger && hasSettingsTrigger
        ? undefined
        : `Missing triggers. Found: ${triggerNames.join(', ')}`
    })
  } catch (error: any) {
    results.push({
      name: 'Triggers exist',
      passed: false,
      error: error.message
    })
  }

  // 6. Check function
  try {
    const functions = await sql`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public'
        AND routine_name = 'handle_updated_at'
    `

    results.push({
      name: 'Function exists',
      passed: functions.length > 0,
      error: functions.length === 0 
        ? 'Missing function: handle_updated_at'
        : undefined
    })
  } catch (error: any) {
    results.push({
      name: 'Function exists',
      passed: false,
      error: error.message
    })
  }

  // 7. Check role constraint
  try {
    const constraints = await sql`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND constraint_name = 'profiles_role_check'
    `

    results.push({
      name: 'Role constraint exists',
      passed: constraints.length > 0,
      error: constraints.length === 0 
        ? 'Missing constraint: profiles_role_check'
        : undefined
    })
  } catch (error: any) {
    results.push({
      name: 'Role constraint exists',
      passed: false,
      error: error.message
    })
  }

  // Print results
  console.log('📊 Validation Results:\n')
  
  let allPassed = true
  for (const result of results) {
    const icon = result.passed ? '✅' : '❌'
    console.log(`${icon} ${result.name}`)
    if (result.error) {
      console.log(`   Error: ${result.error}`)
      allPassed = false
    }
  }

  console.log('\n' + '='.repeat(50))
  if (allPassed) {
    console.log('✅ All validations passed!')
    process.exit(0)
  } else {
    console.log('❌ Some validations failed. Please review the errors above.')
    process.exit(1)
  }
}

validateMigration().catch((error) => {
  console.error('❌ Validation error:', error)
  process.exit(1)
})

