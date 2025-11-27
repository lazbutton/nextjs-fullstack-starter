import { readFile } from 'fs/promises'
import { join } from 'path'
import { SiteLayout } from '@/components/layout/site-layout'
import type { Metadata } from 'next'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { DocumentationTabs } from '@/components/docs/documentation-tabs'
import { DOCUMENTATION_FILES } from '@/lib/docs/config'

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Complete documentation for the Next.js Template',
}


/**
 * Documentation page with tabs navigation
 */
export default async function DocumentationPage() {
  // Read all documentation files
  const docsContents: Record<string, string> = {}

  for (const [slug, config] of Object.entries(DOCUMENTATION_FILES)) {
    const docPath = join(process.cwd(), config.path)
    try {
      let content = await readFile(docPath, 'utf-8')
      // Update git clone URL if present
      content = content.replace(
        /git clone <your-repo-url>/g,
        'git clone https://github.com/lazbutton/nextjs-fullstack-starter'
      )
      docsContents[slug] = content
    } catch (error) {
      docsContents[slug] = `# ${config.title}\n\nUnable to load documentation file: ${config.path}`
    }
  }

  return (
    <SiteLayout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Documentation</h1>
              <p className="mt-2 text-muted-foreground">
                Complete guide to using and customizing this Next.js template
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

        {/* Tabs Navigation */}
        <DocumentationTabs docsContents={docsContents} />
      </div>
    </SiteLayout>
  )
}
