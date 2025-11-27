# Authentication

## Features

- Sign Up / Sign In / Sign Out
- Email verification
- Password reset
- Route protection
- Emails (Supabase for auth + Resend for welcome)

## Architecture

### Server Actions (`app/actions/auth.ts`)

```typescript
signUp()          // Sign up
signIn()          // Sign in
signOut()         // Sign out
resetPassword()   // Request password reset
updatePassword()  // Update password
getCurrentUser()  // Current user
```

### Pages

- `/auth/sign-in` - Sign in
- `/auth/sign-up` - Sign up
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password` - New password
- `/auth/callback` - OAuth/Email callback

### Components

```
components/auth/
  sign-in-form.tsx
  sign-up-form.tsx
  forgot-password-form.tsx
  reset-password-form.tsx
  user-button.tsx
```

### Hook

```typescript
import { useAuth } from '@/hooks/use-auth'

const { user, loading } = useAuth()
```

## Configuration

### 1. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Resend (welcome email)
RESEND_API_KEY=your_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email verification (optional)
ENABLE_EMAIL_VERIFICATION=true  # false to disable
```

### 2. Supabase Dashboard

**Authentication** → **Providers** → **Email** :
- ✅ Enable Email provider
- ✅ Configure email confirmations (if verification desired)

**Authentication** → **URL Configuration** :
- Add: `http://localhost:3000/auth/callback` (dev)
- Add: `https://yourdomain.com/auth/callback` (prod)

### 3. Migrations

Apply migrations (see `docs/DATABASE.md`) :
- `001_create_profiles_table.sql`
- `002_create_user_settings_table.sql`

## Route Protection

### Server Components

```typescript
import { requireAuth } from '@/lib/auth/utils'

export default async function ProtectedPage() {
  const user = await requireAuth() // Redirects if not authenticated
  return <div>Protected: {user.email}</div>
}
```

### Redirect if authenticated

```typescript
import { requireNoAuth } from '@/lib/auth/utils'

export default async function PublicPage() {
  await requireNoAuth() // Redirects if already authenticated
  return <div>Public content</div>
}
```

## Emails

### Hybrid Approach

**Supabase** (automatic) :
- Email verification
- Password reset email

**Resend** (manual) :
- Welcome email only

See `docs/EMAIL_GUIDE.md` for details.

### Disable email verification

1. `.env.local`: `ENABLE_EMAIL_VERIFICATION=false`
2. **Supabase Dashboard** → **Authentication** → **Providers** → **Email**:
   - Enable "Auto Confirm"

## Security

- Passwords hashed by Supabase
- Sessions via HTTP-only cookies
- CSRF protection (Next.js)
- RLS on database tables

## Resources

- [Supabase Auth](https://supabase.com/docs/guides/auth)
