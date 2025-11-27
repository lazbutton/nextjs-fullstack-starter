# Next.js Template

Template Next.js moderne avec TypeScript, Supabase, shadcn/ui et Resend.

## Stack

- **Next.js 16** App Router + TypeScript strict
- **Supabase** (PostgreSQL + Auth)
- **shadcn/ui** + Tailwind CSS
- **Resend** (emails de bienvenue)
- **i18n** (en, fr)

## Fonctionnalités

### ✅ Implémenté

#### Authentification & Utilisateurs
- ✅ Inscription avec email/mot de passe
- ✅ Connexion/Déconnexion
- ✅ Réinitialisation de mot de passe
- ✅ Vérification d'email (configurable)
- ✅ Gestion de session SSR avec Supabase
- ✅ Protection de routes (middleware)
- ✅ Création automatique de profil utilisateur
- ✅ API pour créer profil manuel (`/api/admin/create-profile`)

#### Base de données
- ✅ Migrations Supabase (profiles, user_settings)
- ✅ Row Level Security (RLS) configuré
- ✅ Triggers SQL pour création automatique de profils
- ✅ Indexes de performance
- ✅ Utilitaires pour requêtes optimisées

#### UI/UX
- ✅ Système de notifications/Toast (Sonner)
- ✅ Gestion d'erreurs globale (error.tsx, not-found.tsx, global-error.tsx)
- ✅ États de chargement (loading.tsx, LoadingSpinner, Skeleton)
- ✅ Layouts (SiteLayout, DashboardLayout avec sidebar)
- ✅ Navigation (Header, Footer, Sidebar)
- ✅ Composants UI de base (Button, Input, Card, Label)
- ✅ Composants de données (EmptyState, StatsCard)
- ✅ Pagination (composant + hook)
- ✅ Recherche (SearchInput avec debounce + hook)

#### Validation & Sécurité
- ✅ Validation Zod (schémas réutilisables)
- ✅ Validation serveur et client
- ✅ Gestion centralisée des erreurs

#### Internationalisation
- ✅ Support multilingue (en, fr)
- ✅ Changement de langue via cookie (pas d'URL)
- ✅ Traductions dynamiques

#### Utilitaires
- ✅ Système de logging
- ✅ Utilitaires email (templates, envoi)
- ✅ Utilitaires base de données
- ✅ Hooks personnalisés (useAuth, usePagination, useSearch)

#### Emails
- ✅ Templates HTML pour emails
- ✅ Email de bienvenue (Resend)
- ✅ Emails d'authentification (Supabase)
- ✅ Configuration hybride (Supabase + Resend)

### 🚧 À implémenter

#### Priorité Haute
- ⏳ Upload de fichiers vers Supabase Storage
- ⏳ Composant DataTable avec tri et filtres
- ⏳ Modal/Dialog système (shadcn/ui)

#### Priorité Moyenne
- ⏳ Tests Setup (Vitest/Jest + React Testing Library)
- ⏳ Pre-commit hooks (Husky + lint-staged)
- ⏳ Dark Mode (next-themes)
- ⏳ Rate Limiting sur Server Actions
- ⏳ Analytics & Monitoring (Sentry, Google Analytics)
- ⏳ Variables d'environnement typées (validation Zod)

#### Priorité Basse
- ⏳ Composants UI supplémentaires (Select, Dropdown, Tabs, etc.)
- ⏳ CI/CD Configuration (GitHub Actions)
- ⏳ Documentation API Routes
- ⏳ Image Optimization avancée
- ⏳ Accessibilité (audit a11y)
- ⏳ Caching Strategy avancée

## Installation

```bash
# 1. Cloner et installer
git clone <your-repo-url>
npm install

# 2. Configuration .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 3. Appliquer les migrations DB (voir docs/DATABASE.md)
# 4. Lancer
npm run dev
```

## Structure

```
app/            # Pages et layouts
  actions/      # Server actions
components/     # Composants React
  ui/          # shadcn/ui
lib/           # Utils et config
  supabase/   # Clients Supabase
  database/   # Utils DB
  auth/       # Utils auth
types/         # Types TypeScript
i18n/          # Traductions
docs/          # Documentation
supabase/      # Migrations SQL
```

## Documentation

- **[DATABASE.md](docs/DATABASE.md)** - Configuration base de données
- **[AUTHENTICATION.md](docs/AUTHENTICATION.md)** - Système d'authentification
- **[DATABASE_PERFORMANCE.md](docs/DATABASE_PERFORMANCE.md)** - Optimisation performance
- **[EMAIL_GUIDE.md](docs/EMAIL_GUIDE.md)** - Guide emails (Supabase + Resend)
- **[PROJECT_PREFERENCES.md](PROJECT_PREFERENCES.md)** - Conventions du projet

## Commandes

```bash
npm run dev      # Développement
npm run build    # Build production
npm run lint     # Linter
```

## Ajout de composants shadcn/ui

```bash
npx shadcn@latest add [component-name]
```

## Licence

MIT
