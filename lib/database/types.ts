/**
 * Database type definitions
 * These types represent the structure of your Supabase database tables
 */

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  locale: string
  theme: string
  notifications_enabled: boolean
  email_notifications_enabled: boolean
  created_at: string
  updated_at: string
}

export interface ProfileInsert {
  id: string
  email?: string | null
  full_name?: string | null
  avatar_url?: string | null
}

export interface ProfileUpdate {
  email?: string | null
  full_name?: string | null
  avatar_url?: string | null
}

export interface UserSettingsInsert {
  user_id: string
  locale?: string
  theme?: string
  notifications_enabled?: boolean
  email_notifications_enabled?: boolean
}

export interface UserSettingsUpdate {
  locale?: string
  theme?: string
  notifications_enabled?: boolean
  email_notifications_enabled?: boolean
}

/**
 * Pagination parameters for optimized queries
 */
export interface PaginationParams {
  page: number
  pageSize: number
  offset: number
}

/**
 * Sort parameters for optimized queries
 */
export interface SortParams {
  orderBy: string
  orderDirection: 'asc' | 'desc'
}

