'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useStocks, useStockDispatch } from '@/lib/context/StockContext'
import { useLocalStorage, useDebounce } from '@/lib/hooks'
import { ApiResponse } from '@/lib/types'
import StockCard from '@/components/dashboard/StockCard'
import StockChart from '@/components/dashboard/StockChart'
import AlertsList from '@/components/dashboard/AlertsList'
import PortfolioSummary from '@/components/dashboard/PortfolioSummary'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import type { Stock } from '@/lib/types'

/**
 * Main dashboard page
 * 
 * Demonstrates:
 * - Context API usage (global state)
 * - Custom hooks (data fetching, localStorage, debounce)
 * - Component composition & lazy loading
 * - Responsive design with Tailwind
 * - Error boundaries
 */
export default function DashboardPage() {
  const { stocks, alerts, portfolio, loading } = useStocks()
  const dispatch = useStockDispatch()

  // Local state for search
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const [savedFavorites, setSavedFavorites] = useLocalStorage<string[]>(
    'favorites',
    []
  )

  // Load stock list from API on mount
  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'SET_LOADING', payload: true })
    fetch('/api/stocks')
      .then((res) => res.json())
      .then((json: ApiResponse<Stock[]>) => {
        if (cancelled) return
        if (json.error) {
          console.error('Failed to load stocks:', json.error)
          return
        }
        const list = json.data ?? []
        // Normalize timestamps (API returns ISO strings after JSON serialization)
        const stocks: Stock[] = list.map((s) => ({
          ...s,
          timestamp: s.timestamp instanceof Date ? s.timestamp : new Date(String(s.timestamp)),
        }))
        dispatch({ type: 'SET_STOCKS', payload: stocks })
      })
      .catch((err) => {
        if (!cancelled) console.error('Error fetching stocks:', err)
      })
      .finally(() => {
        if (!cancelled) dispatch({ type: 'SET_LOADING', payload: false })
      })
    return () => {
      cancelled = true
    }
  }, [dispatch])

  // Debounce search to reduce re-renders and API calls
  const debouncedSearch = useDebounce(searchTerm, 300)

  // Filter stocks based on search
  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    stock.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  // Get selected stock details
  const selectedStock = stocks.find(s => s.symbol === selectedSymbol)

  // Handle favorite toggle
  const handleToggleFavorite = (symbol: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: symbol })
    setSavedFavorites(prev =>
      prev.includes(symbol)
        ? prev.filter(f => f !== symbol)
        : [...prev, symbol]
    )
  }

  // Handle alert removal
  const handleRemoveAlert = (id: string) => {
    dispatch({ type: 'REMOVE_ALERT', payload: id })
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white/50 backdrop-blur-sm shadow-sm border-b border-cyan-200 sticky top-0 z-10 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-center items-center">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  📈 Market Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Real-time stock tracking with alerts
                </p>
              </div>
              <div className="w-full sm:w-80 lg:w-96">
                <input
                  type="text"
                  placeholder="Search (e.g. AAPL, Microsoft, NVDA)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Stock List (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {filteredStocks.length} Stock
                    {filteredStocks.length !== 1 ? 's' : ''}
                  </h2>
                </div>

                {loading ? (
                  <LoadingSpinner />
                ) : filteredStocks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                    {filteredStocks.map(stock => (
                      <StockCard
                        key={stock.id}
                        stock={stock}
                        isFavorite={savedFavorites.includes(stock.symbol)}
                        onSelect={setSelectedSymbol}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg text-gray-500">
                    <p className="text-lg">No stocks found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details & Alerts (1/3 width) - sticky sidebar */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Stock Chart & Details */}
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedStock ? `${selectedStock.symbol} Details` : 'Stock Details'}
                  </h2>
                </div>
                <div className="p-4">
                  {selectedStock ? (
                    <div className="space-y-4">
                      <Suspense fallback={<LoadingSpinner />}>
                        <StockChart stock={selectedStock} />
                      </Suspense>
                      <button
                        onClick={() => handleToggleFavorite(selectedStock.symbol)}
                        className={`
                          w-full py-3 px-4 rounded-lg font-semibold text-base
                          transition-all duration-200
                          ${
                            savedFavorites.includes(selectedStock.symbol)
                              ? 'bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                          }
                        `}
                      >
                        {savedFavorites.includes(selectedStock.symbol)
                          ? '⭐ Remove from Favorites'
                          : '☆ Add to Favorites'}
                      </button>
                    </div>
                  ) : (
                    <div className="py-10 px-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                        📊
                      </div>
                      <p className="text-gray-600 font-medium">Select a stock to view details</p>
                      <p className="text-sm text-gray-500 mt-1">Click any card on the left</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Portfolio Summary */}
              <PortfolioSummary holdings={portfolio} stocks={stocks} />

              {/* Alerts Section */}
              <AlertsList alerts={alerts} onRemove={handleRemoveAlert} />
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}