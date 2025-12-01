/**
 * Neon server client for database operations
 * Use this for server-side database queries
 */

import { neon } from '@neondatabase/serverless'

let cachedClient: ReturnType<typeof neon> | null = null

export function createClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }

  // Reuse connection in serverless environments
  if (cachedClient) {
    return cachedClient
  }

  cachedClient = neon(connectionString)
  return cachedClient
}

