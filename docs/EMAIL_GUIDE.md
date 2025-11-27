# Email Guide: Supabase + Resend

## Hybrid Approach

| Email | Service | Reason |
|-------|---------|--------|
| Email verification | Supabase | Automatic, included |
| Password reset | Supabase | Automatic, included |
| Welcome email | Resend | Custom, branding |

## Configuration

### Supabase (auth emails)

**Dashboard** → **Authentication** → **Email Templates**:
- Customize HTML templates if needed
- Variables: `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .Token }}`

### Resend (welcome email)

```env
RESEND_API_KEY=your_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

1. [Resend](https://resend.com) account
2. Verify domain (prod)
3. Get API key

## Usage

### Sign Up

```typescript
// Supabase automatically sends verification email
await supabase.auth.signUp({
  email,
  password,
  options: { emailRedirectTo: callbackUrl }
})

// Resend sends welcome email
await sendWelcomeEmail(email)
```

### Password Reset

```typescript
// Supabase automatically sends reset email
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: resetUrl
})

// No additional email needed
```

## Options

### Option 1: Supabase Only

**Remove Resend**:
1. `npm uninstall resend`
2. Remove Resend env variables
3. Remove `sendWelcomeEmail()` calls

**Advantages**: Simple, free, single service
**Disadvantages**: No welcome email, basic design

### Option 2: Resend Only

**Disable Supabase emails**:
1. Dashboard → **Authentication** → **Settings**
2. Disable automatic sending
3. Manage tokens manually

**Advantages**: Full control, custom design
**Disadvantages**: More code, costs, maintenance

### Option 3: Hybrid (recommended)

**Use both**:
- Supabase for auth (verification, reset)
- Resend for welcome

**Advantages**: Best of both worlds
**Disadvantages**: Two services

## Disable Email Verification

### 1. Application

`.env.local`:
```env
ENABLE_EMAIL_VERIFICATION=false
```

### 2. Supabase Dashboard

**Authentication** → **Providers** → **Email**:
- ✅ Enable "Confirm email"
- ✅ Enable "Auto Confirm"

**Result**: Immediate sign in without email verification.

## Costs

- **Supabase**: Auth emails included (free)
- **Resend**: 
  - 100 free emails/day
  - Welcome email only (1 per signup)

## Troubleshooting

### Double verification emails

**Cause**: Both Supabase + Resend sending
**Solution**: Use hybrid approach (see Option 3)

### User cannot sign in after signup

1. Check `ENABLE_EMAIL_VERIFICATION` in `.env.local`
2. Check "Auto Confirm" enabled in Supabase
3. Restart dev server

### Welcome email not sent

1. Check `RESEND_API_KEY` configured
2. Check domain verified (prod)
3. Check application logs

## Recommendations

| Use Case | Recommendation |
|----------|----------------|
| MVP / Simple project | Supabase only |
| Project with branding | Hybrid (Supabase + Resend) |
| Complex transactional emails | Resend only |

## Resources

- [Supabase Auth Email](https://supabase.com/docs/guides/auth/auth-email)
- [Resend Docs](https://resend.com/docs)
