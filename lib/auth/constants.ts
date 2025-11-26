/**
 * Authentication-related constants
 */

export const MIN_PASSWORD_LENGTH = 6

export const AUTH_ERROR_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  EMAIL_AND_PASSWORD_REQUIRED: 'Email and password are required',
  PASSWORD_TOO_SHORT: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  SIGN_IN_FAILED: 'Sign in failed',
  GENERIC_ERROR: 'An error occurred',
} as const

export const AUTH_PATHS = {
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',
  CALLBACK: '/auth/callback',
  RESET_PASSWORD: '/auth/reset-password',
  HOME: '/',
} as const

