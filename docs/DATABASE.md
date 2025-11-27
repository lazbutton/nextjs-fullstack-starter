# Database Configuration

## Quick Start

### 1. Apply migrations

**Via Supabase Dashboard** (recommended):
1. Open [supabase.com](https://supabase.com) → Your project
2. **SQL Editor** → **New Query**
3. Copy-paste content from `/supabase/migrations/001_create_profiles_table.sql`
4. **Run** (Ctrl/Cmd + Enter)
5. Repeat for `002_create_user_settings_table.sql`
6. Repeat for `003_add_performance_indexes.sql`

**Via Supabase CLI**:
```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

### 2. Verify

**Table Editor** → Check presence of:
- ✅ `profiles`
- ✅ `user_settings`

**Database** → **Triggers** → Check:
- ✅ `on_auth_user_created`

### 3. Test

1. Create a user account
2. Verify that a profile is automatically created in `profiles`

## Tables

### `profiles`
User information linked to `auth.users`.

```sql
id            UUID PRIMARY KEY → auth.users(id)
email         TEXT
full_name     TEXT
avatar_url    TEXT
created_at    TIMESTAMP
updated_at    TIMESTAMP
```

**Automatic creation**: Trigger on sign up.

### `user_settings`
User preferences.

```sql
id                           UUID PRIMARY KEY
user_id                      UUID → profiles(id)
locale                       TEXT (default: 'en')
theme                        TEXT (default: 'light')
notifications_enabled        BOOLEAN
email_notifications_enabled  BOOLEAN
created_at                   TIMESTAMP
updated_at                   TIMESTAMP
```

## Security (RLS)

Row Level Security enabled on all tables:
- Users can view/modify **only their own data**

## Usage in code

```typescript
import { getProfile, updateProfile } from '@/lib/database'

// Get profile
const profile = await getProfile(userId)

// Update
await updateProfile(userId, {
  full_name: 'John Doe',
  avatar_url: 'https://...'
})
```

## Troubleshooting

### Migration fails: "relation already exists"

Table already exists. Options:
1. Ignore (if structure is correct)
2. Drop and recreate (dev only):
```sql
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
-- Re-run migrations
```

### Profile not created on signup

1. Verify trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. Check **Logs** in Supabase Dashboard

### RLS errors

```sql
-- Verify RLS enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Verify policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

## Resources

- [Supabase Migrations](https://supabase.com/docs/guides/database/migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
