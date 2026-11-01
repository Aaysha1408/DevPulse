'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseAsyncOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
  dependencies?: unknown[]
}

/**
 * Generic hook for handling async operations
 * Reduces code duplication for multiple data fetching hooks
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { onSuccess, onError, dependencies = [] } = options
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null })

    try {
      const response = await asyncFunction()
      setState({ data: response, loading: false, error: null })
      onSuccess?.()
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, loading: false, error: err })
      onError?.(err)
    }
  }, dependencies)

  useEffect(() => {
    execute()
  }, [execute])

  return { ...state, refetch: execute }
}