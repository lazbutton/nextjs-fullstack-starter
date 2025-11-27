-- Migration: Add user roles to profiles table
-- This migration adds a role column to support user authorization
-- Roles: 'user' (default), 'admin', 'moderator' (for future use)

-- Add role column with default value 'user'
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- Add check constraint to ensure valid role values
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'admin', 'moderator'));

-- Create index on role for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Add comment for documentation
COMMENT ON COLUMN profiles.role IS 'User role: user (default), admin, or moderator';

-- Update existing profiles to have 'user' role if NULL (safety check)
UPDATE profiles
SET role = 'user'
WHERE role IS NULL;

