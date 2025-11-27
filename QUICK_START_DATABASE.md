# 🚀 Guide Rapide : Mise à jour de la base de données Supabase

## Étapes rapides pour mettre à jour votre base de données

### Méthode la plus simple (5 minutes)

1. **Ouvrez votre projet Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Connectez-vous et ouvrez votre projet

2. **Ouvrez le SQL Editor**
   - Dans le menu de gauche, cliquez sur **"SQL Editor"**
   - Cliquez sur **"New Query"**

3. **Appliquez la première migration**
   - Ouvrez le fichier : `supabase/migrations/001_create_profiles_table.sql`
   - **Copiez tout le contenu** du fichier
   - **Collez** dans le SQL Editor
   - Cliquez sur **"Run"** (ou Ctrl/Cmd + Enter)
   - Vérifiez qu'un message de succès apparaît ✅

4. **Appliquez la deuxième migration**
   - Ouvrez le fichier : `supabase/migrations/002_create_user_settings_table.sql`
   - **Copiez tout le contenu** du fichier
   - **Collez** dans le SQL Editor (vous pouvez créer une nouvelle query)
   - Cliquez sur **"Run"**
   - Vérifiez qu'un message de succès apparaît ✅

5. **Vérifiez que tout fonctionne**
   - Allez dans **"Table Editor"** (menu de gauche)
   - Vous devriez voir deux nouvelles tables :
     - ✅ `profiles`
     - ✅ `user_settings`

6. **Testez l'inscription d'un utilisateur**
   - Inscrivez-vous avec un nouveau compte sur votre application
   - Retournez dans **"Table Editor"** → **"profiles"**
   - Vous devriez voir un nouveau profil créé automatiquement ! 🎉

## Qu'est-ce qui a été créé ?

### Table `profiles`
Cette table stocke les informations de profil des utilisateurs :
- Email
- Nom complet
- URL de l'avatar
- Dates de création et mise à jour

**Important** : Un profil est automatiquement créé lorsqu'un utilisateur s'inscrit grâce à un trigger de base de données.

### Table `user_settings`
Cette table stocke les préférences utilisateur :
- Langue préférée (locale)
- Thème (light/dark)
- Préférences de notifications

### Sécurité (Row Level Security)
Les deux tables ont la sécurité au niveau des lignes activée :
- ✅ Les utilisateurs ne peuvent voir que leurs propres données
- ✅ Les utilisateurs ne peuvent modifier que leurs propres données

## Problèmes ?

### "relation already exists"
Cela signifie que la table existe déjà. Si vous voulez recommencer :
1. Allez dans **"Table Editor"**
2. Supprimez les tables `profiles` et `user_settings` si elles existent
3. Réessayez les migrations

### Le profil n'est pas créé automatiquement
1. Vérifiez dans **"Database"** → **"Triggers"** que le trigger `on_auth_user_created` existe
2. Si ce n'est pas le cas, réexécutez la migration `001_create_profiles_table.sql`

## Besoin d'aide ?

Consultez la documentation complète :
- `/supabase/README.md` - Documentation complète des migrations
- `/docs/DATABASE.md` - Guide détaillé de la base de données

## Ensuite ?

Une fois les migrations appliquées :
1. ✅ Votre base de données est à jour
2. ✅ Les profils utilisateurs sont créés automatiquement
3. ✅ Vous pouvez utiliser les fonctions dans `/lib/database/` pour gérer les profils

C'est tout ! Votre base de données est maintenant configurée. 🎊

