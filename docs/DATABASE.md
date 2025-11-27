# Database Setup Guide

This guide explains how to set up and manage your Supabase database for this project.

## Quick Start

1. **Apply Migrations**: Go to Supabase Dashboard → SQL Editor and run the migrations in `/supabase/migrations/` in order
2. **Verify**: Check that tables `profiles` and `user_settings` exist in Table Editor
3. **Test**: Create a user account and verify that a profile is automatically created

## Migration Files

All migration files are located in `/supabase/migrations/`:

- `001_create_profiles_table.sql` - Creates profiles table and triggers
- `002_create_user_settings_table.sql` - Creates user settings table

## How to Apply Migrations

### Method 1: Supabase Dashboard (Recommended)

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open the first migration file (`001_create_profiles_table.sql`)
5. Copy all the SQL content
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl/Cmd + Enter)
8. Verify success message appears
9. Repeat for `002_create_user_settings_table.sql`

### Method 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Method 3: Direct PostgreSQL Connection

If you have direct access to your PostgreSQL database:

```bash
# Connect to your database and run migrations
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/001_create_profiles_table.sql
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/002_create_user_settings_table.sql
```

## Verifying Migrations

After applying migrations, verify in Supabase Dashboard:

1. Go to **Table Editor**
2. You should see:
   - `profiles` table
   - `user_settings` table

3. Check table structure:
   - Click on each table to view columns
   - Verify columns match the schema in `/supabase/README.md`

4. Check triggers:
   - Go to **Database** → **Triggers**
   - Verify `on_auth_user_created` trigger exists

## Testing the Setup

1. **Test Profile Creation**:
   - Sign up a new user account
   - Go to **Table Editor** → `profiles`
   - Verify that a new profile row was created automatically

2. **Test Row Level Security**:
   - Try querying profiles from SQL Editor
   - Verify that you can only see your own profile when logged in

## Troubleshooting

### Migration Fails with "relation already exists"

This means the table already exists. You can either:

1. Skip the migration (if the table structure is correct)
2. Drop and recreate (only in development):
   ```sql
   DROP TABLE IF EXISTS public.user_settings CASCADE;
   DROP TABLE IF EXISTS public.profiles CASCADE;
   -- Then re-run the migrations
   ```

### Profile Not Created on Signup

1. Check that the trigger exists:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. Check that the function exists:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   ```

3. Check trigger logs in Supabase Dashboard → Logs

### Row Level Security Issues

1. Verify RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
   ```

2. Check policies:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

### Permission Denied Errors

Make sure you're using the Supabase Dashboard SQL Editor or have proper permissions. If using a direct connection, ensure you're connected as the `postgres` role or a role with sufficient privileges.

## Database Functions and Triggers

### `handle_new_user()`

Automatically creates a profile when a new user signs up.

**Trigger**: `on_auth_user_created` on `auth.users`

### `handle_updated_at()`

Automatically updates the `updated_at` timestamp when a record is updated.

**Triggers**: 
- `on_profile_updated` on `public.profiles`
- `on_user_settings_updated` on `public.user_settings`

## Adding New Migrations

When you need to add new tables or modify existing ones:

1. Create a new file in `/supabase/migrations/`:
   ```
   XXX_description.sql
   ```
   Where `XXX` is the next sequential number (003, 004, etc.)

2. Write your migration SQL

3. Test the migration in a development environment first

4. Apply to production

5. Update this documentation

## Using Database Functions in Code

The database utilities are located in `/lib/database/`:

```typescript
import { getProfile, updateProfile } from '@/lib/database'

// Get user profile
const profile = await getProfile(userId)

// Update profile
await updateProfile(userId, {
  full_name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg'
})
```

## Next Steps

1. ✅ Apply all migrations
2. ✅ Verify tables exist
3. ✅ Test user registration
4. ✅ Customize schema as needed for your application
5. Add additional migrations for your specific features

## Resources

- [Supabase Migration Guide](https://supabase.com/docs/guides/database/migrations)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/triggers.html)

