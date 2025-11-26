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
  if (envValue === undefined) {
    return true
  }
  
  // Support various truthy values
  return envValue.toLowerCase() === 'true' || envValue === '1'
}

