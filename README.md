# Next.js Template

Template Next.js moderne avec TypeScript, Supabase, shadcn/ui et Resend.

## Stack

- **Next.js 16** App Router + TypeScript strict
- **Supabase** (PostgreSQL + Auth)
- **shadcn/ui** + Tailwind CSS
- **Resend** (emails de bienvenue)
- **i18n** (en, fr)

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
