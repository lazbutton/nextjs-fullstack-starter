# Database Performance

## Indexes

### Profiles

```sql
profiles_email_idx              (email) UNIQUE        - Email lookups < 1ms
profiles_created_at_idx         (created_at DESC)     - Chronological sorting
profiles_full_name_idx          (full_name)           - Text search
profiles_id_created_at_idx      (id, created_at DESC) - Pagination
```

### User Settings

```sql
user_settings_user_id_idx       (user_id) UNIQUE      - User lookup < 1ms
user_settings_locale_idx        (locale)              - Locale filtering
user_settings_theme_idx         (theme)               - Theme filtering
user_settings_user_locale_idx   (user_id, locale)     - Composite
```

## Best Practices

### ✅ TO DO

```typescript
// 1. Use indexed columns
await supabase
  .from('profiles')
  .select('*')
  .eq('email', 'user@example.com') // Unique index

// 2. LIMIT for pagination
await supabase
  .from('profiles')
  .select('*')
  .limit(20)

// 3. Select only needed columns
await supabase
  .from('profiles')
  .select('id, email, full_name')

// 4. Use composite indexes
await supabase
  .from('profiles')
  .select('*')
  .order('created_at', { ascending: false })
  .range(0, 9)
```

### ❌ TO AVOID

```typescript
// Non-indexed columns
.eq('avatar_url', 'https://...') // Full table scan

// SELECT * unnecessarily
.select('*') // When only a few columns needed

// No LIMIT
.select('*') // Retrieves ALL rows
```

## Monitoring

### Check index usage

```sql
SELECT indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Analyze query plan

```sql
EXPLAIN ANALYZE
SELECT * FROM profiles WHERE email = 'user@example.com';

-- ✅ Look for: Index Scan (fast)
-- ❌ Avoid: Seq Scan (slow)
```

### Log slow queries

```typescript
import { logSlowQuery } from '@/lib/database/query-optimization'

logSlowQuery('profiles', 'getProfile', duration, 100) // Log if > 100ms
```

## Maintenance

### Reindexing

```sql
-- Periodic if performance degradation
REINDEX INDEX CONCURRENTLY profiles_email_idx;
REINDEX TABLE CONCURRENTLY public.profiles;
```

### Statistics

```sql
-- Update statistics for optimizer
ANALYZE public.profiles;
ANALYZE public.user_settings;
```

## Performance Targets

| Operation | Target Time |
|-----------|-------------|
| Email/ID lookup | < 1ms |
| Pagination (100 items) | < 10ms |
| Text search | < 50ms |
| Date queries | < 20ms |

## Golden Rules

1. **Index = WHERE clauses** - Index frequently queried columns
2. **Always use LIMIT** - Avoid retrieving all rows
3. **Minimal selection** - Only necessary columns
4. **Composite index** - For multi-column queries
5. **Monitor regularly** - EXPLAIN ANALYZE + logs

## Resources

- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [Supabase Performance](https://supabase.com/docs/guides/database/performance)
