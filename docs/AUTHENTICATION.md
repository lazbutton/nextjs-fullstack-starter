# Authentication Implementation

This document describes the complete authentication system implemented in this project.

## Features

- ✅ User registration (sign up)
- ✅ User login (sign in)
- ✅ User logout (sign out)
- ✅ Email verification
- ✅ Password reset (forgot password)
- ✅ Welcome emails
- ✅ Password reset emails
- ✅ Protected routes
- ✅ Session management

## Architecture

### Server Actions (`app/actions/auth.ts`)

All authentication logic is handled via Server Actions:

- `signUp()` - Create a new user account
- `signIn()` - Authenticate existing user
- `signOut()` - End user session
- `resetPassword()` - Send password reset email
- `updatePassword()` - Update user password
- `getCurrentUser()` - Get current authenticated user

### Email Templates (`lib/emails/`)

Email templates for:
- Welcome email - Sent after user registration
- Verification email - Sent for email verification (if enabled in Supabase)
- Password reset email - Sent when user requests password reset

### Pages

- `/auth/sign-in` - Login page
- `/auth/sign-up` - Registration page
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - New password form
- `/auth/callback` - OAuth/Email verification callback

### Components

- `components/auth/sign-in-form.tsx` - Login form
- `components/auth/sign-up-form.tsx` - Registration form
- `components/auth/forgot-password-form.tsx` - Password reset form
- `components/auth/reset-password-form.tsx` - New password form
- `components/auth/user-button.tsx` - User menu with sign out

### Hooks

- `hooks/use-auth.ts` - Client-side authentication hook

## Database Setup

Supabase automatically creates the `auth.users` table when you enable authentication. However, you need to apply database migrations to create additional tables for user profiles.

### Applying Database Migrations

**IMPORTANT**: Before using the application, you must apply the database migrations located in `/supabase/migrations/`.

1. Go to your Supabase Dashboard → SQL Editor
2. Open each migration file in order (001, 002, etc.)
3. Copy and paste the SQL content
4. Click "Run" to execute the migration

See `/supabase/README.md` for detailed instructions on applying migrations.

### Database Tables

After applying migrations, the following tables will be available:

#### `auth.users` (Automatic)
- `id` (UUID) - User ID
- `email` (text) - User email
- `email_confirmed_at` (timestamp) - Email verification timestamp
- `created_at` (timestamp) - Account creation timestamp
- `updated_at` (timestamp) - Last update timestamp

#### `public.profiles` (Created by migration)
- `id` (UUID) - References `auth.users(id)`
- `email` (TEXT) - User email
- `full_name` (TEXT) - User full name
- `avatar_url` (TEXT) - User avatar URL
- `created_at` (TIMESTAMP) - Profile creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Note**: A profile is automatically created when a new user signs up (via database trigger).

#### `public.user_settings` (Created by migration)
- `id` (UUID) - Settings ID
- `user_id` (UUID) - References `public.profiles(id)`
- `locale` (TEXT) - User locale preference
- `theme` (TEXT) - User theme preference
- `notifications_enabled` (BOOLEAN) - Enable/disable notifications
- `email_notifications_enabled` (BOOLEAN) - Enable/disable email notifications
- `created_at` (TIMESTAMP) - Settings creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

## Email Configuration

### Resend Setup

1. Create an account on [Resend](https://resend.com)
2. Verify your domain (required for production)
3. Get your API key
4. Add to `.env.local`:
   ```env
   RESEND_API_KEY=your_api_key
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

### Supabase Email Templates

Supabase can also send emails directly. To configure:
1. Go to Supabase Dashboard > Authentication > Email Templates
2. Customize templates as needed
3. Configure SMTP settings if using custom email provider

## Route Protection

### Protect Routes (Require Authentication)

```typescript
import { requireAuth } from '@/lib/auth/utils'

export default async function ProtectedPage() {
  const user = await requireAuth() // Redirects to /auth/sign-in if not authenticated
  
  return <div>Protected content for {user.email}</div>
}
```

### Redirect If Authenticated

```typescript
import { requireNoAuth } from '@/lib/auth/utils'

export default async function PublicPage() {
  await requireNoAuth() // Redirects to / if already authenticated
  
  return <div>Public content</div>
}
```

## Client-Side Authentication

Use the `useAuth` hook in client components:

```typescript
'use client'

import { useAuth } from '@/hooks/use-auth'

export function MyComponent() {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>
  
  return <div>Welcome, {user.email}!</div>
}
```

## Environment Variables

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication Settings
ENABLE_EMAIL_VERIFICATION=true
```

### Email Verification Control

The `ENABLE_EMAIL_VERIFICATION` variable controls whether verification emails are sent after user registration:

- **`true` or `1`**: Email verification enabled (default, secure)
- **`false` or `0`**: Email verification disabled
- **Not set**: Defaults to `true` (secure by default)

**Important**: When `ENABLE_EMAIL_VERIFICATION` is set to `false`, you must also configure Supabase to auto-confirm email addresses:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers** > **Email**
3. Enable **"Confirm email"** setting
4. **IMPORTANT**: Also enable **"Auto Confirm"** to allow users to sign in immediately without email verification

When email verification is disabled:
- Users can sign in immediately after registration (no email verification required)
- No verification email is sent via Resend
- Users are automatically redirected to the home page after signup
- This is useful for development or when you want to skip email verification

**Note**: If `ENABLE_EMAIL_VERIFICATION=false` but Supabase is not configured for auto-confirm, users will not receive a session and will see an error message. Make sure both settings are aligned.

## Supabase Configuration

### Enable Email Authentication

1. Go to Supabase Dashboard
2. Click on **"Authentication"** in the left sidebar
3. Click on **"Providers"** (or **"Auth Providers"**)
4. Find **"Email"** in the list and click on it
5. Enable the Email provider
6. Configure email settings:
   - **Confirm email**: Enable if you want email verification
   - **Auto Confirm**: Enable to automatically confirm users without email verification
   - **Secure email change**: Enable for security

**Note**: The exact location may vary depending on your Supabase dashboard version. If you can't find these settings, try:
- Authentication > Settings (or Configuration)
- Authentication > Auth Providers > Email

### Redirect URLs

Add these redirect URLs in Supabase Dashboard > Authentication > URL Configuration:

- `http://localhost:3000/auth/callback` (development)
- `https://yourdomain.com/auth/callback` (production)

## Security Notes

- Passwords are hashed by Supabase (never stored in plain text)
- Sessions are managed via HTTP-only cookies
- CSRF protection is handled by Next.js
- Email verification helps prevent fake accounts
- Password reset links expire after 1 hour (configurable)

## Next Steps

1. Configure Supabase authentication settings
2. Set up Resend domain verification
3. Customize email templates
4. Add additional user profile fields if needed
5. Implement role-based access control (RBAC) if needed

