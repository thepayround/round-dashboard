/**
 * Tests for RegisterPage component
 *
 * Tests account type selection functionality and navigation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

import { RegisterPage } from './RegisterPage'

import { renderWithProviders } from '@/test/utils'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('RegisterPage Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  describe('Rendering', () => {
    it('should render the account type selector', () => {
      const { getByRole, getByText } = renderWithProviders(<RegisterPage />)

      expect(getByRole('heading', { name: 'Choose Your Account Type' })).toBeInTheDocument()
      expect(getByText('Select the account type that best fits your needs')).toBeInTheDocument()
    })

    it('should render account type options', () => {
      const { getByText } = renderWithProviders(<RegisterPage />)

      expect(getByText('👤 Personal Account')).toBeInTheDocument()
      expect(getByText('🏢 Business Account')).toBeInTheDocument()
    })

    it('should render continue button', () => {
      const { getByRole } = renderWithProviders(<RegisterPage />)

      expect(getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })

    it('should render login link', () => {
      const { getByText, getByRole } = renderWithProviders(<RegisterPage />)

      expect(getByText(/already have an account/i)).toBeInTheDocument()
      expect(getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    })
  })

  describe('Account Type Selection', () => {
    it('should allow selecting personal account type', async () => {
      const { getByTestId, user } = renderWithProviders(<RegisterPage />)
      const personalCard = getByTestId('account-type-personal')

      await user.click(personalCard)

      // Check that personal account is selected by looking for green border
      expect(personalCard).toHaveClass('border-emerald-500')
    })

    it('should allow selecting business account type', async () => {
      const { getByTestId, user } = renderWithProviders(<RegisterPage />)
      const businessCard = getByTestId('account-type-business')

      await user.click(businessCard)

      // Check that business account is selected by looking for green border
      expect(businessCard).toHaveClass('border-emerald-500')
    })

    it('should enable continue button when account type is selected', async () => {
      const { getByTestId, getByRole, user } = renderWithProviders(<RegisterPage />)
      const continueButton = getByRole('button', { name: /continue/i })
      const personalCard = getByTestId('account-type-personal')

      // Initially button should be disabled
      expect(continueButton).toBeDisabled()

      // Select personal account
      await user.click(personalCard)

      // Button should now be enabled
      expect(continueButton).not.toBeDisabled()
    })
  })

  describe('Navigation', () => {
    it('should navigate to personal registration when personal account is selected', async () => {
      const { getByTestId, getByRole, user } = renderWithProviders(<RegisterPage />)
      const personalCard = getByTestId('account-type-personal')
      const continueButton = getByRole('button', { name: /continue/i })

      // Select personal account
      await user.click(personalCard)

      // Click continue
      await user.click(continueButton)

      // Should navigate to personal registration
      expect(mockNavigate).toHaveBeenCalledWith('/auth/register/personal')
    })

    it('should navigate to business registration when business account is selected', async () => {
      const { getByTestId, getByRole, user } = renderWithProviders(<RegisterPage />)
      const businessCard = getByTestId('account-type-business')
      const continueButton = getByRole('button', { name: /continue/i })

      // Select business account
      await user.click(businessCard)

      // Click continue
      await user.click(continueButton)

      // Should navigate to business registration
      expect(mockNavigate).toHaveBeenCalledWith('/auth/register/business')
    })

    it('should have working login link', () => {
      const { getByRole } = renderWithProviders(<RegisterPage />)
      const loginLink = getByRole('link', { name: /sign in/i })

      expect(loginLink).toHaveAttribute('href', '/auth/login')
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      const { getByRole } = renderWithProviders(<RegisterPage />)

      expect(getByRole('heading', { name: 'Choose Your Account Type' })).toBeInTheDocument()
      expect(getByRole('heading', { name: '👤 Personal Account' })).toBeInTheDocument()
      expect(getByRole('heading', { name: '🏢 Business Account' })).toBeInTheDocument()
    })

    it('should have proper button accessibility', () => {
      const { getByRole } = renderWithProviders(<RegisterPage />)
      const continueButton = getByRole('button', { name: /continue/i })

      expect(continueButton).toBeInTheDocument()
      expect(continueButton).toHaveAttribute('disabled')
    })

    it('should have proper link accessibility', () => {
      const { getByRole } = renderWithProviders(<RegisterPage />)
      const loginLink = getByRole('link', { name: /sign in/i })

      expect(loginLink).toBeInTheDocument()
      expect(loginLink).toHaveAttribute('href', '/auth/login')
    })
  })

  describe('Visual Design', () => {
    it('should have proper styling classes', () => {
      const { container } = renderWithProviders(<RegisterPage />)

      expect(container.querySelector('.max-w-4xl')).toBeInTheDocument()
      expect(container.querySelector('.text-4xl')).toBeInTheDocument()
      expect(container.querySelector('.auth-text')).toBeInTheDocument()
    })

    it('should render account type titles with emojis', () => {
      const { getByText } = renderWithProviders(<RegisterPage />)

      // Account type titles with emojis
      expect(getByText('👤 Personal Account')).toBeInTheDocument()
      expect(getByText('🏢 Business Account')).toBeInTheDocument()
    })

    it('should render arrow right icon in continue button', () => {
      const { container } = renderWithProviders(<RegisterPage />)

      expect(container.querySelector('[data-testid="arrow-right-icon"]')).toBeInTheDocument()
    })
  })

  describe('Animation and Motion', () => {
    it('should render with framer-motion animations', () => {
      const { container } = renderWithProviders(<RegisterPage />)

      // Check for motion components (they should render as div elements)
      expect(container.querySelector('div[animate]')).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('should switch selection between account types', async () => {
      const { getByTestId, user } = renderWithProviders(<RegisterPage />)
      const personalCard = getByTestId('account-type-personal')
      const businessCard = getByTestId('account-type-business')

      // Select personal account
      await user.click(personalCard)
      expect(personalCard).toHaveClass('border-emerald-500')

      // Select business account
      await user.click(businessCard)
      expect(businessCard).toHaveClass('border-emerald-500')

      // Personal account should no longer be selected
      expect(personalCard).not.toHaveClass('border-emerald-500')
    })
  })
})
