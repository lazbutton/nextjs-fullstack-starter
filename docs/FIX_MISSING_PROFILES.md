# Comment créer les profils manquants

Si vous avez des utilisateurs dans `auth.users` qui n'ont pas de profil dans la table `profiles`, voici comment les corriger :

## Solution 1 : Création automatique lors de la prochaine connexion

La fonction `ensureProfileExists` est maintenant appelée lors de :
- L'inscription (`signUp`)
- La connexion (`signIn`)
- La vérification d'email via callback

Les profils seront donc créés automatiquement lors de la prochaine action de l'utilisateur.

**Pour créer votre profil maintenant** (si vous êtes déjà connecté) :
1. Visitez `/api/admin/create-profile` dans votre navigateur (ou utilisez curl/Postman)
2. Le profil sera créé automatiquement pour l'utilisateur connecté

## Solution 2 : Créer un profil manuellement pour un utilisateur existant

Si vous avez déjà un utilisateur existant sans profil, vous pouvez :

### Option A : Utiliser le script utilitaire (recommandé)

Un script est disponible dans `scripts/create-missing-profiles.ts` (à créer si nécessaire). Pour l'utiliser :

1. Créer une route API temporaire ou un Server Action
2. Appeler la fonction `ensureProfileExists` avec l'ID et l'email de l'utilisateur

### Option B : Créer directement dans Supabase Dashboard

1. Allez dans Supabase Dashboard > Table Editor > `profiles`
2. Cliquez sur "Insert row"
3. Remplissez :
   - `id` : L'UUID de l'utilisateur depuis `auth.users`
   - `email` : L'email de l'utilisateur
   - `full_name` : Optionnel
4. Cliquez sur "Save"

### Option C : Utiliser SQL directement

Connectez-vous au SQL Editor dans Supabase Dashboard et exécutez :

```sql
-- Remplacer 'USER_ID' et 'user@example.com' par les valeurs réelles
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
VALUES (
  'USER_ID',
  'user@example.com',
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
```

## Vérifier que le trigger fonctionne

Pour vérifier que le trigger SQL fonctionne correctement :

1. Allez dans Supabase Dashboard > Database > Triggers
2. Vérifiez que le trigger `on_auth_user_created` existe sur la table `auth.users`
3. Vérifiez que la fonction `handle_new_user()` existe dans Database > Functions

Si le trigger n'existe pas, vous devez appliquer la migration `001_create_profiles_table.sql` dans Supabase Dashboard > SQL Editor.

## Causes possibles du problème

Le trigger peut ne pas fonctionner si :
1. La migration n'a pas été appliquée
2. Les permissions RLS bloquent l'insertion
3. Il y a une erreur dans la fonction `handle_new_user()`

## Solution permanente

Le code a été modifié pour créer explicitement le profil lors de :
- L'inscription
- La connexion (si le profil n'existe pas)
- La vérification d'email

Cela garantit qu'un profil est toujours créé, même si le trigger ne fonctionne pas.

