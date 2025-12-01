# Database Migrations for Neon

## Migration File

- `000_initial_schema.sql` - **Complete database schema**
  - Creates profiles table with role support
  - Creates user_settings table
  - Adds all performance indexes
  - Creates triggers for auto-updating timestamps
  - Compatible with Neon PostgreSQL
  - No Supabase dependencies

## Application

### Via Neon Dashboard (Recommended)

1. Open [neon.tech](https://neon.tech) → Your project
2. **SQL Editor** → **New Query**
3. Copy-paste content from `000_initial_schema.sql`
4. **Run** (Ctrl/Cmd + Enter)
5. Verify tables were created successfully

### Via psql CLI

```bash
# Connect to your Neon database
psql $DATABASE_URL

# Run the migration
\i database/migrations/000_initial_schema.sql
```

Or directly:

```bash
psql $DATABASE_URL -f database/migrations/000_initial_schema.sql
```

### Via Node.js Script

```bash
# Using tsx
npx tsx -e "
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
const sql = neon(process.env.DATABASE_URL!);
const migration = readFileSync('database/migrations/000_initial_schema.sql', 'utf8');
await sql(migration);
"
```

## Schema

### `profiles`
```sql
id (UUID PK) → Stack Auth user ID
email, full_name, avatar_url
role (user|admin|moderator)
created_at, updated_at
```
- No RLS (security handled by Stack Auth and application code)
- Trigger: auto-update `updated_at` on changes

### `user_settings`
```sql
id (UUID PK)
user_id → profiles(id)
locale, theme
notifications_enabled, email_notifications_enabled
created_at, updated_at
```
- No RLS (security handled by Stack Auth and application code)
- Trigger: auto-update `updated_at` on changes

## Verification

**Neon Dashboard** → **Tables** → Verify:
- ✅ `profiles` table exists
- ✅ `user_settings` table exists
- ✅ Indexes are created (check in table details)

**SQL Query** to verify:
```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'user_settings');

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('profiles', 'user_settings');

-- Check triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'public';
```

## Important Notes

### Key Features

1. **No Row Level Security (RLS)**: Security is handled at the application level with Stack Auth
2. **No auth.users reference**: Profiles reference Stack Auth user IDs directly
3. **No automatic profile creation trigger**: Profile creation is handled by application code (`ensureProfileExists`)
4. **No authenticated role**: Database access is controlled via connection string security
5. **Single migration file**: All schema changes in one file for easy setup

### Security

- Database access is secured via connection strings
- User authentication is handled by Stack Auth
- Application-level authorization checks user roles from profiles table
- Middleware protects routes based on Stack Auth sessions

## Troubleshooting

See `/docs/DATABASE.md` for detailed troubleshooting.

### Common Issues

1. **"relation already exists"**: Tables already exist. Either:
   - Drop existing tables (dev only): `DROP TABLE IF EXISTS user_settings CASCADE; DROP TABLE IF EXISTS profiles CASCADE;`
   - Or skip migration if schema is correct

2. **"extension uuid-ossp does not exist"**: Neon should have this enabled by default. If not, contact Neon support.

3. **"permission denied"**: Check your DATABASE_URL has proper permissions.

## Resources

- [Neon Documentation](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Stack Auth Documentation](https://docs.stack-auth.com)
