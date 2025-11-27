import { readdir, stat, readFile } from 'fs/promises'
import { join } from 'path'

/**
 * Documentation file metadata
 */
export interface DocFile {
  slug: string
  path: string
  title: string
  description: string
  icon: string
}

/**
 * Scans the docs directory and root for markdown files
 * Automatically generates documentation list
 */
export async function scanDocumentationFiles(): Promise<DocFile[]> {
  const docs: DocFile[] = []
  const rootDir = process.cwd()

  try {
    // Scan docs directory
    const docsDir = join(rootDir, 'docs')
    const docsFiles = await readdir(docsDir)
    
    for (const file of docsFiles) {
      if (file.endsWith('.md') && file !== 'README.md') {
        const filePath = join(docsDir, file)
        const stats = await stat(filePath)
        
        if (stats.isFile()) {
          const slug = file.replace(/\.md$/, '').toLowerCase().replace(/_/g, '-')
          const title = file
            .replace(/\.md$/, '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase())
          
          // Try to read first line for description
          let description = `${title} documentation`
          try {
            const content = await readFile(filePath, 'utf-8')
            const firstLine = content.split('\n')[0]?.trim()
            if (firstLine && firstLine.startsWith('#')) {
              description = firstLine.replace(/^#+\s*/, '').trim()
            }
          } catch {
            // Use default description if read fails
          }
          
          docs.push({
            slug,
            path: `docs/${file}`,
            title,
            description,
            icon: getIconForDoc(title),
          })
        }
      }
    }

    // Scan root directory for specific markdown files
    const rootFiles = await readdir(rootDir)
    const allowedRootFiles = ['README.md', 'PROJECT_PREFERENCES.md', 'ENV.md']
    
    for (const file of rootFiles) {
      if (allowedRootFiles.includes(file) && file.endsWith('.md')) {
        const filePath = join(rootDir, file)
        const stats = await stat(filePath)
        
        if (stats.isFile()) {
          const slug = file === 'README.md' 
            ? 'readme'
            : file.replace(/\.md$/, '').toLowerCase().replace(/_/g, '-')
          
          const title = file === 'README.md'
            ? 'README'
            : file.replace(/\.md$/, '').replace(/_/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ')
          
          // Try to read first line for description
          let description = getDescriptionForRootDoc(file)
          try {
            const content = await readFile(filePath, 'utf-8')
            const firstLine = content.split('\n')[0]?.trim()
            if (firstLine && firstLine.startsWith('#')) {
              const extracted = firstLine.replace(/^#+\s*/, '').trim()
              if (extracted) {
                description = extracted
              }
            }
          } catch {
            // Use default description if read fails
          }
          
          docs.push({
            slug,
            path: file,
            title,
            description,
            icon: getIconForDoc(title),
          })
        }
      }
    }
  } catch (error) {
    console.error('Error scanning documentation files:', error)
    // Return default docs if scan fails
    return getDefaultDocs()
  }

  // Sort: README first, then alphabetically
  return docs.sort((a, b) => {
    if (a.slug === 'readme') return -1
    if (b.slug === 'readme') return 1
    return a.title.localeCompare(b.title)
  })
}

/**
 * Get icon for documentation based on title
 */
function getIconForDoc(title: string): string {
  const lowerTitle = title.toLowerCase()
  
  if (lowerTitle.includes('readme')) return '📖'
  if (lowerTitle.includes('auth')) return '🔐'
  if (lowerTitle.includes('database') && lowerTitle.includes('performance')) return '⚡'
  if (lowerTitle.includes('database')) return '🗄️'
  if (lowerTitle.includes('email')) return '📧'
  if (lowerTitle.includes('project') || lowerTitle.includes('preference')) return '⚙️'
  if (lowerTitle.includes('env') || lowerTitle.includes('environment')) return '🔧'
  if (lowerTitle.includes('fix')) return '🔧'
  
  return '📄'
}

/**
 * Get description for root documentation files
 */
function getDescriptionForRootDoc(file: string): string {
  if (file === 'README.md') {
    return 'Project overview and getting started guide'
  }
  if (file === 'PROJECT_PREFERENCES.md') {
    return 'Coding conventions and best practices'
  }
  if (file === 'ENV.md') {
    return 'Environment variables configuration'
  }
  return 'Documentation'
}

/**
 * Default docs fallback if scanning fails
 */
function getDefaultDocs(): DocFile[] {
  return [
    {
      slug: 'readme',
      path: 'README.md',
      title: 'README',
      description: 'Project overview and getting started guide',
      icon: '📖',
    },
  ]
}

