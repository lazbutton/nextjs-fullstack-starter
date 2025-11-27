'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { DOCUMENTATION_FILES } from '@/lib/docs/config'

/**
 * Client component for documentation tabs
 * Handles tab switching and markdown rendering
 */
export function DocumentationTabs({
  docsContents,
}: {
  docsContents: Record<string, string>
}) {
  const [activeTab, setActiveTab] = useState<keyof typeof DOCUMENTATION_FILES>('readme')

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
      {/* Tabs Navigation */}
      <div className="mb-6 overflow-x-auto">
        <TabsList className="h-auto w-full justify-start p-1">
          {Object.entries(DOCUMENTATION_FILES).map(([slug, doc]) => (
            <TabsTrigger
              key={slug}
              value={slug}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <span>{doc.icon}</span>
              <span className="hidden sm:inline">{doc.title}</span>
              <span className="sm:hidden">{doc.title.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Tabs Content */}
      {Object.entries(DOCUMENTATION_FILES).map(([slug, doc]) => (
        <TabsContent key={slug} value={slug} className="mt-0">
          <Card className="p-8 md:p-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">{doc.title}</h2>
              <p className="mt-2 text-muted-foreground">{doc.description}</p>
            </div>
            <article className="markdown-content max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-6 mt-0 border-b border-border pb-3 text-3xl font-bold text-foreground">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-4 mt-10 border-b border-border pb-2 text-2xl font-bold text-foreground first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-3 mt-8 text-xl font-semibold text-foreground">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="mb-2 mt-6 text-lg font-semibold text-foreground">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="my-4 leading-7 text-foreground">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-4 list-disc space-y-2 pl-6 text-foreground">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-4 list-decimal space-y-2 pl-6 text-foreground">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground">{children}</li>
                  ),
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    const isInline = !match

                    return isInline ? (
                      <code
                        className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
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
                    <pre className="my-4 overflow-x-auto rounded-lg border bg-muted p-4">
                      {children}
                    </pre>
                  ),
                  a: ({ href, children }) => {
                    const isExternal = href?.startsWith('http')
                    return (
                      <a
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="font-medium text-primary transition-colors hover:underline"
                      >
                        {children}
                      </a>
                    )
                  },
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-4 border-l-4 border-primary bg-muted/50 py-2 pl-4 italic text-muted-foreground">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="my-8 border-border" />,
                  table: ({ children }) => (
                    <div className="my-4 overflow-x-auto">
                      <table className="w-full border-collapse border border-border">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
                  tbody: ({ children }) => <tbody>{children}</tbody>,
                  tr: ({ children }) => (
                    <tr className="border-b border-border">{children}</tr>
                  ),
                  th: ({ children }) => (
                    <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-border px-4 py-2 text-foreground">
                      {children}
                    </td>
                  ),
                }}
              >
                {docsContents[slug] || 'Loading...'}
              </ReactMarkdown>
            </article>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}

