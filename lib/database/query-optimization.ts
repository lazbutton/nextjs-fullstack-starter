/**
 * Database query optimization utilities
 * Provides helper functions and patterns for optimized database queries
 */

import { logger } from '@/lib/logger'

/**
 * Query optimization options
 */
interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

/**
 * Build optimized SELECT query with common patterns
 * @param tableName - Table name
 * @param selectFields - Fields to select (default: '*')
 * @param filters - Filter conditions
 * @param options - Query options (limit, offset, ordering)
 * @returns Optimized query builder chain
 */
export function buildOptimizedQuery<T>(
  tableName: string,
  selectFields: string = '*',
  filters?: Record<string, unknown>,
  options?: QueryOptions
) {
  // This is a conceptual helper - actual implementation depends on Neon client
  // The goal is to ensure queries use indexes efficiently
  
  const queryConfig = {
    select: selectFields,
    filters,
    limit: options?.limit,
    offset: options?.offset,
    orderBy: options?.orderBy,
    orderDirection: options?.orderDirection || 'desc',
  }

  logger.debug(`Building optimized query for ${tableName}`, queryConfig)
  
  return queryConfig
}

/**
 * Get paginated results with optimized query
 * Uses index-friendly ordering and limiting
 */
export interface PaginatedResult<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Optimized query patterns for common operations
 */
export const QueryPatterns = {
  /**
   * Use this pattern for email lookups (uses unique index)
   */
  findByEmail: 'email = ?',

  /**
   * Use this pattern for date range queries (uses date indexes)
   */
  dateRange: 'created_at >= ? AND created_at <= ?',

  /**
   * Use this pattern for text searches (uses text index)
   */
  textSearch: 'full_name ILIKE ?',

  /**
   * Use this pattern for pagination (uses composite indexes)
   */
  paginatedList: 'ORDER BY created_at DESC LIMIT ? OFFSET ?',
} as const

/**
 * Performance monitoring helper
 * Log slow queries for optimization
 */
export function logSlowQuery(
  tableName: string,
  queryType: string,
  duration: number,
  threshold: number = 100
): void {
  if (duration > threshold) {
    logger.warn(`Slow query detected: ${tableName}.${queryType} took ${duration}ms`)
  }
}

