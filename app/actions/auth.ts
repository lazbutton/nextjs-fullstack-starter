'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/emails'
import {
  validateEmail,
  validateEmailAndPassword,
  validatePasswordLength,
  validatePasswordUpdate,
} from '@/lib/auth/validation'
import { createErrorResponse } from '@/lib/auth/error-handler'
import { AUTH_PATHS, AUTH_ERROR_MESSAGES } from '@/lib/auth/constants'
import { isEmailVerificationEnabled } from '@/lib/auth/config'
import type { ApiResponse } from '@/types'

/**
 * Handles user registration
 * Creates a new user account and sends welcome/verification emails
 * @param formData - Form data containing email and password
 * @returns API response with user email on success, error message on failure
 */
export async function signUp(
  formData: FormData
): Promise<ApiResponse<{ email: string }>> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate input
  const validationError = validateEmailAndPassword(email, password)
  if (validationError) {
    return { success: false, error: validationError }
  }

  const passwordError = validatePasswordLength(password)
  if (passwordError) {
    return { success: false, error: passwordError }
  }

  try {
    const supabase = await createClient()
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}${AUTH_PATHS.CALLBACK}`
    const emailVerificationEnabled = isEmailVerificationEnabled()

    const signUpOptions: {
      emailRedirectTo?: string
      data?: Record<string, unknown>
    } = {}

    // Only set emailRedirectTo if email verification is enabled
    // When disabled, Supabase should auto-confirm the email (configured in Supabase Dashboard)
    if (emailVerificationEnabled) {
      signUpOptions.emailRedirectTo = callbackUrl
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: signUpOptions,
    })

    if (error) {
      return createErrorResponse(error, 'Failed to create account')
    }

    if (data.user) {
      // Send welcome email via Resend (Supabase handles verification email automatically)
      await handlePostSignUpEmails(email)

      // Note: Redirect should be handled client-side to avoid NEXT_REDIRECT errors
      // The signUpForm will handle the redirect based on email verification status
    }

    return {
      success: true,
      data: { email },
    }
  } catch (error) {
    return createErrorResponse(
      error,
      `${AUTH_ERROR_MESSAGES.GENERIC_ERROR} during sign up`
    )
  }
}

/**
 * Sends welcome email after user sign up
 * Note: Email verification is handled automatically by Supabase
 * @param email - User email address
 */
async function handlePostSignUpEmails(email: string): Promise<void> {
  // Send welcome email via Resend (personalized)
  // Email verification is handled automatically by Supabase when emailRedirectTo is set
  await sendWelcomeEmail(email)
}

/**
 * Handles user authentication
 * Authenticates user with email and password and redirects to home page
 * @param formData - Form data containing email and password
 * @returns API response (redirects on success, error message on failure)
 */
export async function signIn(
  formData: FormData
): Promise<ApiResponse<{ email: string }>> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate input
  const validationError = validateEmailAndPassword(email, password)
  if (validationError) {
    return { success: false, error: validationError }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return createErrorResponse(error, 'Invalid email or password')
    }

    if (data.user) {
      revalidatePath(AUTH_PATHS.HOME, 'layout')
      // Return success - redirect will be handled client-side
      return {
        success: true,
        data: { email },
      }
    }

    return {
      success: false,
      error: AUTH_ERROR_MESSAGES.SIGN_IN_FAILED,
    }
  } catch (error) {
    return createErrorResponse(
      error,
      `${AUTH_ERROR_MESSAGES.GENERIC_ERROR} during sign in`
    )
  }
}

/**
 * Handles user sign out
 * Ends the current user session
 * Note: Redirect should be handled client-side to avoid NEXT_REDIRECT errors
 */
export async function signOut(): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return createErrorResponse(error, 'Failed to sign out')
    }

    revalidatePath(AUTH_PATHS.HOME, 'layout')
    return {
      success: true,
      data: undefined,
    }
  } catch (error) {
    return createErrorResponse(error, 'Failed to sign out')
  }
}

/**
 * Initiates password reset process
 * Sends password reset email to the user
 * @param formData - Form data containing email address
 * @returns API response with email on success, error message on failure
 */
export async function resetPassword(
  formData: FormData
): Promise<ApiResponse<{ email: string }>> {
  const email = formData.get('email') as string

  // Validate input
  const validationError = validateEmail(email)
  if (validationError) {
    return { success: false, error: validationError }
  }

  try {
    const supabase = await createClient()
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}${AUTH_PATHS.RESET_PASSWORD}`

    // Supabase automatically sends password reset email with the redirect URL
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl,
    })

    if (error) {
      return createErrorResponse(error, 'Failed to send password reset email')
    }

    // Note: Password reset email is sent automatically by Supabase
    // We don't send a custom email via Resend to avoid duplicates
    // If you want a custom email, configure email templates in Supabase Dashboard

    return {
      success: true,
      data: { email },
    }
  } catch (error) {
    return createErrorResponse(
      error,
      `${AUTH_ERROR_MESSAGES.GENERIC_ERROR} during password reset`
    )
  }
}

/**
 * Updates user password
 * Validates and updates the current user's password
 * @param formData - Form data containing new password and confirmation
 * @returns API response (redirects on success, error message on failure)
 */
export async function updatePassword(
  formData: FormData
): Promise<ApiResponse<void>> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // Validate input
  const validationError = validatePasswordUpdate(password, confirmPassword)
  if (validationError) {
    return { success: false, error: validationError }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      return createErrorResponse(error, 'Failed to update password')
    }

    revalidatePath(AUTH_PATHS.HOME, 'layout')
    // Return success - redirect will be handled client-side to avoid NEXT_REDIRECT errors
    return {
      success: true,
      data: undefined,
    }
  } catch (error) {
    return createErrorResponse(
      error,
      `${AUTH_ERROR_MESSAGES.GENERIC_ERROR} during password update`
    )
  }
}

/**
 * Gets the current authenticated user
 * @returns User object if authenticated, null otherwise
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch {
    // Return null on any error - user is not authenticated
    return null
  }
}

