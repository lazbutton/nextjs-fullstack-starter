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

## UI/UX Standards

- **Button cursor**: All buttons in the application must have `cursor: pointer` style

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

- Follow Next.js App Router conventions
- Components in `/components`
- Utilities in `/lib`
- Types in `/types`
- Server actions in `/app/actions`

