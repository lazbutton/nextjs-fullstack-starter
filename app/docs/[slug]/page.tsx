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

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Complete documentation for the Next.js Template',
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
  } catch (error) {
    docContent = `# ${activeDocConfig.title}\n\nUnable to load documentation file: ${activeDocConfig.path}`
  }

  return (
    <SiteLayout>
      <div className="flex min-h-screen">
        <DocsSidebar docs={docs} />
        <div className="flex flex-1 flex-col">
          <div className="border-b bg-background">
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-2xl font-bold">{activeDocConfig.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
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
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto max-w-4xl px-6 py-8">
              <DocumentationContent content={docContent} />
            </div>
          </main>
        </div>
      </div>
    </SiteLayout>
  )
}

