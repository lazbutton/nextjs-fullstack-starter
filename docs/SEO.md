# SEO Guide

This guide explains all the SEO optimizations implemented in this Next.js template and how to use them effectively.

## Overview

This template includes comprehensive SEO features out of the box:

- Dynamic sitemap generation
- robots.txt configuration
- Advanced metadata for all pages
- JSON-LD structured data
- Open Graph and Twitter Cards
- PWA manifest
- Optimized Next.js configuration
- Performance optimizations

## Table of Contents

1. [Metadata](#metadata)
2. [Sitemap](#sitemap)
3. [Robots.txt](#robotstxt)
4. [Structured Data](#structured-data)
5. [Open Graph & Social Media](#open-graph--social-media)
6. [PWA Support](#pwa-support)
7. [Configuration](#configuration)
8. [Best Practices](#best-practices)

## Metadata

### Root Layout Metadata

The root layout (`app/layout.tsx`) includes comprehensive metadata:

```typescript
export async function generateMetadata(): Promise<Metadata> {
  // Returns comprehensive metadata including:
  // - Title and description
  // - Keywords
  // - Open Graph tags
  // - Twitter Cards
  // - Verification tokens
  // - Alternate languages
  // - Icons and favicons
}
```

**Environment Variables for Verification:**

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code
NEXT_PUBLIC_YANDEX_VERIFICATION=your-yandex-verification-code
NEXT_PUBLIC_BING_VERIFICATION=your-bing-verification-code
```

### Page-Specific Metadata

Each page can define its own metadata:

```typescript
// Static metadata
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
  keywords: ['keyword1', 'keyword2'],
}

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  // Fetch data and generate metadata
  return {
    title: dynamicTitle,
    description: dynamicDescription,
  }
}
```

### Metadata Best Practices

- **Title**: 50-60 characters, include primary keyword
- **Description**: 150-160 characters, compelling and descriptive
- **Keywords**: 5-10 relevant keywords (less important for modern SEO)
- **Images**: Always include OG images (1200x630px recommended)

## Sitemap

### Automatic Sitemap Generation

The sitemap is automatically generated at `app/sitemap.ts` and includes:

- All static pages
- All documentation pages (scanned dynamically)
- Proper priority and change frequency settings

**Access your sitemap at:** `https://yourdomain.com/sitemap.xml`

### Customizing the Sitemap

To add more pages to the sitemap, edit `app/sitemap.ts`:

```typescript
const customPages: MetadataRoute.Sitemap = [
  {
    url: `${baseUrl}/custom-page`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
]

return [...staticPages, ...docPages, ...customPages]
```

### Priority Guidelines

- Homepage: 1.0
- Main sections: 0.8-0.9
- Content pages: 0.6-0.8
- Secondary pages: 0.4-0.5

## Robots.txt

### Configuration

The `robots.txt` file is located at `public/robots.txt`:

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
```

### Disallowing Pages

Add paths you don't want indexed:

```txt
Disallow: /admin/
Disallow: /private/
Disallow: /*.json$
```

### Robots Meta Tags

Use metadata to control indexing per page:

```typescript
export const metadata: Metadata = {
  robots: {
    index: false, // Don't index this page
    follow: true, // Follow links on this page
  },
}
```

## Structured Data

### Using JSON-LD Helpers

Import the structured data helpers:

```typescript
import {
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  structuredDataToScriptTag,
} from '@/lib/seo/structured-data'
```

### Article Structured Data

For blog posts or documentation:

```typescript
const articleData = generateArticleStructuredData(
  'Article Title',
  'Article description',
  'article-slug',
  '2025-01-01', // datePublished
  '2025-01-15'  // dateModified
)

// In your component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: structuredDataToScriptTag(articleData) }}
/>
```

### Breadcrumb Structured Data

For navigation breadcrumbs:

```typescript
const breadcrumbData = generateBreadcrumbStructuredData([
  { name: 'Home', url: 'https://yourdomain.com' },
  { name: 'Docs', url: 'https://yourdomain.com/docs' },
  { name: 'Current Page', url: 'https://yourdomain.com/docs/current' },
])
```

### FAQ Structured Data

For FAQ pages:

```typescript
const faqData = generateFAQStructuredData([
  {
    question: 'What is Next.js?',
    answer: 'Next.js is a React framework...',
  },
  {
    question: 'How do I deploy?',
    answer: 'You can deploy using...',
  },
])
```

## Open Graph & Social Media

### Default Configuration

Open Graph and Twitter Cards are configured in the root layout:

```typescript
openGraph: {
  type: 'website',
  locale: locale,
  url: baseUrl,
  siteName: 'Your Site Name',
  images: [{
    url: `${baseUrl}/og-image.png`,
    width: 1200,
    height: 630,
    alt: 'Your Site Name',
  }],
}
```

### Creating OG Images

**Recommended sizes:**

- Open Graph: 1200x630px
- Twitter Card: 1200x600px
- Logo: 512x512px

**Tools for generating OG images:**

- [og-image.vercel.app](https://og-image.vercel.app/)
- [Canva](https://www.canva.com/)
- Figma

### Page-Specific Social Cards

Override in individual pages:

```typescript
export const metadata: Metadata = {
  openGraph: {
    title: 'Specific Page Title',
    description: 'Specific page description',
    images: ['/specific-og-image.png'],
  },
}
```

## PWA Support

### Manifest Configuration

The web app manifest is at `app/manifest.ts`:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Your App Name',
    short_name: 'App',
    description: 'App description',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [...],
  }
}
```

### Required Icons

Create these icons in the `public/` directory:

- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)
- `apple-icon.png` (180x180px)
- `favicon.ico`

### Testing PWA

1. Build your app: `npm run build`
2. Start production server: `npm start`
3. Open Chrome DevTools > Lighthouse
4. Run PWA audit

## Configuration

### Next.js Config

The `next.config.ts` includes SEO optimizations:

```typescript
const nextConfig: NextConfig = {
  compress: true,              // Enable gzip compression
  generateEtags: true,         // Generate ETags for caching
  poweredByHeader: false,      // Remove X-Powered-By header
  trailingSlash: false,        // URL structure preference
  reactStrictMode: true,       // Enable strict mode
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    // ... other image settings
  },
  
  // Security and SEO headers
  async headers() {
    // ... see next.config.ts
  },
}
```

### Performance Optimizations

The configuration includes:

- **Compression**: Automatic gzip/brotli compression
- **Image Optimization**: AVIF and WebP format support
- **Caching**: Proper cache headers
- **Security Headers**: X-Frame-Options, CSP, etc.

## Best Practices

### 1. Keep Metadata Updated

Update metadata when content changes:

```typescript
export async function generateMetadata({ params }) {
  const content = await fetchContent(params.slug)
  
  return {
    title: content.title,
    description: content.excerpt,
    // Use actual last modified date
    openGraph: {
      publishedTime: content.publishedAt,
      modifiedTime: content.updatedAt,
    },
  }
}
```

### 2. Use Semantic HTML

```tsx
<main>
  <article>
    <h1>Main Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>
```

### 3. Optimize Images

Always use Next.js Image component:

```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={630}
  priority={isAboveFold}
/>
```

### 4. Internal Linking

Use Next.js Link for internal navigation:

```tsx
import Link from 'next/link'

<Link href="/docs/getting-started">
  Getting Started Guide
</Link>
```

### 5. Monitor Performance

Use these tools to monitor SEO:

- **Google Search Console**: Track search performance
- **Lighthouse**: Audit performance and SEO
- **PageSpeed Insights**: Check page speed
- **Schema Validator**: Test structured data

### 6. Mobile Optimization

- Use responsive design
- Test on real devices
- Ensure tap targets are 48x48px minimum
- Use viewport meta tag (already included)

### 7. Content Best Practices

- Write descriptive, unique titles and descriptions
- Use heading hierarchy (H1 → H2 → H3)
- Include keywords naturally
- Create valuable, original content
- Update content regularly

## Testing SEO

### Local Testing

```bash
# Build the application
npm run build

# Start production server
npm start

# Test sitemap
curl http://localhost:3000/sitemap.xml

# Test robots.txt
curl http://localhost:3000/robots.txt

# Test manifest
curl http://localhost:3000/manifest.webmanifest
```

### Online Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Schema.org Validator](https://validator.schema.org/)

## Deployment Checklist

Before deploying to production:

- [ ] Update `NEXT_PUBLIC_APP_URL` in environment variables
- [ ] Add verification tokens (Google, Bing, etc.)
- [ ] Generate and add OG images
- [ ] Create all required icons
- [ ] Test sitemap.xml
- [ ] Verify robots.txt
- [ ] Test structured data
- [ ] Run Lighthouse audit
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics (if needed)

## Additional Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Web.dev SEO Guide](https://web.dev/learn/seo/)

## Troubleshooting

### Sitemap Not Updating

The sitemap is generated at build time. Rebuild to update:

```bash
npm run build
```

### Metadata Not Showing

1. Check browser view-source
2. Verify metadata is in `<head>`
3. Test with social media debuggers
4. Clear cache and rebuild

### Structured Data Errors

Use Google's Rich Results Test to identify and fix errors in your JSON-LD.

### Images Not Loading

1. Check image paths (must be in `public/` directory)
2. Verify NEXT_PUBLIC_APP_URL is correct
3. Check Next.js Image configuration
4. Ensure images are optimized and correct sizes
