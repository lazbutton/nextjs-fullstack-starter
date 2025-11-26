export function getEmailTemplate(title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
            <h1 style="color: #333; margin: 0;">${title}</h1>
          </div>
          <div style="background-color: #ffffff; padding: 30px;">
            ${content}
          </div>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getWelcomeEmailTemplate(name?: string): string {
  const userName = name || 'there'
  const content = `
    <h2 style="color: #333;">Welcome to our platform!</h2>
    <p>Hi ${userName},</p>
    <p>Thank you for signing up! We're excited to have you on board.</p>
    <p>Your account has been successfully created. You can now start using all the features of our platform.</p>
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>
      Best regards,<br />
      The Team
    </p>
  `
  return getEmailTemplate('Welcome!', content)
}

export function getVerificationEmailTemplate(verificationUrl: string): string {
  const content = `
    <h2 style="color: #333;">Verify your email address</h2>
    <p>Hi there,</p>
    <p>Please verify your email address by clicking the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a
        href="${verificationUrl}"
        style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;"
      >
        Verify Email
      </a>
    </div>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
    <p>If you didn't create an account, please ignore this email.</p>
  `
  return getEmailTemplate('Verify Your Email', content)
}

export function getPasswordResetEmailTemplate(resetUrl: string): string {
  const content = `
    <h2 style="color: #333;">Reset your password</h2>
    <p>Hi there,</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a
        href="${resetUrl}"
        style="background-color: #dc3545; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;"
      >
        Reset Password
      </a>
    </div>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
  `
  return getEmailTemplate('Reset Your Password', content)
}

