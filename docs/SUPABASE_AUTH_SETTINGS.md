# Guide : Configuration de l'authentification dans Supabase

Ce guide vous montre exactement où trouver les paramètres d'authentification dans le Dashboard Supabase.

## Accès au Dashboard Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous avec votre compte
3. Sélectionnez votre projet

## Où trouver les paramètres d'authentification

### Méthode 1 : Via le menu principal (version récente)

1. Dans le menu de gauche, cliquez sur **"Authentication"** (icône de clé/cadenas)
2. Vous verrez plusieurs sous-sections :
   - **Users** : Liste des utilisateurs
   - **Policies** : Règles de sécurité (RLS)
   - **Providers** : Fournisseurs d'authentification
   - **Settings** ou **Configuration** : Paramètres généraux
   - **Email Templates** : Templates d'emails

### Méthode 2 : Paramètres Email/Auto-Confirm

Pour configurer l'auto-confirmation des emails :

#### Option A : Via Providers

1. **Authentication** > **Providers**
2. Trouvez **"Email"** dans la liste
3. Cliquez sur **"Email"** pour ouvrir les options
4. Activez :
   - ✅ **"Confirm email"** (Enable email confirmations)
   - ✅ **"Auto Confirm"** (Enable auto-confirm)

#### Option B : Via Settings/Configuration

1. **Authentication** > **Settings** (ou **Configuration**)
2. Cherchez la section **"Email"** ou **"Email Auth"**
3. Activez :
   - ✅ **"Enable email confirmations"**
   - ✅ **"Enable auto-confirm"**

### Méthode 3 : Paramètres du projet (ancienne interface)

Si vous avez l'ancienne interface :
1. Allez dans **Settings** (icône d'engrenage en bas à gauche)
2. Cliquez sur **"Auth"** ou **"Authentication"**
3. Trouvez les options d'email

## Capture d'écran de référence

Le chemin exact peut varier selon la version de votre Dashboard Supabase :

**Interface récente** :
```
Dashboard
└── Authentication (menu gauche)
    ├── Users
    ├── Policies
    ├── Providers
    │   └── Email ← Cliquez ici
    │       ├── Enable email confirmations
    │       └── Enable auto-confirm ← Activez cette option
    ├── Settings
    └── Email Templates
```

## Configuration recommandée selon votre besoin

### Pour activer l'auto-confirmation (désactiver vérification email)

✅ **Activez** :
- "Enable email confirmations" = **ON**
- "Enable auto-confirm" = **ON**

Résultat : Les utilisateurs sont automatiquement confirmés, pas besoin de vérifier l'email.

### Pour activer la vérification email

✅ **Activez** :
- "Enable email confirmations" = **ON**
- "Enable auto-confirm" = **OFF**

Résultat : Les utilisateurs doivent vérifier leur email avant de pouvoir se connecter.

### Pour désactiver complètement les emails

⚠️ **Attention** : Cela peut poser des problèmes de sécurité.

❌ **Désactivez** :
- "Enable email confirmations" = **OFF**

## Si vous ne trouvez pas ces options

1. **Vérifiez votre version de Supabase** :
   - La version peut différer selon votre plan (Free, Pro, etc.)
   - Certaines options peuvent être dans des endroits différents

2. **Essayez de chercher** :
   - Utilisez la barre de recherche en haut du dashboard
   - Recherchez "email", "auto-confirm", ou "confirmations"

3. **Contactez le support Supabase** :
   - Si vous êtes sur un plan payant, contactez le support
   - Consultez la documentation : https://supabase.com/docs/guides/auth

4. **Vérifiez les permissions** :
   - Assurez-vous d'être connecté avec un compte ayant les permissions d'administrateur

## Alternative : Configuration via SQL

Si vous ne trouvez pas l'interface, vous pouvez aussi configurer via SQL :

```sql
-- Activer l'auto-confirmation pour les emails
-- Note: Cette commande peut varier selon votre version de Supabase
-- Vérifiez la documentation de votre version
```

**⚠️ Attention** : La configuration SQL dépend de votre version de Supabase. Il est recommandé d'utiliser l'interface graphique.

## Vérification

Pour vérifier que la configuration est correcte :

1. Inscrivez-vous avec un nouveau compte
2. Si "Auto Confirm" est activé : vous devriez être automatiquement connecté
3. Si "Auto Confirm" est désactivé : vous devriez recevoir un email de vérification

## Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Configuration Email Auth](https://supabase.com/docs/guides/auth/auth-email)
- [Support Supabase](https://supabase.com/support)

