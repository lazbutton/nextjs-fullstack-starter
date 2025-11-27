# Removing Documentation System

This guide explains how to completely remove the documentation system from the project to start with a simple base.

## Overview

The documentation system includes:
- Documentation pages (`/docs`)
- Documentation components
- Documentation utilities
- Navigation links to documentation
- Dependencies for markdown rendering

## Step-by-Step Removal

### 1. Remove Documentation Routes

Delete the documentation pages directory:

```bash
rm -rf app/docs/
```

This removes:
- `app/docs/page.tsx`
- `app/docs/[slug]/page.tsx`

### 2. Remove Documentation Components

Delete all documentation-related components:

```bash
rm -rf components/docs/
```

This removes:
- `components/docs/docs-sidebar.tsx`
- `components/docs/documentation-content.tsx`
- `components/docs/copy-code-button.tsx`
- `components/docs/code-block-with-copy.tsx`

### 3. Remove Documentation Utilities

Delete documentation utilities:

```bash
rm -rf lib/docs/
```

This removes:
- `lib/docs/scan.ts`

### 4. Remove Documentation Dependencies

Uninstall markdown-related packages:

```bash
npm uninstall react-markdown remark-gfm
```

### 5. Update Navigation Components

**File: `components/layout/header.tsx`**

Remove the Documentation link from the navigation:

```tsx
// Remove these lines (lines 28-33):
<Link
  href="/docs"
  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
>
  Documentation
</Link>
```

**File: `components/layout/footer.tsx`**

Remove the Documentation link from the footer:

```tsx
// Remove these lines (lines 24-29):
<a
  href="/docs"
  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
>
  Documentation
</a>
```

### 6. Remove Documentation Files (Optional)

You can keep or remove documentation markdown files:

**To remove all documentation files:**

```bash
# Remove all docs
rm -rf docs/

# Remove root documentation files
rm README.md ENV.md PROJECT_PREFERENCES.md CHANGELOG.md BOILERPLATE_IMPROVEMENTS.md
```

**To keep some files (recommended):**

```bash
# Keep README.md for basic project info
# Keep ENV.md for environment variables reference
# Keep PROJECT_PREFERENCES.md for team conventions
# Remove only the docs/ directory if you don't need the documentation pages
rm -rf docs/
```

### 7. Clean Up CSS (Optional)

If you added custom styles for markdown in `app/globals.css`, you can remove the `.markdown-content` styles:

```css
/* Remove if present in app/globals.css */
.markdown-content { ... }
```

### 8. Verify Removal

After completing the steps, verify everything works:

```bash
# Build the project
npm run build

# Check for errors
npm run lint
```

Ensure:
- ✅ Project builds successfully
- ✅ No broken imports
- ✅ Navigation works without documentation links
- ✅ Home page loads correctly
- ✅ All other features still work

## Complete Removal Script

If you want to remove everything at once, here's a complete script:

```bash
#!/bin/bash

# Remove documentation routes
rm -rf app/docs/

# Remove documentation components
rm -rf components/docs/

# Remove documentation utilities
rm -rf lib/docs/

# Remove documentation dependencies
npm uninstall react-markdown remark-gfm

# Remove all documentation files (optional)
rm -rf docs/
rm README.md ENV.md PROJECT_PREFERENCES.md CHANGELOG.md BOILERPLATE_IMPROVEMENTS.md

echo "Documentation system removed. Don't forget to:"
echo "1. Remove documentation links from header.tsx and footer.tsx"
echo "2. Run 'npm run build' to verify"
```

## What Remains

After removing the documentation system, you'll still have:

- ✅ Core Next.js 16 application
- ✅ Authentication system (sign up, sign in, password reset)
- ✅ Database setup with migrations
- ✅ UI components (shadcn/ui)
- ✅ Toast notifications
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation (Zod)
- ✅ Internationalization (i18n)
- ✅ Dashboard layout
- ✅ All functional features

## Next Steps

After removal:

1. Create your own simple `README.md` with basic setup instructions
2. Customize the home page (`app/page.tsx`)
3. Remove unused features if needed
4. Start building your application features

## Notes

- This removal doesn't affect any functional features of the template
- You can always add documentation back later if needed
- Consider keeping a minimal `README.md` for setup instructions
