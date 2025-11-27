/**
 * User roles and authorization utilities
 * Defines user roles and provides functions to check user permissions
 */

/**
 * Available user roles
 */
export type UserRole = 'user' | 'admin' | 'moderator'

/**
 * Default role for new users
 */
export const DEFAULT_ROLE: UserRole = 'user'

/**
 * Role hierarchy (higher number = more permissions)
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 1,
  moderator: 2,
  admin: 3,
}

/**
 * Check if a role has sufficient permissions
 * @param userRole - The user's role
 * @param requiredRole - The minimum role required
 * @returns True if user has sufficient permissions
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

/**
 * Check if user is an admin
 * @param role - User role
 * @returns True if user is admin
 */
export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === 'admin'
}

/**
 * Check if user is a moderator or admin
 * @param role - User role
 * @returns True if user is moderator or admin
 */
export function isModeratorOrAdmin(role: UserRole | null | undefined): boolean {
  return role === 'moderator' || role === 'admin'
}

/**
 * Get all available roles
 * @returns Array of all user roles
 */
export function getAllRoles(): UserRole[] {
  return ['user', 'moderator', 'admin']
}

