import { readFile } from 'fs/promises'
import { join } from 'path'
import { notFound } from 'next/navigation'
import { SiteLayout } from '@/components/layout/site-layout'
import type { Metadata } from 'next'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { DocsSidebar } from '@/components/docs/docs-sidebar'
import { DocumentationContent } from '@/components/docs/documentation-content'
import { scanDocumentationFiles } from '@/lib/docs/scan'
import { StructuredData } from '@/components/seo/structured-data'
import { generateArticleStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo/structured-data'

/**
 * Generate dynamic metadata for each documentation page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const docs = await scanDocumentationFiles()
  const doc = docs.find((d) => d.slug === slug)
  
  if (!doc) {
    return {
      title: 'Documentation Not Found',
      description: 'The requested documentation page could not be found.',
    }
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  return {
    title: doc.title,
    description: doc.description,
    keywords: ['Next.js', 'Documentation', 'Guide', doc.title],
    authors: [{ name: 'Your Name', url: baseUrl }],
    openGraph: {
      title: `${doc.title} - Documentation`,
      description: doc.description,
      type: 'article',
      url: `${baseUrl}/docs/${slug}`,
      siteName: 'Next.js Template',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${doc.title} - Documentation`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${doc.title} - Documentation`,
      description: doc.description,
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/docs/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

/**
 * Generate static params for all documentation pages
 */
export async function generateStaticParams() {
  const docs = await scanDocumentationFiles()
  return docs.map((doc) => ({
    slug: doc.slug,
  }))
}

/**
 * Documentation page with sidebar navigation
 * Automatically scans for documentation files
 */
export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Automatically scan for documentation files
  const docs = await scanDocumentationFiles()
  const activeDocConfig = docs.find((d) => d.slug === slug)

  if (!activeDocConfig) {
    notFound()
  }

  // Read the active documentation file
  const docPath = join(process.cwd(), activeDocConfig.path)
  let docContent = ''

  try {
    docContent = await readFile(docPath, 'utf-8')
    // Update git clone URL if present
    docContent = docContent.replace(
      /git clone <your-repo-url>/g,
      'git clone https://github.com/lazbutton/nextjs-fullstack-starter'
    )
  } catch {
    docContent = `# ${activeDocConfig.title}\n\nUnable to load documentation file: ${activeDocConfig.path}`
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // Generate structured data for SEO
  const articleStructuredData = generateArticleStructuredData(
    activeDocConfig.title,
    activeDocConfig.description,
    slug
  )
  
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: baseUrl },
    { name: 'Documentation', url: `${baseUrl}/docs` },
    { name: activeDocConfig.title, url: `${baseUrl}/docs/${slug}` },
  ])

  return (
    <SiteLayout>
      <StructuredData data={[articleStructuredData, breadcrumbStructuredData]} />
      <div className="flex h-[calc(100vh-3.5rem)]">
        <DocsSidebar docs={docs} />
        <div className="ml-64 flex flex-1 flex-col overflow-hidden">
          <div className="fixed top-14 left-64 right-0 z-40 border-b bg-background">
            <div className="container mx-auto flex items-center justify-between px-6 py-2">
              <div>
                <h1 className="text-xl font-bold">{activeDocConfig.title}</h1>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {activeDocConfig.description}
                </p>
              </div>
              <Link
                href="https://github.com/lazbutton/nextjs-fullstack-starter"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span>View on GitHub</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <main className="flex-1 overflow-y-auto pt-[57px]">
            <div className="container mx-auto max-w-4xl px-6 py-8">
              <DocumentationContent content={docContent} />
            </div>
          </main>
        </div>
      </div>
    </SiteLayout>
  )
}

