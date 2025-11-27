/**
 * Database operations for profiles
 * Provides functions to interact with the profiles table
 */

import { createClient } from '@/lib/supabase/server'
import type { Profile, ProfileInsert, ProfileUpdate } from './types'
import { logger } from '@/lib/logger'
import { DEFAULT_ROLE } from '@/lib/auth/roles'

/**
 * Get a user profile by user ID
 * @param userId - User ID
 * @returns Profile or null if not found
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      logger.error('Error fetching profile', error)
      return null
    }

    return data as Profile
  } catch (error) {
    logger.error('Error fetching profile', error)
    return null
  }
}

/**
 * Get a user profile by email
 * @param email - User email
 * @returns Profile or null if not found
 */
export async function getProfileByEmail(email: string): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      logger.error('Error fetching profile by email', error)
      return null
    }

    return data as Profile
  } catch (error) {
    logger.error('Error fetching profile by email', error)
    return null
  }
}

/**
 * Create a new profile
 * @param profile - Profile data to insert
 * @returns Created profile or null on error
 */
export async function createProfile(profile: ProfileInsert): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()

    if (error) {
      logger.error('Error creating profile', error)
      return null
    }

    return data as Profile
  } catch (error) {
    logger.error('Error creating profile', error)
    return null
  }
}

/**
 * Update a user profile
 * @param userId - User ID
 * @param updates - Profile fields to update
 * @returns Updated profile or null on error
 */
export async function updateProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      logger.error('Error updating profile', error)
      return null
    }

    return data as Profile
  } catch (error) {
    logger.error('Error updating profile', error)
    return null
  }
}

/**
 * Delete a user profile
 * @param userId - User ID
 * @returns True if successful, false otherwise
 */
export async function deleteProfile(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('profiles').delete().eq('id', userId)

    if (error) {
      logger.error('Error deleting profile', error)
      return false
    }

    return true
  } catch (error) {
    logger.error('Error deleting profile', error)
    return false
  }
}

/**
 * Ensure a profile exists for a user
 * Creates a profile if it doesn't exist, returns existing profile if it does
 * This is a fallback in case the database trigger doesn't work
 * @param userId - User ID
 * @param email - User email
 * @param fullName - Optional full name
 * @returns Profile or null on error
 */
export async function ensureProfileExists(
  userId: string,
  email: string,
  fullName?: string
): Promise<Profile | null> {
  try {
    // First check if profile already exists
    const existingProfile = await getProfile(userId)
    if (existingProfile) {
      return existingProfile
    }

    // Profile doesn't exist, create it
    logger.info(`Creating profile for user ${userId} (trigger may not have fired)`)
    return await createProfile({
      id: userId,
      email,
      full_name: fullName || null,
      role: DEFAULT_ROLE,
    })
  } catch (error) {
    logger.error('Error ensuring profile exists', error)
    return null
  }
}

