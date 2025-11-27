/**
 * Helper functions for generating JSON-LD structured data
 * These functions help create rich snippets for search engines
 */

import { WithContext, WebSite, Organization, Article, BreadcrumbList, FAQPage } from 'schema-dts'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/**
 * Generate WebSite structured data
 */
export function generateWebSiteStructuredData(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Next.js Template',
    description: 'A modern Next.js template with TypeScript, Supabase, and shadcn/ui',
    url: BASE_URL,
    inLanguage: ['en', 'fr'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/search?q={search_term_string}`,
    },
  }
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationStructuredData(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Next.js Template',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://github.com/lazbutton/nextjs-fullstack-starter',
      // Add your social media URLs here
    ],
  }
}

/**
 * Generate Article structured data for documentation pages
 */
export function generateArticleStructuredData(
  title: string,
  description: string,
  slug: string,
  datePublished?: string,
  dateModified?: string
): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: `${BASE_URL}/docs/${slug}`,
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Next.js Template',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Next.js Template',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/docs/${slug}`,
    },
  }
}

/**
 * Generate Breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Helper to convert structured data to script tag content
 */
export function structuredDataToScriptTag(data: WithContext<any>): string {
  return JSON.stringify(data)
}
