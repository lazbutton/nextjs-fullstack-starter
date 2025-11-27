# Approche Hybride : Supabase + Resend

Ce guide explique l'approche hybride utilisée dans ce projet pour la gestion des emails.

## Architecture

### 🎯 Principe

- **Supabase** : Gère automatiquement les emails d'authentification (vérification, réinitialisation)
- **Resend** : Gère uniquement l'email de bienvenue personnalisé

### 📧 Répartition des emails

| Email | Géré par | Raison |
|-------|----------|--------|
| **Email de bienvenue** | ✅ Resend | Supabase ne fournit pas cette fonctionnalité |
| **Email de vérification** | ✅ Supabase | Automatique, inclus, fonctionnel |
| **Email de réinitialisation** | ✅ Supabase | Automatique, inclus, fonctionnel |

## Avantages de cette approche

✅ **Simple** : Un seul service externe (Resend) pour l'email personnalisé  
✅ **Robuste** : Supabase gère automatiquement les emails critiques  
✅ **Économique** : Moins d'emails envoyés via Resend (seulement bienvenue)  
✅ **Fiable** : Les emails d'auth sont gérés par Supabase (infrastructure robuste)  
✅ **Personnalisable** : Email de bienvenue avec votre branding  

## Configuration

### 1. Configuration Supabase

Dans votre Dashboard Supabase :
- Les emails de vérification et réinitialisation sont envoyés automatiquement
- Personnalisez les templates dans **Authentication > Email Templates** si besoin

### 2. Configuration Resend

Dans votre `.env.local` :
```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Note** : Resend est uniquement utilisé pour l'email de bienvenue.

## Fonctionnement

### Inscription (Sign Up)

1. ✅ User s'inscrit → Supabase crée le compte
2. ✅ Supabase envoie **automatiquement** l'email de vérification (si activé)
3. ✅ Resend envoie l'email de bienvenue personnalisé

**Pas de duplication** : Un seul email de vérification (Supabase uniquement)

### Réinitialisation de mot de passe

1. ✅ User demande la réinitialisation
2. ✅ Supabase envoie **automatiquement** l'email de réinitialisation
3. ✅ Pas d'email supplémentaire via Resend

**Pas de duplication** : Un seul email de réinitialisation (Supabase uniquement)

### Email de bienvenue

1. ✅ Après l'inscription réussie
2. ✅ Resend envoie l'email de bienvenue personnalisé
3. ✅ Supabase ne fait pas ça nativement

**Unique** : Seul Resend gère cet email

## Code Implementation

### Sign Up

```typescript
// app/actions/auth.ts

// Supabase gère automatiquement l'email de vérification
const { data } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: callbackUrl, // Supabase envoie l'email avec ce lien
  },
})

// Resend envoie uniquement l'email de bienvenue
await sendWelcomeEmail(email)
```

### Password Reset

```typescript
// app/actions/auth.ts

// Supabase gère automatiquement l'email de réinitialisation
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: resetUrl, // Supabase envoie l'email avec ce lien
})

// Pas d'appel à sendPasswordResetEmail() - Supabase le fait déjà
```

## Personnalisation des emails Supabase

Si vous voulez personnaliser les emails de vérification/réinitialisation :

1. Allez dans **Supabase Dashboard > Authentication > Email Templates**
2. Personnalisez les templates HTML
3. Les variables disponibles :
   - `{{ .ConfirmationURL }}` : URL de confirmation
   - `{{ .Email }}` : Adresse email
   - `{{ .Token }}` : Token de vérification

## Désactiver l'email de bienvenue

Si vous ne voulez pas d'email de bienvenue :

1. Commentez ou supprimez l'appel à `sendWelcomeEmail()` dans `handlePostSignUpEmails()`
2. Ou configurez Resend comme optionnel dans le code

## Coûts

- **Supabase** : Emails d'auth inclus (pas de coût supplémentaire)
- **Resend** : 
  - Gratuit jusqu'à 100 emails/jour
  - Uniquement pour les emails de bienvenue (1 par inscription)
  - Très économique

## Avantages vs Autres Approches

### vs Uniquement Supabase
- ✅ Email de bienvenue personnalisé possible
- ⚠️ Un service externe supplémentaire (Resend)

### vs Uniquement Resend
- ✅ Moins de code à maintenir (Supabase gère l'auth)
- ✅ Moins d'emails via Resend (économique)
- ✅ Plus fiable (Supabase gère les emails critiques)
- ⚠️ Deux services (mais Resend optionnel pour bienvenue)

## Résumé

**Approche hybride = Le meilleur des deux mondes** :

- 🎨 Email de bienvenue personnalisé via Resend
- 🔐 Emails d'auth robustes via Supabase
- 💰 Économique (peu d'emails Resend)
- 🛠️ Simple à maintenir

Cette approche est **recommandée** pour la plupart des projets.

