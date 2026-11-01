'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook for localStorage persistence
 * 
 * Features:
 * - Type-safe storage and retrieval
 * - Automatic JSON serialization
 * - Error handling for quota exceeded
 * - SSR-safe (checks for window object)
 * 
 * Usage:
 * const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [])
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return

      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    } finally {
      setIsHydrated(true)
    }
  }, [key])

  // Update localStorage when state changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error(`localStorage quota exceeded for key "${key}"`)
      } else {
        console.error(`Error writing localStorage key "${key}":`, error)
      }
    }
  }

  return [storedValue, setValue]
}