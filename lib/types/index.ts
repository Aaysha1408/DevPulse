/**
 * Core TypeScript interfaces for type safety
 * Benefits: Compile-time error checking, IDE autocomplete, documentation
 */

export interface Stock {
    id: string
    symbol: string
    name: string
    price: number
    previousClose: number
    change: number
    changePercent: number
    timestamp: Date
    volume: number
    marketCap?: number
    pe?: number
    high52Week?: number
    low52Week?: number
  }
  
  export interface Alert {
    id: string
    symbol: string
    type: 'price' | 'volume' | 'technical'
    message: string
    severity: 'info' | 'warning' | 'critical'
    createdAt: Date
    read: boolean
  }
  
  export interface PortfolioHolding {
    id: string
    symbol: string
    quantity: number
    purchasePrice: number
    currentPrice: number
    purchaseDate: Date
  }
  
  export interface StockChartData {
    timestamp: number
    price: number
    volume: number
  }
  
  export interface ApiResponse<T> {
    data: T
    error?: string
    timestamp: number
  }
  
  export interface StockContextType {
    stocks: Stock[]
    alerts: Alert[]
    favorites: string[]
    loading: boolean
    portfolio: PortfolioHolding[]
  }
  
  export interface AlertContextType {
    alerts: Alert[]
    addAlert: (alert: Alert) => void
    removeAlert: (id: string) => void
    markAsRead: (id: string) => void
    unreadCount: number
  }