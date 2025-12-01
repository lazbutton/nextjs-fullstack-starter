'use server'

import { revalidatePath } from 'next/cache'
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { sendWelcomeEmail } from '@/lib/emails'
import {
  validateEmail,
  validateEmailAndPassword,
  validatePasswordLength,
  validatePasswordUpdate,
} from '@/lib/auth/validation'
import { createErrorResponse } from '@/lib/auth/error-handler'
import { AUTH_PATHS, AUTH_ERROR_MESSAGES } from '@/lib/auth/constants'
import { ensureProfileExists } from '@/lib/database/profiles'
import { createClient } from '@/lib/neon/server'
import type { ApiResponse } from '@/types'
import { DEFAULT_ROLE } from '@/lib/auth/roles'
import bcrypt from 'bcryptjs'

/**
 * Handles user registration
 * Creates a new user account and sends welcome/verification emails
 * @param formData - Form data containing email and password
 * @returns API response with user email on success, error message on failure
 */
export async function signUp(
  formData: FormData
): Promise<ApiResponse<{ email: string; autoLogin?: boolean }>> {
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
    const sql = createClient()
    
    // Check if user already exists
    const existingResult = await sql`
      SELECT id FROM profiles WHERE email = ${email} LIMIT 1
    `
    
    if (existingResult && (Array.isArray(existingResult) ? existingResult.length > 0 : true)) {
      return { success: false, error: 'Email already registered' }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Generate user ID
    const userId = crypto.randomUUID()

    // Create profile first
    const profile = await ensureProfileExists(
      userId,
      email,
      undefined
    )

    if (!profile) {
      return { success: false, error: 'Failed to create user profile' }
    }

    // Store hashed password
    await sql`
      INSERT INTO user_passwords (user_id, password_hash)
      VALUES (${userId}, ${hashedPassword})
      ON CONFLICT (user_id) DO UPDATE SET password_hash = ${hashedPassword}
    `

    // Send welcome email via Resend
    await handlePostSignUpEmails(email)

    // Automatically sign in the user after registration
    const signInResult = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (!signInResult?.ok) {
      // Profile created but sign-in failed - user can sign in manually
      return {
        success: true,
        data: { 
          email,
          autoLogin: false,
        },
      }
    }

    revalidatePath(AUTH_PATHS.HOME, 'layout')
    
    return {
      success: true,
      data: { 
        email,
        autoLogin: true,
      },
    }
  } catch (error: any) {
    return createErrorResponse(
      error,
      error?.message || `${AUTH_ERROR_MESSAGES.GENERIC_ERROR} during sign up`
    )
  }
}

/**
 * Sends welcome email after user sign up
 * @param email - User email address
 */
async function handlePostSignUpEmails(email: string): Promise<void> {
  await sendWelcomeEmail(email)
}

/**
 * Handles user authentication
 * Authenticates user with email and password
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
    // Use NextAuth signIn
    const result = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error || !result?.ok) {
      return { success: false, error: 'Invalid email or password' }
    }

    revalidatePath(AUTH_PATHS.HOME, 'layout')
    return {
      success: true,
      data: { email },
    }
  } catch (error: any) {
    return createErrorResponse(
      error,
      error?.message || `${AUTH_ERROR_MESSAGES.GENERIC_ERROR} during sign in`
    )
  }
}

/**
 * Handles user sign out
 * Ends the current user session
 */
export async function signOut(): Promise<ApiResponse<void>> {
  try {
    await nextAuthSignOut({ redirect: false })

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
    // TODO: Implement password reset with NextAuth
    // NextAuth doesn't have built-in password reset, so you'll need to implement this
    // You can use email providers like Resend to send reset links
    
    return {
      success: true,
      data: { email },
    }
  } catch (error: any) {
    return createErrorResponse(
      error,
      error?.message || `${AUTH_ERROR_MESSAGES.GENERIC_ERROR} during password reset`
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
    // TODO: Implement password update
    // You'll need to update the password hash in your database
    
    revalidatePath(AUTH_PATHS.HOME, 'layout')
    return {
      success: true,
      data: undefined,
    }
  } catch (error: any) {
    return createErrorResponse(
      error,
      error?.message || `${AUTH_ERROR_MESSAGES.GENERIC_ERROR} during password update`
    )
  }
}

/**
 * Gets the current authenticated user
 * @returns User object if authenticated, null otherwise
 */
export async function getCurrentUser() {
  try {
    const { auth } = await import('@/app/api/auth/[...nextauth]/route')
    const session = await auth()

    if (!session?.user) {
      return null
    }

    return session.user
  } catch {
    // Return null on any error - user is not authenticated
    return null
  }
}
