/**
 * Database operations for profiles
 * Provides functions to interact with the profiles table
 */

import { createClient } from '@/lib/neon/server'
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
    const sql = createClient()
    const result = await sql`
      SELECT * FROM profiles WHERE id = ${userId} LIMIT 1
    `

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return null
    }

    const rows = Array.isArray(result) ? result : [result]
    return rows[0] as Profile
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
    const sql = createClient()
    const result = await sql`
      SELECT * FROM profiles WHERE email = ${email} LIMIT 1
    `

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return null
    }

    const rows = Array.isArray(result) ? result : [result]
    return rows[0] as Profile
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
    const sql = createClient()
    const result = await sql`
      INSERT INTO profiles (id, email, full_name, avatar_url, role, created_at, updated_at)
      VALUES (${profile.id}, ${profile.email}, ${profile.full_name || null}, ${profile.avatar_url || null}, ${profile.role || DEFAULT_ROLE}, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        updated_at = NOW()
      RETURNING *
    `

    if (!result || (Array.isArray(result) && result.length === 0)) {
      logger.error('Failed to create profile - no result returned')
      return null
    }

    const rows = Array.isArray(result) ? result : [result]
    const createdProfile = rows[0] as Profile
    logger.info(`Profile created/updated for user: ${createdProfile.id}`)
    return createdProfile
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
    const sql = createClient()
    
    // Build update query conditionally
    if (updates.email !== undefined && updates.full_name !== undefined && updates.avatar_url !== undefined && updates.role !== undefined) {
      const result = await sql`
        UPDATE profiles 
        SET email = ${updates.email}, 
            full_name = ${updates.full_name}, 
            avatar_url = ${updates.avatar_url}, 
            role = ${updates.role},
            updated_at = NOW()
        WHERE id = ${userId}
        RETURNING *
      `
      if (!result || (Array.isArray(result) && result.length === 0)) {
        return null
      }
      const rows = Array.isArray(result) ? result : [result]
      return rows[0] as Profile
    }
    
    // Handle partial updates
    if (updates.email !== undefined) {
      const result = await sql`
        UPDATE profiles 
        SET email = ${updates.email}, updated_at = NOW()
        WHERE id = ${userId}
        RETURNING *
      `
      if (result && (Array.isArray(result) ? result.length > 0 : true)) {
        const rows = Array.isArray(result) ? result : [result]
        return rows[0] as Profile
      }
    }
    
    if (updates.full_name !== undefined) {
      const result = await sql`
        UPDATE profiles 
        SET full_name = ${updates.full_name}, updated_at = NOW()
        WHERE id = ${userId}
        RETURNING *
      `
      if (result && (Array.isArray(result) ? result.length > 0 : true)) {
        const rows = Array.isArray(result) ? result : [result]
        return rows[0] as Profile
      }
    }
    
    if (updates.avatar_url !== undefined) {
      const result = await sql`
        UPDATE profiles 
        SET avatar_url = ${updates.avatar_url}, updated_at = NOW()
        WHERE id = ${userId}
        RETURNING *
      `
      if (result && (Array.isArray(result) ? result.length > 0 : true)) {
        const rows = Array.isArray(result) ? result : [result]
        return rows[0] as Profile
      }
    }
    
    if (updates.role !== undefined) {
      const result = await sql`
        UPDATE profiles 
        SET role = ${updates.role}, updated_at = NOW()
        WHERE id = ${userId}
        RETURNING *
      `
      if (result && (Array.isArray(result) ? result.length > 0 : true)) {
        const rows = Array.isArray(result) ? result : [result]
        return rows[0] as Profile
      }
    }
    
    // No updates, just return existing profile
    return await getProfile(userId)
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
    const sql = createClient()
    await sql`DELETE FROM profiles WHERE id = ${userId}`
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

