import { renderHook, waitFor } from '@testing-library/react'
import { useStockData } from '@/lib/hooks/useStockData'

const mockFetch = jest.fn()
globalThis.fetch = mockFetch as typeof fetch

describe('useStockData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('fetches stock data successfully', async () => {
    const mockStock = {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple',
      price: 150,
      previousClose: 149,
      change: 1,
      changePercent: 0.67,
      timestamp: new Date(),
      volume: 1000000,
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockStock }),
    })

    const { result } = renderHook(() =>
      useStockData({ symbol: 'AAPL', refreshInterval: 10000, enabled: true })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.stock).toEqual(mockStock)
    expect(result.current.error).toBeNull()
  })

  test('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() =>
      useStockData({ symbol: 'INVALID', refreshInterval: 10000 })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.stock).toBeNull()
    expect(result.current.error).toContain('Network error')
  })
})