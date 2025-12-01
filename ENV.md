# Environment Variables

This document describes all the environment variables required for this project.

## Required Variables

### Neon Database

```env
DATABASE_URL=your_neon_database_connection_string
```

- **DATABASE_URL**: Your Neon database connection string (for server-side operations)
  - Get this from: Neon Dashboard → Your Project → Connection Details
  - Format: `postgresql://user:password@host/database?sslmode=require`
- **NEXT_PUBLIC_DATABASE_URL**: Your Neon database connection string (for client-side operations, if needed)
  - **⚠️ Note**: In most cases, database operations should be server-side only
  - Only expose this if you need client-side database access (not recommended)

### NextAuth

```env
AUTH_SECRET=your_auth_secret_key
```

- **AUTH_SECRET**: Secret key for NextAuth session encryption
  - **⚠️ Never expose this key to the client** - Only use in server-side code
  - Generate a random secret: `openssl rand -base64 32`
  - Or use: `npx auth secret` to generate one

### Resend

```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

- **RESEND_API_KEY**: Your Resend API key (found in your Resend dashboard)
- **RESEND_FROM_EMAIL**: The email address to send emails from (must be verified in Resend)

### Next.js

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- **NEXT_PUBLIC_APP_URL**: The base URL of your application (for production, use your domain)

## Setup Instructions

1. Copy this template to create your `.env.local` file:
```bash
# Create .env.local file
cat > .env.local << EOF
DATABASE_URL=
NEXT_PUBLIC_DATABASE_URL=
AUTH_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
```

2. Fill in the values for each variable

3. For production, add these same variables to your hosting platform's environment variables section

## Admin Scripts

The following scripts require the environment variables above:
- `scripts/create-test-admin.ts` - Creates test admin account (doejohn@email.com)
- `scripts/promote-to-admin.ts` - Promotes existing users to admin role
- `scripts/create-missing-profiles.ts` - Creates profiles for users who don't have one

## Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` or `.env` files to version control
- Use different credentials for development and production environments
- The `DATABASE_URL` should use SSL mode (`?sslmode=require`) for secure connections
