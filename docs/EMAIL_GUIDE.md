# Guide Emails : Supabase + Resend

## Approche Hybride

| Email | Service | Raison |
|-------|---------|--------|
| Vérification email | Supabase | Automatique, inclus |
| Reset mot de passe | Supabase | Automatique, inclus |
| Email de bienvenue | Resend | Personnalisé, branding |

## Configuration

### Supabase (emails auth)

**Dashboard** → **Authentication** → **Email Templates** :
- Personnaliser templates HTML si besoin
- Variables : `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .Token }}`

### Resend (email bienvenue)

```env
RESEND_API_KEY=your_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

1. Compte [Resend](https://resend.com)
2. Vérifier domaine (prod)
3. Récupérer API key

## Utilisation

### Inscription

```typescript
// Supabase envoie automatiquement email vérification
await supabase.auth.signUp({
  email,
  password,
  options: { emailRedirectTo: callbackUrl }
})

// Resend envoie email bienvenue
await sendWelcomeEmail(email)
```

### Reset mot de passe

```typescript
// Supabase envoie automatiquement email reset
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: resetUrl
})

// Pas besoin d'email supplémentaire
```

## Options

### Option 1 : Uniquement Supabase

**Supprimer Resend** :
1. `npm uninstall resend`
2. Supprimer variables env Resend
3. Supprimer appels `sendWelcomeEmail()`

**Avantages** : Simple, gratuit, un seul service
**Inconvénients** : Pas d'email bienvenue, design basique

### Option 2 : Uniquement Resend

**Désactiver emails Supabase** :
1. Dashboard → **Authentication** → **Settings**
2. Désactiver envoi automatique
3. Gérer tokens manuellement

**Avantages** : Contrôle total, design custom
**Inconvénients** : Plus de code, coûts, maintenance

### Option 3 : Hybride (recommandé)

**Utiliser les deux** :
- Supabase pour auth (vérification, reset)
- Resend pour bienvenue

**Avantages** : Meilleur des deux mondes
**Inconvénients** : Deux services

## Désactiver Vérification Email

### 1. Application

`.env.local` :
```env
ENABLE_EMAIL_VERIFICATION=false
```

### 2. Supabase Dashboard

**Authentication** → **Providers** → **Email** :
- ✅ Activer "Confirm email"
- ✅ Activer "Auto Confirm"

**Résultat** : Connexion immédiate sans vérification email.

## Coûts

- **Supabase** : Emails auth inclus (gratuit)
- **Resend** : 
  - 100 emails/jour gratuits
  - Uniquement bienvenue (1 par inscription)

## Dépannage

### Double emails de vérification

**Cause** : Supabase + Resend envoient tous deux
**Solution** : Utiliser approche hybride (voir Option 3)

### Utilisateur ne peut pas se connecter après inscription

1. Vérifier `ENABLE_EMAIL_VERIFICATION` dans `.env.local`
2. Vérifier "Auto Confirm" activé dans Supabase
3. Redémarrer serveur dev

### Email de bienvenue non envoyé

1. Vérifier `RESEND_API_KEY` configuré
2. Vérifier domaine vérifié (prod)
3. Consulter logs application

## Recommandations

| Cas d'usage | Recommandation |
|-------------|----------------|
| MVP / Projet simple | Uniquement Supabase |
| Projet avec branding | Hybride (Supabase + Resend) |
| Emails transactionnels complexes | Uniquement Resend |

## Ressources

- [Supabase Auth Email](https://supabase.com/docs/guides/auth/auth-email)
- [Resend Docs](https://resend.com/docs)
