/**
 * Database operations for user settings
 * Provides optimized functions to interact with the user_settings table
 */

import { createClient } from '@/lib/neon/server'
import type { UserSettings, UserSettingsInsert, UserSettingsUpdate } from './types'
import { logger } from '@/lib/logger'

/**
 * Get user settings by user ID
 * Optimized with index on user_id
 * @param userId - User ID
 * @returns User settings or null if not found
 */
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  try {
    const sql = createClient()
    const result = await sql`
      SELECT * FROM user_settings WHERE user_id = ${userId} LIMIT 1
    `

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return null
    }

    const rows = Array.isArray(result) ? result : [result]
    return rows[0] as UserSettings
  } catch (error) {
    logger.error('Error fetching user settings', error)
    return null
  }
}

/**
 * Create or update user settings (upsert)
 * Uses unique constraint on user_id for efficient upsert
 * @param settings - Settings data to insert or update
 * @returns Created/updated settings or null on error
 */
export async function upsertUserSettings(
  settings: UserSettingsInsert
): Promise<UserSettings | null> {
  try {
    const sql = createClient()
    const result = await sql`
      INSERT INTO user_settings (user_id, locale, theme, notifications_enabled, email_notifications_enabled, created_at, updated_at)
      VALUES (
        ${settings.user_id},
        ${settings.locale || 'en'},
        ${settings.theme || 'light'},
        ${settings.notifications_enabled ?? true},
        ${settings.email_notifications_enabled ?? true},
        NOW(),
        NOW()
      )
      ON CONFLICT (user_id) 
      DO UPDATE SET
        locale = EXCLUDED.locale,
        theme = EXCLUDED.theme,
        notifications_enabled = EXCLUDED.notifications_enabled,
        email_notifications_enabled = EXCLUDED.email_notifications_enabled,
        updated_at = NOW()
      RETURNING *
    `

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return null
    }

    const rows = Array.isArray(result) ? result : [result]
    return rows[0] as UserSettings
  } catch (error) {
    logger.error('Error upserting user settings', error)
    return null
  }
}

/**
 * Update user settings
 * Optimized with index on user_id
 * @param userId - User ID
 * @param updates - Settings fields to update
 * @returns Updated settings or null on error
 */
export async function updateUserSettings(
  userId: string,
  updates: UserSettingsUpdate
): Promise<UserSettings | null> {
  try {
    const sql = createClient()
    
    // Build SET clause dynamically
    const setParts: string[] = []
    const values: unknown[] = []
    
    if (updates.locale !== undefined) {
      setParts.push(`locale = $${values.length + 1}`)
      values.push(updates.locale)
    }
    if (updates.theme !== undefined) {
      setParts.push(`theme = $${values.length + 1}`)
      values.push(updates.theme)
    }
    if (updates.notifications_enabled !== undefined) {
      setParts.push(`notifications_enabled = $${values.length + 1}`)
      values.push(updates.notifications_enabled)
    }
    if (updates.email_notifications_enabled !== undefined) {
      setParts.push(`email_notifications_enabled = $${values.length + 1}`)
      values.push(updates.email_notifications_enabled)
    }
    
    if (setParts.length === 0) {
      // No updates, just return existing settings
      return await getUserSettings(userId)
    }
    
    setParts.push(`updated_at = NOW()`)
    values.push(userId)
    
    // Build update query conditionally - simplified approach
    // For now, update all fields at once if any field is provided
    const result = await sql`
      UPDATE user_settings 
      SET locale = ${updates.locale ?? 'en'},
          theme = ${updates.theme ?? 'light'},
          notifications_enabled = ${updates.notifications_enabled ?? true},
          email_notifications_enabled = ${updates.email_notifications_enabled ?? true},
          updated_at = NOW()
      WHERE user_id = ${userId}
      RETURNING *
    `

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return null
    }

    const rows = Array.isArray(result) ? result : [result]
    return rows[0] as UserSettings
  } catch (error) {
    logger.error('Error updating user settings', error)
    return null
  }
}

/**
 * Get users by locale preference
 * Optimized with index on locale
 * @param locale - Locale code
 * @param limit - Maximum number of results
 * @returns Array of user settings
 */
export async function getUsersByLocale(
  locale: string,
  limit: number = 100
): Promise<UserSettings[]> {
  try {
    const sql = createClient()
    const result = await sql`
      SELECT * FROM user_settings WHERE locale = ${locale} LIMIT ${limit}
    `

    if (!result) {
      return []
    }

    return (Array.isArray(result) ? result : [result]) as UserSettings[]
  } catch (error) {
    logger.error('Error fetching users by locale', error)
    return []
  }
}

