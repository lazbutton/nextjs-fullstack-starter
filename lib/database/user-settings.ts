/**
 * Database operations for user settings
 * Provides optimized functions to interact with the user_settings table
 */

import { createClient } from '@/lib/supabase/server'
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
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      logger.error('Error fetching user settings', error)
      return null
    }

    return data as UserSettings
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
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(settings, {
        onConflict: 'user_id',
      })
      .select()
      .single()

    if (error) {
      logger.error('Error upserting user settings', error)
      return null
    }

    return data as UserSettings
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
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      logger.error('Error updating user settings', error)
      return null
    }

    return data as UserSettings
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
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('locale', locale)
      .limit(limit)

    if (error) {
      logger.error('Error fetching users by locale', error)
      return []
    }

    return (data || []) as UserSettings[]
  } catch (error) {
    logger.error('Error fetching users by locale', error)
    return []
  }
}

