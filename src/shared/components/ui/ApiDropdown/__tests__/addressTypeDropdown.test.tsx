/* eslint-disable react/jsx-props-no-spreading */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ApiDropdown } from '../ApiDropdown'
import { addressTypeDropdownConfig } from '../configs'

// Mock the address type hook
const mockAddressTypes = [
  { code: 'billing', name: 'Billing Address', description: 'Address for billing purposes', isActive: true },
  { code: 'shipping', name: 'Shipping Address', description: 'Address for shipping', isActive: true },
  { code: 'business', name: 'Business Address', description: 'Main business address', isActive: true },
  { code: 'inactive', name: 'Inactive Address', description: 'Inactive address type', isActive: false },
]

vi.mock('@/shared/hooks/api/useAddressType', () => ({
  useAddressTypes: () => ({
    data: mockAddressTypes,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}))

describe('Address Type Dropdown', () => {
  const defaultProps = {
    config: addressTypeDropdownConfig,
    value: '',
    onSelect: vi.fn(),
    onClear: vi.fn(),
    allowClear: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the dropdown with placeholder', () => {
    render(<ApiDropdown {...defaultProps} />)
    expect(screen.getByText('Select address type')).toBeInTheDocument()
  })

  it('opens dropdown and shows address type options when clicked', async () => {
    const user = userEvent.setup()
    render(<ApiDropdown {...defaultProps} />)
    
    const combobox = screen.getByRole('combobox')
    await user.click(combobox)

    await waitFor(() => {
      expect(screen.getByText('Billing Address')).toBeInTheDocument()
      expect(screen.getByText('Shipping Address')).toBeInTheDocument()
      expect(screen.getByText('Business Address')).toBeInTheDocument()
    })
  })

  it('filters out inactive address types', async () => {
    const user = userEvent.setup()
    render(<ApiDropdown {...defaultProps} />)
    
    const combobox = screen.getByRole('combobox')
    await user.click(combobox)

    await waitFor(() => {
      expect(screen.getByText('Billing Address')).toBeInTheDocument()
      expect(screen.queryByText('Inactive Address')).not.toBeInTheDocument()
    })
  })

  it('calls onSelect when an option is clicked', async () => {
    const mockOnSelect = vi.fn()
    const user = userEvent.setup()
    
    render(<ApiDropdown {...defaultProps} onSelect={mockOnSelect} />)
    
    const combobox = screen.getByRole('combobox')
    await user.click(combobox)

    await waitFor(() => {
      expect(screen.getByText('Billing Address')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Billing Address'))
    expect(mockOnSelect).toHaveBeenCalledWith('billing')
  })

  it('shows selected value', () => {
    render(<ApiDropdown {...defaultProps} value="billing" />)
    expect(screen.getByText('Billing Address')).toBeInTheDocument()
  })

  it('shows clear button when value is selected and allowClear is true', () => {
    render(<ApiDropdown {...defaultProps} value="billing" allowClear />)
    expect(screen.getByLabelText('Clear selection')).toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', async () => {
    const mockOnClear = vi.fn()
    const user = userEvent.setup()
    
    render(<ApiDropdown {...defaultProps} value="billing" onClear={mockOnClear} allowClear />)
    
    const clearButton = screen.getByLabelText('Clear selection')
    await user.click(clearButton)
    
    expect(mockOnClear).toHaveBeenCalled()
  })

  it('shows error state when error prop is true', () => {
    render(<ApiDropdown {...defaultProps} error />)
    const combobox = screen.getByRole('combobox')
    expect(combobox).toHaveClass('border-[#ef4444]')
  })
})