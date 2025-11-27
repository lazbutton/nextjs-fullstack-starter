/**
 * Documentation configuration
 * Maps documentation slugs to file paths and titles
 */
export const DOCUMENTATION_FILES = {
  readme: {
    path: 'README.md',
    title: 'README',
    description: 'Project overview and getting started guide',
    icon: '📖',
  },
  authentication: {
    path: 'docs/AUTHENTICATION.md',
    title: 'Authentication',
    description: 'Authentication system with Supabase',
    icon: '🔐',
  },
  database: {
    path: 'docs/DATABASE.md',
    title: 'Database',
    description: 'Database setup and migrations',
    icon: '🗄️',
  },
  'database-performance': {
    path: 'docs/DATABASE_PERFORMANCE.md',
    title: 'Database Performance',
    description: 'Performance optimization guidelines',
    icon: '⚡',
  },
  'email-guide': {
    path: 'docs/EMAIL_GUIDE.md',
    title: 'Email Guide',
    description: 'Email configuration with Supabase and Resend',
    icon: '📧',
  },
  'project-preferences': {
    path: 'PROJECT_PREFERENCES.md',
    title: 'Project Preferences',
    description: 'Coding conventions and best practices',
    icon: '⚙️',
  },
  env: {
    path: 'ENV.md',
    title: 'Environment Variables',
    description: 'Environment variables configuration',
    icon: '🔧',
  },
  'fix-missing-profiles': {
    path: 'docs/FIX_MISSING_PROFILES.md',
    title: 'Fix Missing Profiles',
    description: 'How to create missing user profiles',
    icon: '🔧',
  },
} as const

export type DocSlug = keyof typeof DOCUMENTATION_FILES

