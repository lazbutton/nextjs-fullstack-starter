'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for search functionality with debounce
 * Manages search state and debounces search queries
 */
interface UseSearchProps {
  initialValue?: string
  debounceMs?: number
  onSearch?: (query: string) => void
}

interface UseSearchReturn {
  query: string
  debouncedQuery: string
  setQuery: (query: string) => void
  clear: () => void
  isSearching: boolean
}

export function useSearch({
  initialValue = '',
  debounceMs = 300,
  onSearch,
}: UseSearchProps = {}): UseSearchReturn {
  const [query, setQueryState] = useState(initialValue)
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    // Use requestAnimationFrame to avoid setState in effect
    requestAnimationFrame(() => {
      setIsSearching(true)
    })

    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      setIsSearching(false)

      if (onSearch) {
        onSearch(query)
      }
    }, debounceMs)

    return () => {
      clearTimeout(timer)
      setIsSearching(false)
    }
  }, [query, debounceMs, onSearch])

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery)
  }, [])

  const clear = useCallback(() => {
    setQueryState('')
    setDebouncedQuery('')
  }, [])

  return {
    query,
    debouncedQuery,
    setQuery,
    clear,
    isSearching,
  }
}

