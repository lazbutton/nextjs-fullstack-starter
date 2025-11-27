'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from './input'
import { Search, X } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

/**
 * Search input component with debounce
 * Useful for search functionality that triggers server requests
 */
interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  debounceMs?: number
  className?: string
  disabled?: boolean
}

export function SearchInput({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSearch,
  debounceMs = 300,
  className,
  disabled,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || '')
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    if (onSearch) {
      debounceTimerRef.current = setTimeout(() => {
        onSearch(value)
      }, debounceMs)
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [value, onSearch, debounceMs])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    if (!isControlled) {
      setInternalValue(newValue)
    }

    if (onChange) {
      onChange(newValue)
    }
  }

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('')
    }
    if (onChange) {
      onChange('')
    }
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="pl-9 pr-9"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

