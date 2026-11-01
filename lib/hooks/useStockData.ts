'use client'

import { useState, useEffect, useCallback } from 'react'
import { Stock, ApiResponse } from '../types'
// import { headers } from 'next/headers'

interface UseStockDataOptions {
    symbol: string
    refreshInterval?: number
    enabled?: boolean
}

/**
 * Custom hook for fetching real-time stock data
 * 
 * Features:
 * - Automatic polling at configurable intervals
 * - Error handling with user feedback
 * - Cleanup to prevent memory leaks
 * - Memoized fetch function to prevent unnecessary refetches
 * 
 * Usage:
 * const { stock, loading, error, refetch } = useStockData({ 
 *   symbol: 'AAPL', 
 *   refreshInterval: 5000 
 * })
 */
export function useStockData({
    symbol,
    refreshInterval = 5000,
    enabled = true,
}: UseStockDataOptions) {
    const [stock, setStock] = useState<Stock | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchStock = useCallback(async () => {
        if (!enabled) return

        try {
            setError(null)
            const response = await fetch(`/api/stocks/${symbol}`)

            if (!response.ok) {
                throw new Error(`Failed to fetch ${symbol}: ${response.statusText}`)
            }

            const data: ApiResponse<Stock> = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            setStock(data.data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setError(errorMessage)
            console.error(`Error fetching ${symbol}:`, err)
        } finally {
            setLoading(false)
        }
    }, [symbol, enabled])

    useEffect(() => {
        if (!enabled) return

        // Initial fetch
        fetchStock()

        // Set up polling interval
        const interval = setInterval(fetchStock, refreshInterval)

        // Cleanup: clear interval on unmount or dependency change
        return () => clearInterval(interval)
    }, [symbol, refreshInterval, enabled, fetchStock])

    return { stock, loading, error, refetch: fetchStock }
}