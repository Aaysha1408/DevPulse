import { render, screen, fireEvent } from '@testing-library/react'
import StockCard from '@/components/dashboard/StockCard'
import { Stock } from '@/lib/types'

const mockStock: Stock = {
  id: '1',
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 150.25,
  previousClose: 149.5,
  change: 0.75,
  changePercent: 0.5,
  timestamp: new Date(),
  volume: 50000000,
}

describe('StockCard', () => {
  test('renders stock information', () => {
    render(
      <StockCard
        stock={mockStock}
        isFavorite={false}
        onSelect={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    )

    expect(screen.getByText('AAPL')).toBeInTheDocument()
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument()
    expect(screen.getByText(/150.25/)).toBeInTheDocument()
  })

  test('calls onSelect when card is clicked', () => {
    const handleSelect = jest.fn()
    render(
      <StockCard
        stock={mockStock}
        isFavorite={false}
        onSelect={handleSelect}
        onToggleFavorite={jest.fn()}
      />
    )

    fireEvent.click(screen.getByText('AAPL'))
    expect(handleSelect).toHaveBeenCalledWith('AAPL')
  })

  test('shows favorite star when favorited', () => {
    const { rerender } = render(
      <StockCard
        stock={mockStock}
        isFavorite={false}
        onSelect={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    )

    expect(screen.getByText('☆')).toBeInTheDocument()

    rerender(
      <StockCard
        stock={mockStock}
        isFavorite={true}
        onSelect={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    )

    expect(screen.getByText('⭐')).toBeInTheDocument()
  })

  test('displays positive and negative changes correctly', () => {
    const negativeStock = { ...mockStock, change: -1, changePercent: -0.67 }

    const { container: positiveContainer } = render(
      <StockCard
        stock={mockStock}
        isFavorite={false}
        onSelect={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    )

    expect(positiveContainer.querySelector('.text-green-600')).toBeInTheDocument()

    const { container: negativeContainer } = render(
      <StockCard
        stock={negativeStock}
        isFavorite={false}
        onSelect={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    )

    expect(negativeContainer.querySelector('.text-red-600')).toBeInTheDocument()
  })
})