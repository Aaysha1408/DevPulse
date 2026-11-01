import { NextRequest, NextResponse } from 'next/server'
import { Stock, ApiResponse } from '@/lib/types'

const ALL_STOCKS: Stock[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 189.45,
    previousClose: 188.75,
    change: 0.70,
    changePercent: 0.37,
    timestamp: new Date(),
    volume: 52500000,
  },
  {
    id: '2',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 140.23,
    previousClose: 139.81,
    change: 0.42,
    changePercent: 0.30,
    timestamp: new Date(),
    volume: 18200000,
  },
  {
    id: '3',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.91,
    previousClose: 376.04,
    change: 2.87,
    changePercent: 0.76,
    timestamp: new Date(),
    volume: 21500000,
  },
  {
    id: '4',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 175.34,
    previousClose: 174.12,
    change: 1.22,
    changePercent: 0.70,
    timestamp: new Date(),
    volume: 42300000,
  },
  {
    id: '5',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 498.52,
    previousClose: 493.25,
    change: 5.27,
    changePercent: 1.07,
    timestamp: new Date(),
    volume: 35800000,
  },
]

/**
 * GET /api/stocks
 * 
 * Returns list of all available stocks
 */
export async function GET(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50))
    return NextResponse.json(
      {
        data: ALL_STOCKS,
        timestamp: Date.now(),
      } as ApiResponse<Stock[]>,
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching stocks:', error)

    return NextResponse.json(
      {
        data: null,
        error: 'Internal server error',
        timestamp: Date.now(),
      } as ApiResponse<null>,
      { status: 500 }
    )
  }
}