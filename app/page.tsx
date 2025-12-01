import { getLocale } from '@/lib/i18n/cookies'
import { getTranslationsForCurrentLocale } from '@/lib/i18n'
import { SiteLayout } from '@/components/layout/site-layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'A modern Next.js template with TypeScript, Neon, Stack Auth, and shadcn/ui components. Build full-stack applications quickly.',
  keywords: [
    'Next.js template',
    'React starter',
    'TypeScript boilerplate',
    'Stack Auth authentication',
    'Neon database',
    'Full-stack template',
    'shadcn/ui',
    'Modern web development',
  ],
  openGraph: {
    title: 'Next.js Template - Modern Full-stack Starter',
    description: 'A modern Next.js template with TypeScript, Neon, Stack Auth, and shadcn/ui components.',
    type: 'website',
  },
}

export default async function Home() {
  const locale = await getLocale()
  const t = await getTranslationsForCurrentLocale()

  return (
    <SiteLayout>
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-background p-8">
        <div className="w-full max-w-3xl space-y-8">
          <div className="flex items-center justify-center">
            <h1 className="text-4xl font-bold">{t.common.welcome}</h1>
          </div>
          
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <h2 className="text-2xl font-semibold">Next.js Template</h2>
            <p className="text-muted-foreground">
              This template includes:
            </p>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Next.js 16 with App Router</li>
              <li>TypeScript with strict mode</li>
              <li>Neon (PostgreSQL database)</li>
              <li>Stack Auth (Authentication)</li>
              <li>shadcn/ui components</li>
              <li>Resend for email</li>
              <li>Server Actions</li>
              <li>Middleware for route protection</li>
              <li>Translation support (en, fr)</li>
            </ul>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
            <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
              <li>Copy <code className="bg-muted px-2 py-1 rounded">.env.example</code> to <code className="bg-muted px-2 py-1 rounded">.env.local</code></li>
              <li>Fill in your environment variables</li>
              <li>Run <code className="bg-muted px-2 py-1 rounded">npm run dev</code></li>
              <li>Start building your application!</li>
            </ol>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
