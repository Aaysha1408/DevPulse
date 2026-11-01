'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Stock } from '@/lib/types'

// Dynamically import Recharts to reduce bundle size
// Component only loads when needed
const ResponsiveContainer = dynamic(
  () => import('recharts').then(m => m.ResponsiveContainer),
  { loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" /> }
)

const LineChart = dynamic(
  () => import('recharts').then(m => m.LineChart),
  { loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" /> }
)

const Line = dynamic(
  () => import('recharts').then(m => m.Line),
  { loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" /> }
)

const XAxis = dynamic(
  () => import('recharts').then(m => m.XAxis),
  { loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" /> }
)

const YAxis = dynamic(
  () => import('recharts').then(m => m.YAxis),
  { loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" /> }
)

const Tooltip = dynamic(
  () => import('recharts').then(m => m.Tooltip),
  { loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" /> }
)

interface StockChartProps {
  stock: Stock
  historicalData?: Stock[]
}

/**
 * Lazy-loaded chart component
 * 
 * Why lazy-loaded?
 * - Charts are heavy (Recharts library)
 * - Only load when user selects a stock
 * - Reduces initial page bundle by ~50KB
 */
export default function StockChart({ stock, historicalData = [] }: StockChartProps) {
  const data = [
    ...(historicalData || []),
    {
      ...stock,
      timestamp: new Date(),
    },
  ].map((item, index) => ({
    time: index,
    price: item.price,
    symbol: stock.symbol,
  }))

  if (data.length === 0) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No chart data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Price Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
          {/* <Tooltip formatter={(value: ValueType) => `$${(value as number | undefined)?.toFixed(2)}`} /> */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}