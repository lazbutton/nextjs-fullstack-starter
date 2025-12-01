# Database Configuration

## Quick Start

### 1. Apply migrations

**Via Neon Dashboard** (recommended):
1. Open [neon.tech](https://neon.tech) → Your project
2. **SQL Editor** → **New Query**
3. Copy-paste content from `/database/migrations/000_initial_schema.sql`
4. **Run** (Ctrl/Cmd + Enter)
5. Verify tables were created successfully

**Via psql CLI**:
```bash
# Connect to your Neon database and run the migration
psql $DATABASE_URL -f database/migrations/000_initial_schema.sql
```

**Validate the migration**:
```bash
# Run validation script to verify everything was created correctly
npx tsx scripts/validate-migration.ts
```

**Note**: Use only `000_initial_schema.sql` which contains the complete database schema compatible with Neon.

### 2. Verify

**Neon Dashboard** → **Tables** → Check presence of:
- ✅ `profiles`
- ✅ `user_settings`

**Database** → **Triggers** → Check:
- ✅ `on_auth_user_created` (if using database triggers for profile creation)

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

## Security

Database security is handled at the application level:
- Users can view/modify **only their own data** (enforced in application code)
- Stack Auth handles authentication and user management

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
2. Drop and recreate (dev only - **⚠️ WARNING: This will delete all data**):
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

2. Check **Logs** in Neon Dashboard

### RLS errors

```sql
-- Verify RLS enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Verify policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

## Resources

- [Neon Documentation](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
