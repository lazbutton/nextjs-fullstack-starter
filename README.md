# Next.js Template

A modern Next.js template built with TypeScript, Supabase, shadcn/ui, and Resend, following best practices and project conventions.

## Features

- ⚡️ **Next.js 16** with App Router
- 🔷 **TypeScript** with strict mode
- 🗄️ **Supabase** (PostgreSQL + Authentication)
- 🎨 **shadcn/ui** components
- 📧 **Resend** for email handling
- 🔐 **Server Actions** for form handling
- 🛡️ **Middleware** for route protection
- 🌍 **Translation** support (en, fr)
- 🎯 **SEO** optimized with metadata

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── actions/           # Server actions
│   ├── layout.tsx         # Root layout with SEO metadata
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Supabase clients (client, server, middleware)
│   ├── resend.ts         # Resend email client
│   ├── i18n.ts           # Internationalization utilities
│   └── utils.ts          # General utilities
├── types/                 # TypeScript type definitions
├── i18n/                  # Translation files
│   ├── config.ts         # Locale configuration
│   └── messages/         # Translation JSON files
└── middleware.ts          # Next.js middleware for route protection
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account (for database and authentication)
- Resend account (for email)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd template-next
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Add them to your `.env.local` file

The Supabase clients are configured in:
- `lib/supabase/client.ts` - Browser client
- `lib/supabase/server.ts` - Server client
- `lib/supabase/middleware.ts` - Middleware client

### Resend

1. Create an account on [Resend](https://resend.com)
2. Get your API key
3. Verify your domain (for production)
4. Add the API key to your `.env.local` file

See `app/actions/example.ts` for an example server action that sends emails.

### Translations

The project supports English (en) and French (fr) out of the box. To add more languages:

1. Add the locale to `i18n/config.ts`
2. Create a new JSON file in `i18n/messages/` with the same structure
3. Update `lib/i18n.ts` to import the new messages

### shadcn/ui

To add new components:

```bash
npx shadcn@latest add [component-name]
```

Available components: https://ui.shadcn.com/docs/components

## Development

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Project Conventions

See [PROJECT_PREFERENCES.md](./PROJECT_PREFERENCES.md) for detailed project conventions including:
- Git commit messages (English)
- Code comments (English)
- Development standards
- Build verification
- SEO optimization

## Stack & Technologies

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Email**: Resend
- **Forms**: Server Actions
- **Internationalization**: Custom i18n solution

## License

MIT
