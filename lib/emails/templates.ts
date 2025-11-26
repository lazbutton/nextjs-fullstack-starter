import { EMAIL_DEFAULTS, EMAIL_EXPIRY, EMAIL_STYLES } from './constants'

/**
 * Creates a base HTML email template with consistent styling
 * @param title - Email title/heading
 * @param content - HTML content to display in the email body
 * @returns Complete HTML email template as a string
 */
export function getEmailTemplate(title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: ${EMAIL_STYLES.FONT_FAMILY}; line-height: ${EMAIL_STYLES.LINE_HEIGHT}; color: ${EMAIL_STYLES.TEXT_COLOR}; margin: 0; padding: 0;">
        <div style="max-width: ${EMAIL_STYLES.CONTAINER_MAX_WIDTH}; margin: 0 auto; padding: ${EMAIL_STYLES.PADDING_SMALL};">
          <div style="background-color: ${EMAIL_STYLES.BACKGROUND_LIGHT}; padding: ${EMAIL_STYLES.PADDING_SMALL}; text-align: center;">
            <h1 style="color: ${EMAIL_STYLES.TEXT_COLOR}; margin: 0;">${title}</h1>
          </div>
          <div style="background-color: ${EMAIL_STYLES.BACKGROUND_WHITE}; padding: ${EMAIL_STYLES.PADDING_MEDIUM};">
            ${content}
          </div>
          <div style="background-color: ${EMAIL_STYLES.BACKGROUND_LIGHT}; padding: ${EMAIL_STYLES.PADDING_SMALL}; text-align: center; font-size: ${EMAIL_STYLES.FONT_SIZE_SMALL}; color: ${EMAIL_STYLES.MUTED_COLOR};">
            <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Creates a welcome email template for new users
 * @param name - Optional user name, defaults to "there"
 * @returns HTML email template for welcome message
 */
export function getWelcomeEmailTemplate(name?: string): string {
  const userName = name || EMAIL_DEFAULTS.DEFAULT_NAME
  const content = `
    <h2 style="color: ${EMAIL_STYLES.TEXT_COLOR};">Welcome to our platform!</h2>
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

/**
 * Creates an email verification template
 * @param verificationUrl - URL for email verification
 * @returns HTML email template for verification message
 */
export function getVerificationEmailTemplate(verificationUrl: string): string {
  const content = `
    <h2 style="color: ${EMAIL_STYLES.TEXT_COLOR};">Verify your email address</h2>
    <p>Hi there,</p>
    <p>Please verify your email address by clicking the button below:</p>
    <div style="text-align: center; margin: ${EMAIL_STYLES.PADDING_MEDIUM} 0;">
      <a
        href="${verificationUrl}"
        style="background-color: ${EMAIL_STYLES.PRIMARY_COLOR}; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;"
      >
        Verify Email
      </a>
    </div>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: ${EMAIL_STYLES.PRIMARY_COLOR};">${verificationUrl}</p>
    <p>This link will expire in ${EMAIL_EXPIRY.VERIFICATION_HOURS} hours.</p>
    <p>If you didn't create an account, please ignore this email.</p>
  `
  return getEmailTemplate('Verify Your Email', content)
}

/**
 * Creates a password reset email template
 * @param resetUrl - URL for password reset
 * @returns HTML email template for password reset message
 */
export function getPasswordResetEmailTemplate(resetUrl: string): string {
  const content = `
    <h2 style="color: ${EMAIL_STYLES.TEXT_COLOR};">Reset your password</h2>
    <p>Hi there,</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <div style="text-align: center; margin: ${EMAIL_STYLES.PADDING_MEDIUM} 0;">
      <a
        href="${resetUrl}"
        style="background-color: ${EMAIL_STYLES.DANGER_COLOR}; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;"
      >
        Reset Password
      </a>
    </div>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: ${EMAIL_STYLES.PRIMARY_COLOR};">${resetUrl}</p>
    <p>This link will expire in ${EMAIL_EXPIRY.PASSWORD_RESET_HOURS} hour.</p>
    <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
  `
  return getEmailTemplate('Reset Your Password', content)
}

