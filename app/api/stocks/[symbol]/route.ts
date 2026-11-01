import { NextRequest, NextResponse } from 'next/server'
import { Stock, ApiResponse } from '@/lib/types'

// Mock database - in production, use real database
const STOCKS_DB: Record<string, Stock> = {
  AAPL: {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 189.45 + Math.random() * 2,
    previousClose: 188.75,
    change: 0.70,
    changePercent: 0.37,
    timestamp: new Date(),
    volume: 52500000,
    marketCap: 2950000000000,
    pe: 28.5,
    high52Week: 199.62,
    low52Week: 124.17,
  },
  GOOGL: {
    id: '2',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 140.23 + Math.random() * 1.5,
    previousClose: 139.81,
    change: 0.42,
    changePercent: 0.30,
    timestamp: new Date(),
    volume: 18200000,
  },
  MSFT: {
    id: '3',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.91 + Math.random() * 2.5,
    previousClose: 376.04,
    change: 2.87,
    changePercent: 0.76,
    timestamp: new Date(),
    volume: 21500000,
  },
  AMZN: {
    id: '4',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 175.34 + Math.random() * 1.8,
    previousClose: 174.12,
    change: 1.22,
    changePercent: 0.70,
    timestamp: new Date(),
    volume: 42300000,
  },
  NVDA: {
    id: '5',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 498.52 + Math.random() * 3.5,
    previousClose: 493.25,
    change: 5.27,
    changePercent: 1.07,
    timestamp: new Date(),
    volume: 35800000,
  },
}

/**
 * GET /api/stocks/[symbol]
 * 
 * Returns real-time (simulated) stock data for a specific symbol
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params
  const upperSymbol = symbol.toUpperCase()

  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))

    if (!STOCKS_DB[upperSymbol]) {
      return NextResponse.json(
        {
          data: null,
          error: `Stock symbol ${symbol} not found`,
          timestamp: Date.now(),
        } as ApiResponse<null>,
        { status: 404 }
      )
    }

    const stock = STOCKS_DB[upperSymbol]

    return NextResponse.json(
      {
        data: stock,
        timestamp: Date.now(),
      } as ApiResponse<Stock>,
      { status: 200 }
    )
  } catch (error) {
    console.error(`Error fetching stock ${symbol}:`, error)

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