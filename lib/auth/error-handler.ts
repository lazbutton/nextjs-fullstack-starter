/**
 * Error handling utilities for authentication
 */

/**
 * Extracts a user-friendly error message from an error object
 * @param error - Error object or unknown type
 * @param defaultMessage - Default message to use if error cannot be parsed
 * @returns User-friendly error message
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage: string
): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return defaultMessage
}

/**
 * Creates a standardized error response
 * @param error - Error object or message
 * @param defaultMessage - Default error message
 * @returns Standardized error response
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage: string
): { success: false; error: string } {
  return {
    success: false,
    error: getErrorMessage(error, defaultMessage),
  }
}

