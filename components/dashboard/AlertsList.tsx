'use client'

import React from 'react'
import { Alert } from '@/lib/types'

interface AlertsListProps {
  alerts: Alert[]
  onRemove: (id: string) => void
}

const severityConfig = {
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
}

/**
 * Alerts list component
 * Displays price alerts, volume alerts, and technical alerts
 */
export default function AlertsList({ alerts, onRemove }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
          <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
        </div>
        <div className="p-6 text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
            🔔
          </div>
          <p className="text-gray-600 font-medium">No alerts yet</p>
          <p className="text-sm text-gray-500 mt-1">Set price or volume alerts on stocks</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Alerts ({alerts.length})
        </h3>
      </div>
      <div className="p-4 space-y-3">
      {alerts.slice(0, 10).map(alert => {
        const config = severityConfig[alert.severity]
        return (
          <div
            key={alert.id}
            className={`
              p-4 rounded-lg border-2 ${config.bg} ${config.border}
              flex items-start justify-between
            `}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold ${config.text}`}>
                  {alert.symbol}
                </span>
                <span className="text-xs px-2 py-1 bg-white rounded">
                  {alert.type}
                </span>
              </div>
              <p className="text-sm text-gray-700">{alert.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(alert.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => onRemove(alert.id)}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
        )
      })}
      </div>
    </section>
  )
}