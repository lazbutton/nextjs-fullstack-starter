import { redirect } from 'next/navigation'

/**
 * Root documentation page - redirects to README
 */
export default function DocumentationRootPage() {
  redirect('/docs/readme')
}
