'use client'

import { ReactNode, useState, useEffect, useRef } from 'react'
import { CopyCodeButton } from './copy-code-button'

/**
 * Code block wrapper component with copy button
 * Extracts code text from pre/code elements for copying
 */
export function CodeBlockWithCopy({ 
  children 
}: { 
  children: ReactNode
}) {
  const preRef = useRef<HTMLPreElement>(null)
  const [codeText, setCodeText] = useState('')

  useEffect(() => {
    if (preRef.current) {
      // Find the code element inside pre
      const codeElement = preRef.current.querySelector('code')
      if (codeElement) {
        setCodeText(codeElement.textContent || '')
      } else {
        // Fallback: get text from pre itself
        setCodeText(preRef.current.textContent || '')
      }
    }
  }, [children])

  return (
    <div className="group relative">
      <pre 
        ref={preRef}
        className="my-4 overflow-x-auto rounded-lg border bg-muted p-4"
      >
        {children}
      </pre>
      {codeText.trim() && <CopyCodeButton code={codeText.trim()} />}
    </div>
  )
}
