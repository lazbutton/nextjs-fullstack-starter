/**
 * React component for adding JSON-LD structured data to pages
 * Makes it easy to add rich snippets without manually creating script tags
 */

import { WithContext } from 'schema-dts'

// Using any here is necessary for schema-dts type compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StructuredDataValue = WithContext<any> | WithContext<any>[]

interface StructuredDataProps {
  data: StructuredDataValue
}

/**
 * Component to inject JSON-LD structured data into page head
 * 
 * @example
 * ```tsx
 * import { StructuredData } from '@/components/seo/structured-data'
 * import { generateArticleStructuredData } from '@/lib/seo/structured-data'
 * 
 * export default function ArticlePage() {
 *   const structuredData = generateArticleStructuredData(
 *     'Article Title',
 *     'Article description',
 *     'article-slug'
 *   )
 *   
 *   return (
 *     <>
 *       <StructuredData data={structuredData} />
 *       <article>
 *         ...
 *       </article>
 *     </>
 *   )
 * }
 * ```
 */
export function StructuredData({ data }: StructuredDataProps) {
  // Handle array of structured data objects
  const dataArray = Array.isArray(data) ? data : [data]
  
  return (
    <>
      {dataArray.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item, null, 0),
          }}
        />
      ))}
    </>
  )
}

/**
 * Hook to generate structured data for the current page
 * Useful for pages that need dynamic structured data
 * 
 * @example
 * ```tsx
 * import { useStructuredData } from '@/components/seo/structured-data'
 * import { generateArticleStructuredData } from '@/lib/seo/structured-data'
 * 
 * export default function ArticlePage({ article }) {
 *   const structuredData = useStructuredData(() => 
 *     generateArticleStructuredData(
 *       article.title,
 *       article.description,
 *       article.slug
 *     )
 *   )
 *   
 *   return (
 *     <>
 *       {structuredData}
 *       <article>
 *         ...
 *       </article>
 *     </>
 *   )
 * }
 * ```
 */
export function useStructuredData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateData: () => WithContext<any> | WithContext<any>[]
) {
  const data = generateData()
  return <StructuredData data={data} />
}
