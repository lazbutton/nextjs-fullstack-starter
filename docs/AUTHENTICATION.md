# Authentification

## Fonctionnalités

- Inscription / Connexion / Déconnexion
- Vérification email
- Réinitialisation mot de passe
- Protection routes
- Emails (Supabase pour auth + Resend pour bienvenue)

## Architecture

### Server Actions (`app/actions/auth.ts`)

```typescript
signUp()          // Inscription
signIn()          // Connexion
signOut()         // Déconnexion
resetPassword()   // Demande reset MDP
updatePassword()  // Mise à jour MDP
getCurrentUser()  // Utilisateur actuel
```

### Pages

- `/auth/sign-in` - Connexion
- `/auth/sign-up` - Inscription
- `/auth/forgot-password` - Demande reset
- `/auth/reset-password` - Nouveau MDP
- `/auth/callback` - Callback OAuth/Email

### Composants

```
components/auth/
  sign-in-form.tsx
  sign-up-form.tsx
  forgot-password-form.tsx
  reset-password-form.tsx
  user-button.tsx
```

### Hook

```typescript
import { useAuth } from '@/hooks/use-auth'

const { user, loading } = useAuth()
```

## Configuration

### 1. Variables d'environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Resend (email bienvenue)
RESEND_API_KEY=your_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email verification (optionnel)
ENABLE_EMAIL_VERIFICATION=true  # false pour désactiver
```

### 2. Supabase Dashboard

**Authentication** → **Providers** → **Email** :
- ✅ Activer Email provider
- ✅ Configure email confirmations (si vérification souhaitée)

**Authentication** → **URL Configuration** :
- Ajouter : `http://localhost:3000/auth/callback` (dev)
- Ajouter : `https://yourdomain.com/auth/callback` (prod)

### 3. Migrations

Appliquer les migrations (voir `docs/DATABASE.md`) :
- `001_create_profiles_table.sql`
- `002_create_user_settings_table.sql`

## Protection de Routes

### Server Components

```typescript
import { requireAuth } from '@/lib/auth/utils'

export default async function ProtectedPage() {
  const user = await requireAuth() // Redirige si non auth
  return <div>Protected: {user.email}</div>
}
```

### Redirection si authentifié

```typescript
import { requireNoAuth } from '@/lib/auth/utils'

export default async function PublicPage() {
  await requireNoAuth() // Redirige si déjà auth
  return <div>Public content</div>
}
```

## Emails

### Approche Hybride

**Supabase** (automatique) :
- Email vérification
- Email reset mot de passe

**Resend** (manuel) :
- Email de bienvenue uniquement

Voir `docs/EMAIL_GUIDE.md` pour détails.

### Désactiver vérification email

1. `.env.local` : `ENABLE_EMAIL_VERIFICATION=false`
2. **Supabase Dashboard** → **Authentication** → **Providers** → **Email** :
   - Activer "Auto Confirm"

## Sécurité

- Mots de passe hashés par Supabase
- Sessions via cookies HTTP-only
- Protection CSRF (Next.js)
- RLS sur tables base de données

## Ressources

- [Supabase Auth](https://supabase.com/docs/guides/auth)
