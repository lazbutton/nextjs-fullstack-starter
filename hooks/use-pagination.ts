'use client'

import { useState, useCallback } from 'react'

/**
 * Custom hook for pagination state management
 * Provides pagination logic and state
 */
interface UsePaginationProps {
  initialPage?: number
  pageSize?: number
  totalItems?: number
}

interface UsePaginationReturn {
  currentPage: number
  pageSize: number
  totalPages: number
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  setPageSize: (size: number) => void
  setTotalItems: (total: number) => void
  getOffset: () => number
}

export function usePagination({
  initialPage = 1,
  pageSize: initialPageSize = 10,
  totalItems: initialTotalItems = 0,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSizeState] = useState(initialPageSize)
  const [totalItems, setTotalItems] = useState(initialTotalItems)

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(validPage)
    },
    [totalPages]
  )

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [currentPage, totalPages])

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }, [currentPage])

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages)
  }, [totalPages])

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size)
    setCurrentPage(1) // Reset to first page when page size changes
  }, [])

  const setTotalItemsCount = useCallback((total: number) => {
    setTotalItems(total)
    // Reset to first page if current page is beyond total pages
    setCurrentPage((prev) => Math.min(prev, Math.max(1, Math.ceil(total / pageSize))))
  }, [pageSize])

  const getOffset = useCallback(() => {
    return (currentPage - 1) * pageSize
  }, [currentPage, pageSize])

  return {
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    setPageSize,
    setTotalItems: setTotalItemsCount,
    getOffset,
  }
}

