/**
 * Site footer component
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row md:py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Next.js Template. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="/docs"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Documentation
          </a>
        </div>
      </div>
    </footer>
  )
}

