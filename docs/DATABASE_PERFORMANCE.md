# Performance Base de Données

## Index

### Profiles

```sql
profiles_email_idx              (email) UNIQUE        - Lookups email < 1ms
profiles_created_at_idx         (created_at DESC)     - Tri chronologique
profiles_full_name_idx          (full_name)           - Recherche texte
profiles_id_created_at_idx      (id, created_at DESC) - Pagination
```

### User Settings

```sql
user_settings_user_id_idx       (user_id) UNIQUE      - Lookup user < 1ms
user_settings_locale_idx        (locale)              - Filtrage locale
user_settings_theme_idx         (theme)               - Filtrage thème
user_settings_user_locale_idx   (user_id, locale)     - Composite
```

## Bonnes Pratiques

### ✅ À FAIRE

```typescript
// 1. Utiliser colonnes indexées
await supabase
  .from('profiles')
  .select('*')
  .eq('email', 'user@example.com') // Index unique

// 2. LIMIT pour pagination
await supabase
  .from('profiles')
  .select('*')
  .limit(20)

// 3. Sélectionner colonnes nécessaires
await supabase
  .from('profiles')
  .select('id, email, full_name')

// 4. Utiliser composite indexes
await supabase
  .from('profiles')
  .select('*')
  .order('created_at', { ascending: false })
  .range(0, 9)
```

### ❌ À ÉVITER

```typescript
// Colonnes non indexées
.eq('avatar_url', 'https://...') // Scan complet

// SELECT * sans nécessité
.select('*') // Quand seules quelques colonnes nécessaires

// Pas de LIMIT
.select('*') // Récupère TOUTES les lignes
```

## Monitoring

### Vérifier utilisation index

```sql
SELECT indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Analyser plan de requête

```sql
EXPLAIN ANALYZE
SELECT * FROM profiles WHERE email = 'user@example.com';

-- ✅ Chercher : Index Scan (rapide)
-- ❌ Éviter : Seq Scan (lent)
```

### Logger requêtes lentes

```typescript
import { logSlowQuery } from '@/lib/database/query-optimization'

logSlowQuery('profiles', 'getProfile', duration, 100) // Log si > 100ms
```

## Maintenance

### Reindexation

```sql
-- Périodique si dégradation performance
REINDEX INDEX CONCURRENTLY profiles_email_idx;
REINDEX TABLE CONCURRENTLY public.profiles;
```

### Statistiques

```sql
-- Mettre à jour statistiques pour optimiseur
ANALYZE public.profiles;
ANALYZE public.user_settings;
```

## Performance Cibles

| Opération | Temps cible |
|-----------|-------------|
| Lookup email/ID | < 1ms |
| Pagination (100 items) | < 10ms |
| Recherche texte | < 50ms |
| Requêtes date | < 20ms |

## Règles d'Or

1. **Index = WHERE clauses** - Indexer colonnes fréquemment requêtées
2. **LIMIT toujours** - Éviter récupérer toutes les lignes
3. **Sélection minimale** - Uniquement colonnes nécessaires
4. **Composite index** - Pour requêtes multi-colonnes
5. **Monitor régulièrement** - EXPLAIN ANALYZE + logs

## Ressources

- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [Supabase Performance](https://supabase.com/docs/guides/database/performance)
