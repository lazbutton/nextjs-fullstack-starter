# Email Guide: Stack Auth + Resend

## Hybrid Approach

| Email | Service | Reason |
|-------|---------|--------|
| Email verification | Stack Auth | Automatic, included |
| Password reset | Stack Auth | Automatic, included |
| Welcome email | Resend | Custom, branding |

## Configuration

### Stack Auth (auth emails)

**Stack Auth Dashboard** → **Email Templates**:
- Customize HTML templates if needed
- Configure email providers (SMTP, SendGrid, etc.)
- Set up email verification and password reset flows

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
// Stack Auth automatically sends verification email
await stackServerApp.createUser({
  primaryEmail: email,
  password: password,
})

// Resend sends welcome email
await sendWelcomeEmail(email)
```

### Password Reset

```typescript
// Stack Auth automatically sends reset email
await stackServerApp.sendPasswordResetEmail({
  email,
  redirectUrl: resetUrl,
})
```

## Options

### Option 1: Stack Auth Only

**Use Stack Auth for all emails**:
- Email verification
- Password reset
- Welcome email (configure in Stack Auth dashboard)

**Disable Resend emails**:
- Remove `sendWelcomeEmail()` calls from code
- Or keep Resend for welcome only (recommended for branding)

### Option 2: Hybrid (Recommended)

**Best of both worlds**:
- Stack Auth for auth (verification, reset)
- Resend for welcome (custom branding)

**Benefits**:
- Professional welcome emails with your branding
- Stack Auth handles auth emails automatically
- Full control over welcome email content

## Troubleshooting

### Duplicate emails

**Cause**: Both Stack Auth + Resend sending
**Solution**: Configure Stack Auth to not send welcome emails, use Resend only

### Emails not sending

1. Check Stack Auth email configuration
2. Check Resend API key and domain verification
3. Check email provider settings in Stack Auth dashboard

## Recommendations

| Use Case | Recommendation |
|----------|---------------|
| MVP / Simple project | Stack Auth only |
| Project with branding | Hybrid (Stack Auth + Resend) |

## Resources

- [Stack Auth Email Configuration](https://docs.stack-auth.com)
- [Resend Documentation](https://resend.com/docs)
