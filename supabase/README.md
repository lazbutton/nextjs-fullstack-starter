# Migrations Supabase

## Fichiers

- `001_create_profiles_table.sql` - Table profiles + trigger
- `002_create_user_settings_table.sql` - Préférences utilisateur
- `003_add_performance_indexes.sql` - Index pour performance

## Application

### Via Dashboard (recommandé)

1. **SQL Editor** → **New Query**
2. Copier-coller contenu migration
3. **Run**
4. Répéter pour chaque migration (ordre séquentiel)

### Via CLI

```bash
supabase login
supabase link --project-ref your-ref
supabase db push
```

## Schéma

### `profiles`
```sql
id (UUID PK) → auth.users(id)
email, full_name, avatar_url
created_at, updated_at
```
- RLS activé
- Trigger : création automatique à l'inscription

### `user_settings`
```sql
id (UUID PK)
user_id → profiles(id)
locale, theme
notifications_enabled, email_notifications_enabled
created_at, updated_at
```
- RLS activé

## Vérification

**Table Editor** → Vérifier tables `profiles` et `user_settings`

**Database** → **Triggers** → Vérifier `on_auth_user_created`

## Nouvelle Migration

1. Créer `XXX_description.sql` (numérotation séquentielle)
2. Tester en dev
3. Appliquer en prod
4. Mettre à jour documentation

## Dépannage

Voir `/docs/DATABASE.md`

## Ressources

- [Supabase Migrations](https://supabase.com/docs/guides/database/migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
