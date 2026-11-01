'use client'

import { useState, useEffect } from 'react'

/**
 * Debounce hook - delays state updates
 * 
 * Use case: User types in search box
 * - Without debounce: 5 API calls for "AAPL" (one per keystroke)
 * - With debounce (300ms): 1 API call after user stops typing
 * 
 * Usage:
 * const debouncedSearchTerm = useDebounce(searchTerm, 300)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up timeout to update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clear timeout if value changes before delay expires
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}