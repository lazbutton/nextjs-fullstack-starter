import { readFile } from 'fs/promises'
import { join } from 'path'
import { SiteLayout } from '@/components/layout/site-layout'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'
import { Card } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Complete documentation for the Next.js Template',
}

/**
 * Documentation page displaying the README.md
 * Beautifully styled with Tailwind CSS and react-markdown
 */
export default async function DocumentationPage() {
  // Read the README file
  const readmePath = join(process.cwd(), 'README.md')
  let readmeContent = ''
  
  try {
    readmeContent = await readFile(readmePath, 'utf-8')
    // Update the git clone URL to point to the actual repository
    readmeContent = readmeContent.replace(
      /git clone <your-repo-url>/g,
      'git clone https://github.com/lazbutton/nextjs-fullstack-starter'
    )
  } catch (error) {
    readmeContent = '# Documentation\n\nUnable to load README.md'
  }

  return (
    <SiteLayout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Documentation</h1>
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
          <p className="text-muted-foreground">
            Complete guide to using and customizing this Next.js template
          </p>
        </div>

        {/* Markdown Content */}
        <Card className="p-8 md:p-12">
          <article className="markdown-content max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom components for better styling
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mb-6 mt-0 text-foreground border-b pb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold mb-4 mt-8 text-foreground border-b pb-2">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground">
                    {children}
                  </h3>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className
                  return isInline ? (
                    <code
                      className="text-sm bg-muted px-1.5 py-0.5 rounded font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="bg-muted border rounded-lg p-4 overflow-x-auto my-4">
                    {children}
                  </pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-primary hover:underline"
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-foreground">{children}</li>
                ),
                p: ({ children }) => (
                  <p className="text-foreground leading-7 my-4">{children}</p>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {readmeContent}
            </ReactMarkdown>
          </article>
        </Card>
      </div>
    </SiteLayout>
  )
}

