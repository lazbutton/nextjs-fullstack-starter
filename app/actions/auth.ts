'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from '@/lib/emails'
import {
  validateEmail,
  validateEmailAndPassword,
  validatePasswordLength,
  validatePasswordUpdate,
} from '@/lib/auth/validation'
import { createErrorResponse } from '@/lib/auth/error-handler'
import { AUTH_PATHS, AUTH_ERROR_MESSAGES } from '@/lib/auth/constants'
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: callbackUrl,
      },
    })

    if (error) {
      return createErrorResponse(error, 'Failed to create account')
    }

    if (data.user) {
      await handlePostSignUpEmails(email, data.user.email, !!data.session)
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
 * Sends welcome and verification emails after user sign up
 * @param email - User email address
 * @param userEmail - Email from user object
 * @param hasSession - Whether user has an active session
 */
async function handlePostSignUpEmails(
  email: string,
  userEmail: string | undefined,
  hasSession: boolean
): Promise<void> {
  // Send welcome email
  await sendWelcomeEmail(email)

  // Send verification email if email confirmation is enabled
  // Supabase may send this automatically, but we send it manually as backup
  if (userEmail && !hasSession) {
    await sendVerificationEmail(email)
  }
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
      redirect(AUTH_PATHS.HOME)
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
 * Ends the current user session and redirects to sign in page
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath(AUTH_PATHS.HOME, 'layout')
  redirect(AUTH_PATHS.SIGN_IN)
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

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl,
    })

    if (error) {
      return createErrorResponse(error, 'Failed to send password reset email')
    }

    // Send password reset email
    await sendPasswordResetEmail(email)

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
    redirect(AUTH_PATHS.HOME)
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

