# User Roles System

This document explains the user roles system and how to manage user permissions.

## Overview

The application uses a role-based access control (RBAC) system with three roles:

- **`user`** (default): Standard user with basic access
- **`moderator`**: User with moderation capabilities (for future use)
- **`admin`**: Administrator with full access to admin panel

## Database Schema

The `profiles` table includes a `role` column:

```sql
role TEXT NOT NULL DEFAULT 'user'
CHECK (role IN ('user', 'admin', 'moderator'))
```

## Role Hierarchy

Roles have a hierarchy system for permission checks:

- `user`: Level 1 (lowest)
- `moderator`: Level 2
- `admin`: Level 3 (highest)

## Protected Routes

### `/admin` - Admin Panel

The `/admin` route is protected and requires:
1. User to be authenticated
2. User to have `admin` role

**Access Control:**
- Non-authenticated users → Redirected to `/auth/sign-in`
- Authenticated users without admin role → Redirected to `/`
- Admin users → Access granted

## Promoting a User to Admin

### Method 1: Using the Script (Recommended)

1. Ensure you have `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local`:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the promotion script:
   ```bash
   npx tsx scripts/promote-to-admin.ts user@example.com
   ```

### Method 2: Via Supabase Dashboard

1. Go to Supabase Dashboard → **Table Editor** → `profiles`
2. Find the user you want to promote
3. Edit the `role` column
4. Change from `user` to `admin`
5. Save

### Method 3: Via SQL

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'user@example.com';
```

## Using Roles in Code

### Check User Role

```typescript
import { getProfile } from '@/lib/database/profiles'
import { isAdmin, isModeratorOrAdmin, hasRole } from '@/lib/auth/roles'

// Get user profile
const profile = await getProfile(userId)

// Check if admin
if (isAdmin(profile?.role)) {
  // Admin-only code
}

// Check if moderator or admin
if (isModeratorOrAdmin(profile?.role)) {
  // Moderator/Admin code
}

// Check specific role
if (hasRole(profile?.role, 'admin')) {
  // Admin code
}
```

### Require Admin in Server Components

```typescript
import { requireAdmin } from '@/lib/auth/utils'

export default async function AdminPage() {
  // This will redirect if not admin
  const { user, profile } = await requireAdmin()
  
  // Your admin-only code here
}
```

### Protect Routes in Middleware

The middleware automatically protects `/admin` routes. To protect other routes:

```typescript
// In middleware.ts
if (request.nextUrl.pathname.startsWith('/your-protected-route')) {
  const profile = await getProfile(user.id)
  if (!isAdmin(profile?.role)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
```

## Default Behavior

- **New users**: Automatically assigned `user` role
- **Profile creation**: Trigger sets role to `user` by default
- **Manual creation**: `ensureProfileExists` sets role to `user`

## Security Notes

1. **Never expose role checks to client-side** - Always verify on server
2. **Middleware protection** - First line of defense for routes
3. **Layout protection** - Second line of defense using `requireAdmin()`
4. **RLS policies** - Consider adding Row Level Security for role-based data access

## Future Enhancements

- Role-based RLS policies in database
- Role management UI in admin panel
- Permission system (granular permissions per role)
- Audit log for role changes

