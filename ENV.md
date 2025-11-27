# Environment Variables

This document describes all the environment variables required for this project.

## Required Variables

### Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL (found in Project Settings > API)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anonymous/public key (found in Project Settings > API)

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

### Authentication Settings

```env
ENABLE_EMAIL_VERIFICATION=true
```

- **ENABLE_EMAIL_VERIFICATION**: Enable or disable email verification for new user sign ups
  - Set to `true` or `1` to enable email verification (default)
  - Set to `false` or `0` to disable email verification
  - If not set, defaults to `true` (secure by default)

### Admin Scripts (Optional)

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

- **SUPABASE_SERVICE_ROLE_KEY**: Service role key for admin scripts (e.g., creating test admin user, promoting users to admin)
  - Get this from: Supabase Dashboard → Settings → API → service_role key
  - **⚠️ Never expose this key to the client** - Only use in server-side scripts
  - Required for:
    - `scripts/create-test-admin.ts` - Creates test admin account (doejohn@email.com)
    - `scripts/promote-to-admin.ts` - Promotes existing users to admin role

## Setup Instructions

1. Copy this template to create your `.env.local` file:
```bash
# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENABLE_EMAIL_VERIFICATION=true
EOF
```

2. Fill in the values for each variable

3. For production, add these same variables to your hosting platform's environment variables section

## Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` or `.env` files to version control
- Use different credentials for development and production environments

