import { resend } from '@/lib/resend'
import {
  getWelcomeEmailTemplate,
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
} from './templates'

const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    const html = getWelcomeEmailTemplate(name)

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Welcome to our platform!',
      html,
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function sendVerificationEmail(email: string, verificationUrl?: string) {
  try {
    // If no verification URL provided, use the default callback URL
    const url =
      verificationUrl ||
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?code=VERIFY_TOKEN`

    const html = getVerificationEmailTemplate(url)

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Verify your email address',
      html,
    })

    if (error) {
      console.error('Error sending verification email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl?: string) {
  try {
    // If no reset URL provided, use the default reset password URL
    const url =
      resetUrl || `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=RESET_TOKEN`

    const html = getPasswordResetEmailTemplate(url)

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Reset your password',
      html,
    })

    if (error) {
      console.error('Error sending password reset email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

