# Supabase Database Migrations

This directory contains SQL migration files for setting up and managing your Supabase database schema.

## Migration Files

- `001_create_profiles_table.sql` - Creates the profiles table linked to auth.users
- `002_create_user_settings_table.sql` - Creates user settings table for preferences

## How to Apply Migrations

### Option 1: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open each migration file in order (001, 002, etc.)
4. Copy and paste the SQL content
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Push migrations:
   ```bash
   supabase db push
   ```

### Option 3: Manual Application

1. Connect to your Supabase database using any PostgreSQL client
2. Execute each migration file in order
3. Verify that tables were created in the **Table Editor** in Supabase Dashboard

## Database Schema

### Tables

#### `public.profiles`
Stores additional user profile information linked to `auth.users`.

**Columns:**
- `id` (UUID, Primary Key) - References `auth.users(id)`
- `email` (TEXT) - User email
- `full_name` (TEXT) - User full name
- `avatar_url` (TEXT) - User avatar URL
- `created_at` (TIMESTAMP) - Profile creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Features:**
- Automatically created when a new user signs up (via trigger)
- Row Level Security (RLS) enabled
- Users can only view/update their own profile

#### `public.user_settings`
Stores user preferences and settings.

**Columns:**
- `id` (UUID, Primary Key)
- `user_id` (UUID) - References `public.profiles(id)`
- `locale` (TEXT) - User locale preference (default: 'en')
- `theme` (TEXT) - User theme preference (default: 'light')
- `notifications_enabled` (BOOLEAN) - Enable/disable notifications
- `email_notifications_enabled` (BOOLEAN) - Enable/disable email notifications
- `created_at` (TIMESTAMP) - Settings creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Features:**
- Row Level Security (RLS) enabled
- Users can only view/update their own settings

## Triggers

### `on_auth_user_created`
Automatically creates a profile entry when a new user signs up via Supabase Auth.

### `handle_updated_at`
Automatically updates the `updated_at` timestamp when a profile or settings record is updated.

## Row Level Security (RLS)

All tables have RLS enabled to ensure users can only access their own data:

- Users can **SELECT** their own records
- Users can **UPDATE** their own records
- Users can **INSERT** their own records

## Adding New Migrations

1. Create a new file in `supabase/migrations/` following the naming pattern:
   ```
   XXX_description.sql
   ```
   Where `XXX` is a sequential number (003, 004, etc.)

2. Write your migration SQL

3. Update this README with the new migration description

4. Apply the migration using one of the methods above

## Verifying Migrations

After applying migrations, verify in Supabase Dashboard:

1. Go to **Table Editor**
2. Check that `profiles` and `user_settings` tables exist
3. Verify columns match the schema above

## Troubleshooting

### Migration Fails

- Check that you're running migrations in order
- Verify you have the necessary permissions
- Check the Supabase Dashboard logs for error messages

### Profile Not Created

- Verify the trigger `on_auth_user_created` exists
- Check that the function `handle_new_user()` exists and is correct
- Test by creating a new user account

### RLS Issues

- Verify RLS policies are correctly set up
- Check that `auth.uid()` is accessible in your context
- Review Supabase logs for policy violations

## Next Steps

1. Apply all migrations
2. Test user registration to verify profile creation
3. Update your application code to use the new tables
4. Add additional migrations as needed for your application

