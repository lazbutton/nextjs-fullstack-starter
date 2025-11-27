/**
 * Zod validation schemas
 * Provides reusable validation schemas for forms and API endpoints
 */

import { z } from 'zod'
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/constants'

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)

/**
 * Sign up form schema
 */
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

/**
 * Sign in form schema
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

/**
 * Forgot password form schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

/**
 * Reset password form schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

/**
 * Generic form data parser helper
 * Converts FormData to a plain object for Zod validation
 */
export function parseFormData<T>(formData: FormData, schema: z.ZodSchema<T>): {
  success: true
  data: T
} | {
  success: false
  errors: z.ZodError
} {
  const rawData = Object.fromEntries(formData.entries())
  const result = schema.safeParse(rawData)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error }
}

/**
 * Extract validation errors from Zod error
 * Returns a map of field names to error messages
 */
export function extractValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}

  error.issues.forEach((err) => {
    const path = err.path.join('.')
    if (!errors[path]) {
      errors[path] = err.message
    }
  })

  return errors
}

/**
 * Get the first validation error message
 * Useful for displaying a single error message
 */
export function getFirstValidationError(error: z.ZodError): string {
  const firstError = error.issues[0]
  return firstError?.message || 'Validation error'
}

