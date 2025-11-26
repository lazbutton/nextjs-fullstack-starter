/**
 * Authentication configuration
 * Reads settings from environment variables
 */

/**
 * Checks if email verification is enabled
 * @returns true if email verification is enabled, false otherwise
 */
export function isEmailVerificationEnabled(): boolean {
  const envValue = process.env.ENABLE_EMAIL_VERIFICATION
  
  // Default to true if not set (secure by default)
  if (!envValue) {
    return true
  }
  
  // Support various truthy values
  const normalizedValue = envValue.toLowerCase().trim()
  return normalizedValue === 'true' || normalizedValue === '1'
}

