/**
 * Role-based routing utilities
 */

export type UserRole = 'client' | 'admin' | 'designer' | 'marketer'

/**
 * Get the dashboard path for a given role
 */
export function getDashboardPath(role: UserRole): string {
  const rolePaths: Record<UserRole, string> = {
    client: '/dashboard/client',
    admin: '/dashboard/admin',
    designer: '/dashboard/designer',
    marketer: '/dashboard/marketer',
  }
  return rolePaths[role] || '/dashboard/client'
}

/**
 * Get the default redirect path for a user based on their role
 */
export function getDefaultRedirect(role: UserRole | null | undefined): string {
  if (!role) return '/login'
  return getDashboardPath(role)
}

/**
 * Check if a role has access to a specific dashboard path
 */
export function canAccessPath(role: UserRole, path: string): boolean {
  // Admin can access all paths
  if (role === 'admin') return true
  
  // Check if path matches role's dashboard
  const rolePath = getDashboardPath(role)
  if (path.startsWith(rolePath)) return true
  
  // All roles can access profile
  if (path.startsWith('/dashboard/profile')) return true
  
  return false
}
