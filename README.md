# Next.js Template

Modern Next.js template with TypeScript, Supabase, shadcn/ui and Resend.

## Stack

- **Next.js 16** App Router + TypeScript strict
- **Supabase** (PostgreSQL + Auth)
- **shadcn/ui** + Tailwind CSS
- **Resend** (welcome emails)
- **i18n** (en, fr)

## Features

### ✅ Implemented

#### Authentication & Users

- ✅ Sign up with email/password
- ✅ Sign in/Sign out
- ✅ Password reset
- ✅ Email verification (configurable)
- ✅ SSR session management with Supabase
- ✅ Route protection (middleware)
- ✅ Automatic user profile creation
- ✅ API to manually create profile (`/api/admin/create-profile`)

#### Database

- ✅ Supabase migrations (profiles, user_settings)
- ✅ Row Level Security (RLS) configured
- ✅ SQL triggers for automatic profile creation
- ✅ Performance indexes
- ✅ Utilities for optimized queries

#### UI/UX

- ✅ Notification/Toast system (Sonner)
- ✅ Global error handling (error.tsx, not-found.tsx, global-error.tsx)
- ✅ Loading states (loading.tsx, LoadingSpinner, Skeleton)
- ✅ Layouts (SiteLayout, DashboardLayout with sidebar)
- ✅ Navigation (Header, Footer, Sidebar)
- ✅ Basic UI components (Button, Input, Card, Label)
- ✅ Data components (EmptyState, StatsCard)
- ✅ Pagination (component + hook)
- ✅ Search (SearchInput with debounce + hook)

#### Validation & Security

- ✅ Zod validation (reusable schemas)
- ✅ Server and client validation
- ✅ Centralized error handling

#### Internationalization

- ✅ Multi-language support (en, fr)
- ✅ Language switching via cookie (not URL)
- ✅ Dynamic translations

#### Utilities

- ✅ Logging system
- ✅ Email utilities (templates, sending)
- ✅ Database utilities
- ✅ Custom hooks (useAuth, usePagination, useSearch)

#### Emails

- ✅ HTML email templates
- ✅ Welcome email (Resend)
- ✅ Authentication emails (Supabase)
- ✅ Hybrid configuration (Supabase + Resend)

#### SEO & Performance

- ✅ Dynamic sitemap generation (`/sitemap.xml`)
- ✅ Robots.txt configuration
- ✅ Comprehensive metadata (Open Graph, Twitter Cards)
- ✅ JSON-LD structured data (WebSite, Article, Breadcrumb)
- ✅ PWA manifest (`/manifest.webmanifest`)
- ✅ Search engine verification support
- ✅ Image optimization (AVIF, WebP)
- ✅ Security headers
- ✅ Compression enabled

### 🚧 To be implemented

#### High Priority

- ⏳ File upload to Supabase Storage
- ⏳ DataTable component with sorting and filters
- ⏳ Modal/Dialog system (shadcn/ui)

#### Medium Priority

- ⏳ Tests Setup (Vitest/Jest + React Testing Library)
- ⏳ Pre-commit hooks (Husky + lint-staged)
- ⏳ Dark Mode (next-themes)
- ⏳ Rate Limiting on Server Actions
- ⏳ Analytics & Monitoring (Sentry, Google Analytics)
- ⏳ Typed environment variables (Zod validation)
- ⏳ OG Image generation (dynamic Open Graph images)

#### Low Priority

- ⏳ Additional UI components (Select, Dropdown, Tabs, etc.)
- ⏳ CI/CD Configuration (GitHub Actions)
- ⏳ API Routes documentation
- ⏳ Advanced image optimization
- ⏳ Accessibility (a11y audit)
- ⏳ Advanced caching strategy

## Installation

```bash
# 1. Clone and install
git clone <your-repo-url>
npm install

# 2. Configure .env.local (copy from .env.example)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Optional: SEO verification codes
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_code
NEXT_PUBLIC_YANDEX_VERIFICATION=your_code
NEXT_PUBLIC_BING_VERIFICATION=your_code

# 3. Apply database migrations (see docs/DATABASE.md)
# 4. Run
npm run dev
```

## Structure

```
app/            # Pages and layouts
  actions/      # Server actions
components/     # React components
  ui/          # shadcn/ui
lib/           # Utils and config
  supabase/   # Supabase clients
  database/   # DB utils
  auth/       # Auth utils
types/         # TypeScript definitions
i18n/          # Translations
docs/          # Documentation
supabase/      # SQL migrations
```

## Documentation

- **[DATABASE.md](docs/DATABASE.md)** - Database configuration
- **[AUTHENTICATION.md](docs/AUTHENTICATION.md)** - Authentication system
- **[DATABASE_PERFORMANCE.md](docs/DATABASE_PERFORMANCE.md)** - Performance optimization
- **[EMAIL_GUIDE.md](docs/EMAIL_GUIDE.md)** - Email guide (Supabase + Resend)
- **[SEO.md](docs/SEO.md)** - Complete SEO guide and best practices
- **[SEO_IMPLEMENTATION_SUMMARY.md](SEO_IMPLEMENTATION_SUMMARY.md)** - SEO implementation summary
- **[GITHUB_SETUP.md](docs/GITHUB_SETUP.md)** - GitHub Actions and Dependabot setup guide

## Commands

```bash
npm run dev      # Development
npm run build    # Production build
npm run lint     # Linter
```

## Adding shadcn/ui components

```bash
npx shadcn@latest add [component-name]
```

## License

MIT
