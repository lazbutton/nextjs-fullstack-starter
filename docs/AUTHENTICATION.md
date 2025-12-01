# Authentication

## Features

- Sign Up / Sign In / Sign Out
- Email verification
- Password reset
- Route protection
- Emails (Stack Auth for auth + Resend for welcome)

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
# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_client_key
STACK_SECRET_SERVER_KEY=your_secret_server_key

# Resend (welcome email)
RESEND_API_KEY=your_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Stack Auth Dashboard

**Stack Auth** → **Project Settings** :
- ✅ Configure email provider
- ✅ Set up email templates (verification, password reset)
- ✅ Configure redirect URLs:
  - Add: `http://localhost:3000/auth/callback` (dev)
  - Add: `https://yourdomain.com/auth/callback` (prod)

### 3. Migrations

Apply the database migration (see `docs/DATABASE.md`) :
- `000_initial_schema.sql` - Complete database schema

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

**Stack Auth** (automatic) :
- Email verification
- Password reset email

**Resend** (manual) :
- Welcome email only

See `docs/EMAIL_GUIDE.md` for details.

## Security

- Passwords hashed by Stack Auth
- Sessions via HTTP-only cookies
- CSRF protection (Next.js)
- Application-level data access control

## Resources

- [Stack Auth Documentation](https://docs.stack-auth.com)
