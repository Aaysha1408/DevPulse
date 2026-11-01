'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Stock, Alert, PortfolioHolding } from '../types'

interface StockState {
  stocks: Stock[]
  alerts: Alert[]
  favorites: string[]
  portfolio: PortfolioHolding[]
  loading: boolean
}

type StockAction =
  | { type: 'SET_STOCKS'; payload: Stock[] }
  | { type: 'UPDATE_STOCK'; payload: Stock }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'REMOVE_ALERT'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_PORTFOLIO_HOLDING'; payload: PortfolioHolding }
  | { type: 'REMOVE_PORTFOLIO_HOLDING'; payload: string } 

// Separate contexts to prevent unnecessary re-renders
const StockStateContext = createContext<StockState | undefined>(undefined)
const StockDispatchContext = createContext<React.Dispatch<StockAction> | undefined>(undefined)

const initialState: StockState = {
  stocks: [],
  alerts: [],
  favorites: [],
  portfolio: [],
  loading: false,
}

function stockReducer(state: StockState, action: StockAction): StockState {
  switch (action.type) {
    case 'SET_STOCKS':
      return { ...state, stocks: action.payload }

    case 'UPDATE_STOCK':
      return {
        ...state,
        stocks: state.stocks.map(s =>
          s.id === action.payload.id ? action.payload : s
        ),
      }

    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts],
      }

    case 'REMOVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(a => a.id !== action.payload),
      }

    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter(f => f !== action.payload)
          : [...state.favorites, action.payload],
      }

    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'ADD_PORTFOLIO_HOLDING':
      return {
        ...state,
        portfolio: [...state.portfolio, action.payload],
      }

    case 'REMOVE_PORTFOLIO_HOLDING':
      return {
        ...state,
        portfolio: state.portfolio.filter(h => h.id !== action.payload),
      }

    default:
      return state
  }
}

interface StockProviderProps {
  children: ReactNode
}

export function StockProvider({ children }: StockProviderProps) {
  const [state, dispatch] = useReducer(stockReducer, initialState)

  return (
    <StockStateContext.Provider value={state}>
      <StockDispatchContext.Provider value={dispatch}>
        {children}
      </StockDispatchContext.Provider>
    </StockStateContext.Provider>
  )
}

// Custom hooks for using context
export function useStockState() {
  const context = useContext(StockStateContext)
  if (!context) {
    throw new Error('useStockState must be used within StockProvider')
  }
  return context
}

export function useStockDispatch() {
  const context = useContext(StockDispatchContext)
  if (!context) {
    throw new Error('useStockDispatch must be used within StockProvider')
  }
  return context
}

// Convenience hook to use both
export function useStocks() {
  return useStockState()
}