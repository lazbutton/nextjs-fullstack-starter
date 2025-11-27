/**
 * Toast utility functions
 * Provides helper functions for showing toast notifications
 * These functions can be called from both client and server components
 */

import { toast as sonnerToast } from 'sonner'

/**
 * Shows a success toast notification
 * @param message - Success message to display
 * @param description - Optional description
 */
export function toastSuccess(message: string, description?: string) {
  sonnerToast.success(message, {
    description,
  })
}

/**
 * Shows an error toast notification
 * @param message - Error message to display
 * @param description - Optional description
 */
export function toastError(message: string, description?: string) {
  sonnerToast.error(message, {
    description,
  })
}

/**
 * Shows an info toast notification
 * @param message - Info message to display
 * @param description - Optional description
 */
export function toastInfo(message: string, description?: string) {
  sonnerToast.info(message, {
    description,
  })
}

/**
 * Shows a warning toast notification
 * @param message - Warning message to display
 * @param description - Optional description
 */
export function toastWarning(message: string, description?: string) {
  sonnerToast.warning(message, {
    description,
  })
}

/**
 * Shows a loading toast notification
 * Returns a promise that resolves when the toast is dismissed
 * @param message - Loading message to display
 * @param description - Optional description
 */
export function toastLoading(message: string, description?: string) {
  return sonnerToast.loading(message, {
    description,
  })
}

/**
 * Promise-based toast that shows loading, then success or error
 * @param promise - Promise to track
 * @param messages - Messages for loading, success, and error states
 */
export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: Error) => string)
  }
) {
  return sonnerToast.promise(promise, messages)
}

/**
 * Dismisses a toast by its ID
 * @param toastId - ID of the toast to dismiss
 */
export function toastDismiss(toastId: string | number) {
  sonnerToast.dismiss(toastId)
}

/**
 * Dismisses all toasts
 */
export function toastDismissAll() {
  sonnerToast.dismiss()
}

