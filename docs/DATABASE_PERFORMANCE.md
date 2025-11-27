# Database Performance Optimization Guide

This document outlines the performance optimizations implemented in the database schema and query patterns.

## Indexes

All indexes have been strategically placed to optimize common query patterns while minimizing write overhead.

### Profiles Table Indexes

1. **`profiles_email_idx`** (UNIQUE)
   - Index on `email` column
   - Optimizes: Email lookups (login, password reset, etc.)
   - Type: Unique B-tree index
   - Benefit: O(log n) lookup time for email searches

2. **`profiles_created_at_idx`** (DESC)
   - Index on `created_at` column (descending)
   - Optimizes: Sorting users by creation date, date range queries
   - Type: B-tree index with DESC ordering
   - Benefit: Fast reverse chronological sorting

3. **`profiles_updated_at_idx`** (DESC)
   - Index on `updated_at` column (descending)
   - Optimizes: Finding recently updated profiles
   - Type: B-tree index with DESC ordering

4. **`profiles_full_name_idx`**
   - Index on `full_name` column with text_pattern_ops
   - Optimizes: Text searches and LIKE queries on names
   - Type: B-tree index with text pattern operators
   - Benefit: Fast pattern matching (e.g., `WHERE full_name LIKE 'John%'`)

5. **`profiles_id_created_at_idx`** (Composite)
   - Composite index on `(id, created_at DESC)`
   - Optimizes: Paginated user lists with sorting
   - Type: Composite B-tree index
   - Benefit: Single index scan for sorted pagination

### User Settings Table Indexes

1. **`user_settings_user_id_idx`** (UNIQUE)
   - Index on `user_id` column (already exists from migration 002)
   - Optimizes: User settings lookups by user ID
   - Benefit: O(1) lookup via unique constraint

2. **`user_settings_locale_idx`**
   - Index on `locale` column (partial, WHERE locale IS NOT NULL)
   - Optimizes: Filtering users by locale preference
   - Benefit: Fast analytics queries by locale

3. **`user_settings_theme_idx`**
   - Index on `theme` column (partial, WHERE theme IS NOT NULL)
   - Optimizes: Filtering users by theme preference
   - Benefit: Fast analytics queries by theme

4. **`user_settings_user_locale_idx`** (Composite)
   - Composite index on `(user_id, locale)`
   - Optimizes: Queries filtering by user and locale
   - Benefit: Single index scan for compound filters

5. **`user_settings_created_at_idx`** (DESC)
   - Index on `created_at` column (descending)
   - Optimizes: Sorting settings by creation date

6. **`user_settings_updated_at_idx`** (DESC)
   - Index on `updated_at` column (descending)
   - Optimizes: Finding recently updated settings

## Query Optimization Patterns

### 1. Use Indexed Columns for WHERE Clauses

✅ **Good**: Uses index
```typescript
// Uses profiles_email_idx (unique index)
const profile = await getProfileByEmail('user@example.com')
```

✅ **Good**: Uses index
```typescript
// Uses profiles_id_created_at_idx (composite index)
const profiles = await supabase
  .from('profiles')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10)
```

❌ **Avoid**: Full table scan
```typescript
// No index on avatar_url - will scan all rows
const profile = await supabase
  .from('profiles')
  .select('*')
  .eq('avatar_url', 'https://...')
  .single()
```

### 2. Leverage Composite Indexes

✅ **Good**: Uses composite index
```typescript
// Uses profiles_id_created_at_idx
const profiles = await supabase
  .from('profiles')
  .select('*')
  .order('created_at', { ascending: false })
  .range(0, 9) // First page
```

### 3. Use LIMIT for Pagination

✅ **Good**: Limits result set
```typescript
const profiles = await supabase
  .from('profiles')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(20) // Only fetch what you need
```

❌ **Avoid**: Fetching all rows
```typescript
// Fetches ALL profiles - slow for large datasets
const allProfiles = await supabase
  .from('profiles')
  .select('*')
```

### 4. Select Only Needed Columns

✅ **Good**: Only selects needed columns
```typescript
const profiles = await supabase
  .from('profiles')
  .select('id, email, full_name') // Only needed columns
  .limit(10)
```

❌ **Avoid**: Selecting all columns when not needed
```typescript
// Fetches all columns including large text fields
const profiles = await supabase
  .from('profiles')
  .select('*')
```

### 5. Use Partial Indexes for Filtered Queries

The indexes include `WHERE` clauses for nullable columns:

```sql
-- Only indexes non-null values
CREATE INDEX profiles_full_name_idx ON public.profiles(full_name text_pattern_ops) 
WHERE full_name IS NOT NULL;
```

This reduces index size and improves performance for queries that filter on non-null values.

## Performance Monitoring

### Check Index Usage

```sql
-- View index usage statistics
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Analyze Query Plans

Use `EXPLAIN ANALYZE` to see which indexes are being used:

```sql
EXPLAIN ANALYZE
SELECT * FROM profiles
WHERE email = 'user@example.com';
```

Look for:
- ✅ `Index Scan` - Using an index (fast)
- ❌ `Seq Scan` - Full table scan (slow)

### Monitor Slow Queries

The codebase includes logging utilities in `lib/database/query-optimization.ts`:

```typescript
import { logSlowQuery } from '@/lib/database/query-optimization'

// Log queries that take longer than 100ms
logSlowQuery('profiles', 'getProfile', duration, 100)
```

## Best Practices

1. **Always use indexed columns for WHERE clauses** when possible
2. **Use LIMIT** to avoid fetching unnecessary data
3. **Select only needed columns** instead of `SELECT *`
4. **Leverage composite indexes** for multi-column queries
5. **Use pagination** for large result sets
6. **Monitor query performance** regularly
7. **Reindex periodically** if performance degrades over time

## Reindexing

If performance degrades over time, reindex tables:

```sql
-- Reindex all indexes on a table
REINDEX TABLE public.profiles;
REINDEX TABLE public.user_settings;

-- Or reindex specific index
REINDEX INDEX CONCURRENTLY profiles_email_idx;
```

**Note**: Use `CONCURRENTLY` in production to avoid locking tables.

## Statistics Updates

PostgreSQL query planner relies on statistics. Update them regularly:

```sql
-- Analyze tables to update statistics
ANALYZE public.profiles;
ANALYZE public.user_settings;

-- Or analyze entire database
ANALYZE;
```

The migration `003_add_performance_indexes.sql` includes `ANALYZE` statements, but you may want to run them periodically.

## Expected Performance

With these optimizations:

- **Email lookups**: < 1ms (unique index)
- **User ID lookups**: < 1ms (primary key)
- **Paginated lists (100 items)**: < 10ms (composite index)
- **Text searches**: < 50ms (pattern index)
- **Date range queries**: < 20ms (date indexes)

Actual performance depends on:
- Data volume
- Server resources
- Network latency
- Concurrent load

## Next Steps

1. ✅ Apply migration `003_add_performance_indexes.sql`
2. ✅ Monitor query performance
3. ✅ Use optimized query patterns
4. ✅ Update statistics periodically
5. ✅ Reindex if needed

## Additional Resources

- [PostgreSQL Index Types](https://www.postgresql.org/docs/current/indexes-types.html)
- [Supabase Performance Guide](https://supabase.com/docs/guides/database/performance)
- [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html)

