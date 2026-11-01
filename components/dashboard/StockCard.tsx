'use client'

import React, { memo } from 'react'
import { Stock } from '@/lib/types'

interface StockCardProps {
  stock: Stock
  isFavorite: boolean
  onSelect: (symbol: string) => void
  onToggleFavorite: (symbol: string) => void
}

/**
 * Memoized stock card component
 * 
 * Why memoized?
 * - This component renders in a list of many stocks
 * - Parent re-renders frequently (due to polling)
 * - React.memo prevents unnecessary re-renders if props haven't changed
 * - Performance improvement: Reduces re-renders from O(n) to O(1)
 */
const StockCard = memo(function StockCard({
  stock,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: StockCardProps) {
  const isPositive = stock.change >= 0
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600'
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50'

  return (
    <div
      onClick={() => onSelect(stock.symbol)}
      className={`
        h-full min-h-[180px] flex flex-col p-4 rounded-xl border-2 border-gray-200 
        ${bgColor} cursor-pointer 
        hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10
        transition-all duration-200
      `}
    >
      <div className="flex items-start justify-between mb-3 flex-shrink-0">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">{stock.symbol}</h3>
          <p className="text-sm text-gray-600 truncate">{stock.name}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(stock.symbol)
          }}
          className="flex-shrink-0 text-2xl cursor-pointer hover:scale-110 transition-transform p-1"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      <div className="space-y-2 mt-auto flex-shrink-0">
        <div className="flex justify-between items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 tabular-nums">
            ${stock.price.toFixed(2)}
          </span>
          <span className={`text-base font-semibold tabular-nums whitespace-nowrap ${changeColor}`}>
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </span>
        </div>

        <div className="text-xs text-gray-600 space-y-0.5">
          <p>Previous Close: ${stock.previousClose.toFixed(2)}</p>
          <p>Volume: {(stock.volume / 1000000).toFixed(1)}M</p>
        </div>
      </div>
    </div>
  )
})

export default StockCard