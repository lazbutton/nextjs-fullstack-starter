/**
 * Neon client for browser-side database access
 * Note: In most cases, database operations should be done server-side
 * This client is provided for edge cases where client-side DB access is needed
 */

import { neon } from '@neondatabase/serverless'

export function createClient() {
  const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL

  if (!connectionString) {
    throw new Error('NEXT_PUBLIC_DATABASE_URL is not set')
  }

  return neon(connectionString)
}

