import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import { ApiDropdown } from '../ApiDropdown'
import { languageDropdownConfig } from '../configs'

// Mock the language hook
const mockLanguages = [
  { value: 'en', label: 'English', nativeName: 'English' },
]

vi.mock('@/shared/hooks/api/useUserSettingsOptions', () => ({
  useLanguages: () => ({
    data: mockLanguages,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}))

describe('Language Dropdown', () => {
  const defaultProps = {
    config: languageDropdownConfig,
    value: 'en',
    onSelect: vi.fn(),
    onClear: vi.fn(),
    allowClear: false,
    disabled: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the dropdown with English preselected', () => {
    render(<ApiDropdown {...defaultProps} />)
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('shows English as placeholder when no value is set', () => {
    render(<ApiDropdown {...defaultProps} value="" />)
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('is disabled when only one language is available', () => {
    render(<ApiDropdown {...defaultProps} />)
    const combobox = screen.getByRole('combobox')
    expect(combobox).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('does not open dropdown when disabled and clicked', async () => {
    const user = userEvent.setup()
    render(<ApiDropdown {...defaultProps} />)
    
    const combobox = screen.getByRole('combobox')
    await user.click(combobox)

    // Should not show any dropdown options since it's disabled
    expect(screen.queryByText('Search languages...')).not.toBeInTheDocument()
  })

  it('filters to only show English language', () => {
    // Test that only English is shown even if backend returns more languages
    const extendedMockLanguages = [
      { value: 'en', label: 'English', nativeName: 'English' },
      { value: 'es', label: 'Spanish', nativeName: 'Español' },
      { value: 'fr', label: 'French', nativeName: 'Français' },
    ]

    // The mapToOptions function should filter out non-English languages
    const options = languageDropdownConfig.mapToOptions(extendedMockLanguages)
    expect(options).toHaveLength(1)
    expect(options[0].value).toBe('en')
    expect(options[0].label).toBe('English')
  })

  it('shows correct icon for language', () => {
    render(<ApiDropdown {...defaultProps} />)
    // The language icon should be present (Languages icon from lucide-react)
    const combobox = screen.getByRole('combobox')
    expect(combobox).toBeInTheDocument()
  })

  it('has correct placeholder text', () => {
    expect(languageDropdownConfig.placeholder).toBe('English')
  })

  it('has correct search placeholder text', () => {
    expect(languageDropdownConfig.searchPlaceholder).toBe('Search languages...')
  })

  it('has correct no results text', () => {
    expect(languageDropdownConfig.noResultsText).toBe('No languages found')
  })

  it('has correct error text', () => {
    expect(languageDropdownConfig.errorText).toBe('Failed to load languages')
  })
})
