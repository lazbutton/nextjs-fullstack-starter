# Configuration Base de Données

## Démarrage Rapide

### 1. Appliquer les migrations

**Via Supabase Dashboard** (recommandé) :
1. Ouvrir [supabase.com](https://supabase.com) → Votre projet
2. **SQL Editor** → **New Query**
3. Copier-coller le contenu de `/supabase/migrations/001_create_profiles_table.sql`
4. **Run** (Ctrl/Cmd + Enter)
5. Répéter pour `002_create_user_settings_table.sql`
6. Répéter pour `003_add_performance_indexes.sql`

**Via Supabase CLI** :
```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

### 2. Vérifier

**Table Editor** → Vérifier la présence de :
- ✅ `profiles`
- ✅ `user_settings`

**Database** → **Triggers** → Vérifier :
- ✅ `on_auth_user_created`

### 3. Tester

1. Créer un compte utilisateur
2. Vérifier qu'un profil est créé automatiquement dans `profiles`

## Tables

### `profiles`
Informations utilisateur liées à `auth.users`.

```sql
id            UUID PRIMARY KEY → auth.users(id)
email         TEXT
full_name     TEXT
avatar_url    TEXT
created_at    TIMESTAMP
updated_at    TIMESTAMP
```

**Création automatique** : Trigger lors de l'inscription.

### `user_settings`
Préférences utilisateur.

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

## Sécurité (RLS)

Row Level Security activé sur toutes les tables :
- Utilisateurs voient/modifient **uniquement leurs propres données**

## Utilisation dans le code

```typescript
import { getProfile, updateProfile } from '@/lib/database'

// Récupérer profil
const profile = await getProfile(userId)

// Mettre à jour
await updateProfile(userId, {
  full_name: 'John Doe',
  avatar_url: 'https://...'
})
```

## Dépannage

### Migration échoue : "relation already exists"

Table existe déjà. Options :
1. Ignorer (si structure correcte)
2. Supprimer et recréer (dev uniquement) :
```sql
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
-- Réexécuter migrations
```

### Profil non créé à l'inscription

1. Vérifier trigger existe :
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. Consulter **Logs** dans Supabase Dashboard

### Erreurs RLS

```sql
-- Vérifier RLS activé
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Vérifier policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

## Ressources

- [Supabase Migrations](https://supabase.com/docs/guides/database/migrations)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
