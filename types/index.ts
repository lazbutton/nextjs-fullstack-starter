// Common types for the application

export type User = {
  id: string
  email: string
  created_at: string
}

export type ApiResponse<T> = {
  data?: T
  error?: string
  success: boolean
}

