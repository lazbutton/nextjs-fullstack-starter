-- Migration: Add performance indexes
-- Description: Adds indexes to optimize database query performance for faster data retrieval
-- Created: 2025-01-XX

-- =====================================================
-- Profiles Table Optimizations
-- =====================================================

-- Make email index unique for faster lookups (if not already unique)
-- Drop existing index if it exists and recreate as unique
DROP INDEX IF EXISTS public.profiles_email_idx;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email) WHERE email IS NOT NULL;

-- Index on created_at for sorting/filtering by creation date
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at DESC);

-- Index on updated_at for sorting/filtering by update date
CREATE INDEX IF NOT EXISTS profiles_updated_at_idx ON public.profiles(updated_at DESC);

-- Index on full_name for text searches (using GIN for full-text search capabilities)
-- Using text_pattern_ops for LIKE queries optimization
CREATE INDEX IF NOT EXISTS profiles_full_name_idx ON public.profiles(full_name text_pattern_ops) WHERE full_name IS NOT NULL;

-- Composite index for common query patterns (id + created_at for sorted user lists)
CREATE INDEX IF NOT EXISTS profiles_id_created_at_idx ON public.profiles(id, created_at DESC);

-- =====================================================
-- User Settings Table Optimizations
-- =====================================================

-- Index on user_id is already created in migration 002, but ensure it's optimized
-- The existing index should be sufficient, but we can add a composite index if needed

-- Index on locale for filtering users by locale (useful for analytics)
CREATE INDEX IF NOT EXISTS user_settings_locale_idx ON public.user_settings(locale) WHERE locale IS NOT NULL;

-- Index on theme for filtering users by theme preference
CREATE INDEX IF NOT EXISTS user_settings_theme_idx ON public.user_settings(theme) WHERE theme IS NOT NULL;

-- Composite index for common settings queries
CREATE INDEX IF NOT EXISTS user_settings_user_locale_idx ON public.user_settings(user_id, locale);

-- Index on created_at for sorting settings by creation date
CREATE INDEX IF NOT EXISTS user_settings_created_at_idx ON public.user_settings(created_at DESC);

-- Index on updated_at for tracking recent settings changes
CREATE INDEX IF NOT EXISTS user_settings_updated_at_idx ON public.user_settings(updated_at DESC);

-- =====================================================
-- Additional Performance Optimizations
-- =====================================================

-- Analyze tables to update statistics for query planner
ANALYZE public.profiles;
ANALYZE public.user_settings;

-- =====================================================
-- Notes on Index Usage
-- =====================================================
-- 
-- These indexes optimize the following query patterns:
-- 1. Email lookups: profiles_email_idx (unique, fast equality checks)
-- 2. User ID lookups: Primary key (already indexed automatically)
-- 3. Date range queries: created_at/updated_at indexes
-- 4. Text searches: full_name index with text_pattern_ops
-- 5. Sorting: DESC indexes for reverse chronological order
-- 6. Composite queries: Multi-column indexes for common joins
--
-- Index maintenance:
-- - PostgreSQL automatically maintains indexes
-- - REINDEX may be needed if performance degrades over time
-- - Monitor index usage with: SELECT * FROM pg_stat_user_indexes;
--
-- Performance considerations:
-- - Indexes slightly slow down INSERT/UPDATE operations
-- - Benefits far outweigh costs for read-heavy applications
-- - Partial indexes (WHERE clauses) reduce index size and maintenance overhead

