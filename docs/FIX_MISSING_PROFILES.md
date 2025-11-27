# Créer les Profils Manquants

Si des utilisateurs dans `auth.users` n'ont pas de profil dans `profiles` :

## Solution 1 : Création automatique

La fonction `ensureProfileExists` est appelée lors de :
- Inscription (`signUp`)
- Connexion (`signIn`)
- Callback email

**Pour créer votre profil maintenant** :
Visitez `/api/admin/create-profile` (si connecté)

## Solution 2 : Création manuelle

### Via Supabase Dashboard

**Table Editor** → `profiles` → **Insert row** :
- `id` : UUID depuis `auth.users`
- `email` : Email utilisateur
- `full_name` : Optionnel

### Via SQL

```sql
INSERT INTO public.profiles (id, email, created_at, updated_at)
VALUES (
  'USER_UUID',
  'user@example.com',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
```

## Vérifier Trigger

**Database** → **Triggers** → Vérifier `on_auth_user_created` existe

Si absent, réexécuter `001_create_profiles_table.sql`.

## Causes Possibles

1. Migration non appliquée
2. Permissions RLS bloquent insertion
3. Erreur dans fonction `handle_new_user()`

## Solution Permanente

Le code crée maintenant explicitement le profil lors de l'inscription/connexion, même si le trigger échoue.
