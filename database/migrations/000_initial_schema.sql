-- =====================================================
-- Initial Schema Migration for Neon Database
-- =====================================================
-- Description: Complete database schema for Neon PostgreSQL
-- Compatible with: Neon (PostgreSQL standard)
-- Authentication: Stack Auth (no Supabase dependencies)
-- Created: 2025-01-XX
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Profiles Table
-- =====================================================
-- Stores user profile information linked to Stack Auth users
-- Note: id references Stack Auth user ID (not auth.users)

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin', 'moderator'))
);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.role IS 'User role: user (default), admin, or moderator';
COMMENT ON TABLE public.profiles IS 'User profile information linked to Stack Auth users';

-- =====================================================
-- User Settings Table
-- =====================================================
-- Stores user preferences and settings

CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  locale TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE public.user_settings IS 'User preferences and application settings';

-- =====================================================
-- Accounts Table (for NextAuth)
-- =====================================================
-- Stores authentication credentials for NextAuth

CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(provider, provider_account_id)
);

COMMENT ON TABLE public.accounts IS 'NextAuth accounts table for OAuth providers';

-- =====================================================
-- Sessions Table (for NextAuth)
-- =====================================================
-- Stores user sessions for NextAuth

CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE public.sessions IS 'NextAuth sessions table';

-- =====================================================
-- Verification Tokens Table (for NextAuth)
-- =====================================================
-- Stores verification tokens for email verification and password reset

CREATE TABLE IF NOT EXISTS public.verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (identifier, token)
);

COMMENT ON TABLE public.verification_tokens IS 'NextAuth verification tokens table';

-- =====================================================
-- User Passwords Table
-- =====================================================
-- Stores hashed passwords for credential authentication

CREATE TABLE IF NOT EXISTS public.user_passwords (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE public.user_passwords IS 'Stores hashed passwords for credential authentication';

-- =====================================================
-- Functions
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Triggers
-- =====================================================

-- Trigger to update updated_at on profile update
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to update updated_at on user_settings update
DROP TRIGGER IF EXISTS on_user_settings_updated ON public.user_settings;
CREATE TRIGGER on_user_settings_updated
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to update updated_at on accounts update
DROP TRIGGER IF EXISTS on_accounts_updated ON public.accounts;
CREATE TRIGGER on_accounts_updated
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to update updated_at on sessions update
DROP TRIGGER IF EXISTS on_sessions_updated ON public.sessions;
CREATE TRIGGER on_sessions_updated
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to update updated_at on user_passwords update
DROP TRIGGER IF EXISTS on_user_passwords_updated ON public.user_passwords;
CREATE TRIGGER on_user_passwords_updated
  BEFORE UPDATE ON public.user_passwords
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Profiles table indexes
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_idx 
  ON public.profiles(email) 
  WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS profiles_created_at_idx 
  ON public.profiles(created_at DESC);

CREATE INDEX IF NOT EXISTS profiles_updated_at_idx 
  ON public.profiles(updated_at DESC);

CREATE INDEX IF NOT EXISTS profiles_full_name_idx 
  ON public.profiles(full_name text_pattern_ops) 
  WHERE full_name IS NOT NULL;

CREATE INDEX IF NOT EXISTS profiles_id_created_at_idx 
  ON public.profiles(id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_role 
  ON public.profiles(role);

-- User settings table indexes
CREATE INDEX IF NOT EXISTS user_settings_user_id_idx 
  ON public.user_settings(user_id);

CREATE INDEX IF NOT EXISTS user_settings_locale_idx 
  ON public.user_settings(locale) 
  WHERE locale IS NOT NULL;

CREATE INDEX IF NOT EXISTS user_settings_theme_idx 
  ON public.user_settings(theme) 
  WHERE theme IS NOT NULL;

CREATE INDEX IF NOT EXISTS user_settings_user_locale_idx 
  ON public.user_settings(user_id, locale);

CREATE INDEX IF NOT EXISTS user_settings_created_at_idx 
  ON public.user_settings(created_at DESC);

CREATE INDEX IF NOT EXISTS user_settings_updated_at_idx 
  ON public.user_settings(updated_at DESC);

-- NextAuth tables indexes
CREATE INDEX IF NOT EXISTS accounts_user_id_idx 
  ON public.accounts(user_id);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx 
  ON public.sessions(user_id);

CREATE INDEX IF NOT EXISTS sessions_expires_idx 
  ON public.sessions(expires);

-- =====================================================
-- Data Initialization
-- =====================================================

-- Ensure all existing profiles have a role (safety check)
UPDATE public.profiles
SET role = 'user'
WHERE role IS NULL;

-- =====================================================
-- Analyze Tables
-- =====================================================
-- Update statistics for query planner

ANALYZE public.profiles;
ANALYZE public.user_settings;
ANALYZE public.accounts;
ANALYZE public.sessions;
ANALYZE public.verification_tokens;
ANALYZE public.user_passwords;

-- =====================================================
-- Notes
-- =====================================================
-- 
-- Security:
-- - Row Level Security (RLS) is NOT enabled as we use Stack Auth
-- - Application-level security is handled by Stack Auth and middleware
-- - Database access is controlled via connection string security
--
-- Authentication:
-- - User authentication is handled by Stack Auth
-- - Profile creation is handled by application code (ensureProfileExists)
-- - No database triggers on auth.users (Stack Auth manages users separately)
--
-- Indexes:
-- - All indexes are optimized for common query patterns
-- - Partial indexes (WHERE clauses) reduce index size
-- - Monitor index usage with: SELECT * FROM pg_stat_user_indexes;
--
-- Performance:
-- - Indexes optimize read-heavy operations
-- - Slight overhead on INSERT/UPDATE is acceptable
-- - Consider REINDEX if performance degrades over time

