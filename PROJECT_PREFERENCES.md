# Project Preferences

This document outlines the preferences and conventions for this project.

## Git & Commits

- **Commit messages**: Always in English
- **Commit frequency**: Regular commits for each feature/change
- **Commit format**: Clear, descriptive messages (e.g., "Add feature X", "Fix bug Y")

## Code Comments

- **Language**: All code comments must be in English
- **Style**: Clear, concise, and helpful comments

## Development Standards

- **TypeScript**: Strict mode enabled
- **Best practices**: Follow Next.js and React best practices
- **Code organization**: Well-structured, modular code
- **Error handling**: Proper error handling throughout
- **Regular builds**: Run `npm run build` regularly to catch errors early
- **Error correction**: Fix all build errors and warnings immediately
- **Build verification**: Ensure the project builds successfully before committing major changes
- **SEO verification**: Regularly check and optimize SEO (metadata, titles, descriptions, Open Graph tags)
- **SEO correction**: Fix SEO issues in files when necessary (layout.tsx, page.tsx, etc.)
- **Documentation check**: Always check recent documentation to stay up-to-date with the latest features, best practices, and API changes for all technologies used in the project
- **Middleware deprecation**: Next.js 16 shows a deprecation warning for the middleware file convention in favor of "proxy". However, the middleware.ts file is required for Supabase SSR session management. This is a known limitation and the middleware will continue to work despite the warning
- **Middleware note**: The middleware.ts file is required for Supabase SSR session management. While Next.js 16 shows a deprecation warning in favor of "proxy", the middleware is still necessary and functional for Supabase authentication

## Database & Migrations

### Supabase Migrations

- **Regular migrations**: Apply database migrations regularly to keep the schema up-to-date with the codebase
- **Non-destructive migrations**: All migrations must be non-destructive and backwards-compatible
  - Use `CREATE TABLE IF NOT EXISTS` instead of `CREATE TABLE`
  - Use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for adding columns
  - Use `DROP INDEX IF EXISTS` when removing indexes
  - Always check for existence before dropping tables, columns, or constraints
- **Migration naming**: Use sequential numbering pattern `XXX_description.sql` (e.g., `001_create_profiles_table.sql`)
- **Migration order**: Always apply migrations in sequential order (001, 002, 003, etc.)
- **Rollback safety**: Write migrations that can be safely applied multiple times (idempotent)
- **Data preservation**: Never drop tables or columns with data without creating a backup or migration plan first
- **Testing migrations**: Test migrations on a development/staging environment before applying to production
- **Migration documentation**: Each migration file must include comments explaining what it does and why
- **Migration location**: All migrations must be placed in `/supabase/migrations/` directory
- **Version control**: All migration files must be committed to version control
- **Breaking changes**: If a migration must be destructive, create a separate migration for data migration/backup first, document the breaking change clearly, and coordinate with the team

### Migration Best Practices

- **Additive changes preferred**: Prefer adding new columns/tables over modifying existing ones
- **Default values**: Always provide default values for new NOT NULL columns added to existing tables
- **Null safety**: When adding new columns, allow NULL initially, then migrate data, then add NOT NULL constraint if needed
- **Index management**: Create indexes concurrently to avoid locking production tables
- **Foreign keys**: Use `ON DELETE CASCADE` or `ON DELETE SET NULL` appropriately to maintain data integrity
- **Row Level Security**: Always enable RLS on new tables and create appropriate policies
- **Trigger safety**: Use `CREATE OR REPLACE FUNCTION` and `DROP TRIGGER IF EXISTS` for triggers

## Code Maintainability & Best Practices

### Human-Readable Code

- **Readability first**: Write code that is easy to read and understand by humans. Prioritize clarity over cleverness
- **Self-documenting code**: Use descriptive names that explain the purpose of variables, functions, and components
- **Avoid magic numbers**: Use named constants instead of hardcoded values
- **Consistent naming**: Follow consistent naming conventions throughout the codebase

### Code Organization & Structure

- **Single Responsibility Principle**: Each function, component, or module should have one clear responsibility
- **Separation of concerns**: Separate business logic from UI components, data fetching from data processing
- **Modular architecture**: Break down complex features into smaller, reusable modules
- **File organization**: Keep related code together, following the project structure conventions
- **Feature-based structure**: Organize code by feature when appropriate (e.g., `/components/auth/*` for authentication-related components)

### Code Splitting & Modularity

- **Component size**: Keep React components small and focused (ideally under 200 lines). Split large components into smaller, reusable ones
- **Function length**: Keep functions concise and focused (ideally under 50 lines). Extract complex logic into separate helper functions
- **File size**: Aim to keep files under 300 lines. Split larger files into multiple modules
- **Reusable utilities**: Extract common logic into utility functions in `/lib`
- **Custom hooks**: Extract complex state logic into custom hooks for reusability

### Naming Conventions

- **Variables & functions**: Use camelCase with descriptive names (e.g., `getUserById`, `isAuthenticated`)
- **Components**: Use PascalCase with descriptive names (e.g., `UserProfile`, `SignInForm`)
- **Types & interfaces**: Use PascalCase (e.g., `User`, `ApiResponse`)
- **Constants**: Use UPPER_SNAKE_CASE for constants (e.g., `MAX_RETRY_ATTEMPTS`)
- **Files**: Use kebab-case for file names (e.g., `sign-in-form.tsx`, `auth-utils.ts`)
- **Booleans**: Prefix with `is`, `has`, `should`, `can` (e.g., `isLoading`, `hasPermission`)

### Code Reusability

- **DRY (Don't Repeat Yourself)**: Extract repeated code into reusable functions or components
- **Shared components**: Create reusable UI components in `/components/ui`
- **Utility functions**: Place reusable logic in `/lib` with clear documentation
- **Custom hooks**: Extract reusable stateful logic into custom hooks in `/hooks`
- **Type definitions**: Share types and interfaces through `/types` directory

### File Structure Standards

- **One component per file**: Each React component should have its own file
- **Index files**: Use `index.ts` files to export multiple related items from a directory
- **Co-location**: Keep related files close together (e.g., component + styles + tests in same directory)
- **Barrel exports**: Use index files to create clean import paths, but avoid deep barrel exports that slow down builds

### Code Documentation

- **Function documentation**: Add JSDoc comments for complex functions, especially public APIs
- **Inline comments**: Use comments to explain "why" not "what". Code should be self-explanatory
- **Complex logic**: Comment complex algorithms or business rules that aren't immediately obvious
- **TODOs**: Use TODO comments for future improvements, but prefer creating issues/tasks

### Error Handling

- **Explicit error handling**: Always handle errors explicitly. Don't ignore error cases
- **Error messages**: Provide clear, actionable error messages for users and developers
- **Error boundaries**: Use React error boundaries for component-level error handling
- **Validation**: Validate input at boundaries (forms, API endpoints, functions)

### Performance Considerations

- **Lazy loading**: Use dynamic imports for large components or pages
- **Memoization**: Use React.memo, useMemo, useCallback appropriately, but avoid premature optimization
- **Server Components**: Prefer Server Components by default, use Client Components only when needed
- **Image optimization**: Use Next.js Image component for all images

### Testing Readiness

- **Testable code**: Write code that can be easily tested (pure functions, clear dependencies)
- **Dependency injection**: Pass dependencies as parameters to make code testable
- **Avoid side effects**: Minimize side effects in functions, isolate them when necessary

## UI/UX Standards

- **Button cursor**: All buttons in the application must have `cursor: pointer` style

## Translations

- **Translation keys**: Only update translation keys in the English (`en.json`) file
- **Other languages**: The project maintainer manually updates translation keys in other language files (e.g., `fr.json`)
- **No automatic updates**: Do not automatically add or update translation keys in non-English language files
- **Structure**: Keep translation keys synchronized in structure, but translations are managed manually

## Stack & Technologies

- Next.js 16 with App Router
- TypeScript
- Supabase (PostgreSQL + Authentication)
- shadcn/ui components
- Resend for email
- Server Actions for form handling
- Middleware for route protection
- Translation (en, fr)

## Project Structure

### Directory Organization

- **`/app`**: Next.js App Router pages and layouts
  - **`/app/actions`**: Server Actions for form handling and mutations
  - **`/app/auth`**: Authentication-related pages
  - **`/app/[feature]`**: Feature-based route groups when needed
- **`/components`**: React components
  - **`/components/ui`**: Reusable UI components (shadcn/ui)
  - **`/components/[feature]`**: Feature-specific components (e.g., `/components/auth/*`)
- **`/lib`**: Utility functions and configurations
  - **`/lib/[feature]`**: Feature-specific utilities (e.g., `/lib/auth/*`, `/lib/emails/*`)
  - **`/lib/database/`**: Database utilities and type definitions
- **`/hooks`**: Custom React hooks
- **`/types`**: TypeScript type definitions and interfaces
- **`/i18n`**: Internationalization configuration and translations
- **`/docs`**: Project documentation
- **`/public`**: Static assets (images, icons, etc.)
- **`/supabase`**: Supabase configuration and migrations
  - **`/supabase/migrations/`**: SQL migration files (numbered sequentially)
  - **`/supabase/README.md`**: Migration documentation

### File Naming Conventions

- **Pages**: Use lowercase with hyphens (e.g., `sign-in/page.tsx`)
- **Components**: Use PascalCase (e.g., `SignInForm.tsx`)
- **Utilities**: Use camelCase (e.g., `authUtils.ts`)
- **Types**: Use PascalCase (e.g., `User.ts` or `types/index.ts`)
- **Hooks**: Prefix with `use` (e.g., `useAuth.ts`)
- **Server Actions**: Use camelCase (e.g., `auth.ts`, `locale.ts`)

