/**
 * Authentication validation utilities
 */

import { MIN_PASSWORD_LENGTH, AUTH_ERROR_MESSAGES } from './constants'

/**
 * Validates that email and password are provided
 * @param email - User email address
 * @param password - User password
 * @returns Error message if validation fails, null otherwise
 */
export function validateEmailAndPassword(
  email: string | null,
  password: string | null
): string | null {
  if (!email || !password) {
    return AUTH_ERROR_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED
  }
  return null
}

/**
 * Validates that email is provided
 * @param email - User email address
 * @returns Error message if validation fails, null otherwise
 */
export function validateEmail(email: string | null): string | null {
  if (!email) {
    return AUTH_ERROR_MESSAGES.EMAIL_REQUIRED
  }
  return null
}

/**
 * Validates password length
 * @param password - User password
 * @returns Error message if validation fails, null otherwise
 */
export function validatePasswordLength(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return AUTH_ERROR_MESSAGES.PASSWORD_TOO_SHORT
  }
  return null
}

/**
 * Validates that password and confirmation password match
 * @param password - User password
 * @param confirmPassword - Password confirmation
 * @returns Error message if validation fails, null otherwise
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): string | null {
  if (password !== confirmPassword) {
    return AUTH_ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH
  }
  return null
}

/**
 * Validates password update form data
 * @param password - New password
 * @param confirmPassword - Password confirmation
 * @returns Error message if validation fails, null otherwise
 */
export function validatePasswordUpdate(
  password: string | null,
  confirmPassword: string | null
): string | null {
  if (!password || !confirmPassword) {
    return AUTH_ERROR_MESSAGES.PASSWORD_REQUIRED
  }

  const lengthError = validatePasswordLength(password)
  if (lengthError) {
    return lengthError
  }

  return validatePasswordMatch(password, confirmPassword)
}

