# Comment désactiver la vérification d'email

Ce guide explique comment désactiver complètement la vérification d'email pour permettre aux utilisateurs de se connecter immédiatement après l'inscription.

## Configuration requise

Pour désactiver la vérification d'email, vous devez configurer à la fois votre application Next.js ET Supabase.

### 1. Configuration dans votre application (.env.local)

Ajoutez cette variable d'environnement :

```env
ENABLE_EMAIL_VERIFICATION=false
```

### 2. Configuration dans Supabase Dashboard (IMPORTANT)

Vous devez également configurer Supabase pour auto-confirmer les emails. Voici comment :

1. **Ouvrez votre projet Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Connectez-vous et ouvrez votre projet

2. **Allez dans les paramètres d'authentification**
   - Dans le menu de gauche, cliquez sur **"Authentication"**
   - Cliquez sur **"Providers"**
   - Trouvez **"Email"** dans la liste

3. **Configurez l'auto-confirmation**
   - Activez **"Confirm email"** (si ce n'est pas déjà fait)
   - **IMPORTANT** : Activez aussi **"Auto Confirm"**
   - Cette option permet aux utilisateurs d'être automatiquement confirmés lors de l'inscription

4. **Sauvegardez les modifications**

## Comportement après désactivation

Une fois la configuration terminée :

✅ **Quand la vérification est désactivée** :
- Les utilisateurs peuvent se connecter immédiatement après l'inscription
- Aucun email de vérification n'est envoyé
- L'utilisateur est automatiquement redirigé vers la page d'accueil après inscription
- Une session est créée automatiquement

❌ **Si la configuration Supabase n'est pas faite** :
- L'utilisateur sera créé mais n'aura pas de session
- Il verra un message d'erreur expliquant que l'auto-confirmation n'est pas configurée
- Il devra vérifier son email manuellement dans Supabase Dashboard

## Vérification que ça fonctionne

Pour vérifier que la désactivation fonctionne correctement :

1. Vérifiez que `ENABLE_EMAIL_VERIFICATION=false` est bien dans votre `.env.local`
2. Vérifiez que "Auto Confirm" est activé dans Supabase Dashboard
3. Inscrivez-vous avec un nouveau compte
4. Vous devriez être automatiquement connecté et redirigé vers la page d'accueil

## Réactiver la vérification d'email

Pour réactiver la vérification d'email :

1. Changez `ENABLE_EMAIL_VERIFICATION=true` dans `.env.local`
2. Dans Supabase Dashboard, vous pouvez garder "Auto Confirm" activé ou non selon vos préférences
   - Si désactivé : les utilisateurs devront vérifier leur email
   - Si activé : les utilisateurs seront auto-confirmés mais recevront quand même l'email de vérification

## Notes importantes

- ⚠️ La désactivation de la vérification d'email réduit la sécurité (permets aux comptes non vérifiés)
- ✅ Utile pour le développement ou les applications internes
- 🔒 Pour la production, il est recommandé de garder la vérification activée par défaut

## Dépannage

### L'utilisateur ne peut toujours pas se connecter après inscription

**Vérifiez** :
1. Que `ENABLE_EMAIL_VERIFICATION=false` est bien défini dans `.env.local`
2. Que vous avez redémarré le serveur de développement après avoir modifié `.env.local`
3. Que "Auto Confirm" est bien activé dans Supabase Dashboard
4. Vérifiez les logs de l'application pour voir les messages d'erreur

### Message d'erreur : "Email verification is disabled but user was not auto-confirmed"

Cela signifie que votre variable d'environnement est bien à `false` mais que Supabase n'est pas configuré pour auto-confirmer. Suivez l'étape 2 ci-dessus pour configurer Supabase.

## Support

Si vous rencontrez toujours des problèmes après avoir suivi ces étapes, vérifiez :
- La documentation Supabase : https://supabase.com/docs/guides/auth/auth-email
- Les logs de votre application
- Les logs dans Supabase Dashboard > Logs

