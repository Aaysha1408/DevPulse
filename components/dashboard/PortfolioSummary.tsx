'use client'

import React, { useMemo } from 'react'
import { Stock, PortfolioHolding } from '@/lib/types'

interface PortfolioSummaryProps {
  holdings: PortfolioHolding[]
  stocks: Stock[]
}

/**
 * Portfolio summary component with profit/loss calculation
 * Uses useMemo to avoid recalculating totals on every render
 */
export default function PortfolioSummary({
  holdings,
  stocks,
}: PortfolioSummaryProps) {
  const summary = useMemo(() => {
    let totalInvestment = 0
    let totalCurrentValue = 0

    holdings.forEach(holding => {
      const stock = stocks.find(s => s.symbol === holding.symbol)
      const investmentValue = holding.purchasePrice * holding.quantity
      const currentValue = (stock?.price || holding.currentPrice) * holding.quantity

      totalInvestment += investmentValue
      totalCurrentValue += currentValue
    })

    const totalProfitLoss = totalCurrentValue - totalInvestment
    const profitLossPercent =
      totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0
    const isProfit = totalProfitLoss >= 0

    return {
      totalInvestment,
      totalCurrentValue,
      totalProfitLoss,
      profitLossPercent,
      isProfit,
    }
  }, [holdings, stocks])

  if (holdings.length === 0) {
    return (
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Holdings</h3>
        </div>
        <div className="p-6 text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
            💼
          </div>
          <p className="text-gray-600 font-medium">No portfolio holdings yet</p>
          <p className="text-sm text-gray-500 mt-1">Add stocks to track your portfolio</p>
        </div>
      </section>
    )
  }

  const profitColor = summary.isProfit ? 'text-green-600' : 'text-red-600'

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
        <h3 className="text-lg font-semibold text-gray-900">Portfolio Summary</h3>
      </div>
      <div className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Total Investment</p>
          <p className="text-2xl font-bold text-gray-900">
            ${summary.totalInvestment.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Current Value</p>
          <p className="text-2xl font-bold text-gray-900">
            ${summary.totalCurrentValue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Profit/Loss</p>
            <div className="text-right">
              <p className={`text-xl font-bold ${profitColor}`}>
                {summary.isProfit ? '+' : ''}{summary.totalProfitLoss.toFixed(2)}
              </p>
              <p className={`text-sm ${profitColor}`}>
                {summary.isProfit ? '+' : ''}{summary.profitLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}