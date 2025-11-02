import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, useSearchParams } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { ConfirmationPendingPage } from '../ConfirmationPendingPage'
import { EmailConfirmationPage } from '../EmailConfirmationPage'
import { ResendConfirmationPage } from '../ResendConfirmationPage'

import { apiClient } from '@/shared/services/apiClient'

// Mock the API client
vi.mock('@/shared/services/apiClient', () => ({
  apiClient: {
    confirmEmail: vi.fn(),
    resendConfirmationEmail: vi.fn(),
  },
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams('?userId=123&token=abc123')],
    useLocation: () => ({ state: { email: 'test@example.com' } }),
  }
})

const renderWithRouter = (component: React.ReactElement) =>
  render(<BrowserRouter>{component}</BrowserRouter>)

describe('Email Confirmation Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('EmailConfirmationPage', () => {
    it('should show loading state initially', () => {
      renderWithRouter(<EmailConfirmationPage />)
      expect(screen.getByText('Confirming Your Email')).toBeInTheDocument()
      expect(
        screen.getByText('Please wait while we confirm your email address...')
      ).toBeInTheDocument()
    })

    it('should show success state when confirmation succeeds', async () => {
      const mockedApiClient = apiClient as any
      mockedApiClient.confirmEmail.mockResolvedValue({
        success: true,
        message: 'Email confirmed successfully!',
      })

      renderWithRouter(<EmailConfirmationPage />)

      await waitFor(() => {
        expect(screen.getByText('Email Confirmed!')).toBeInTheDocument()
      })

      expect(
        screen.getByText(
          "Welcome to Round! You'll be redirected to get started in a few seconds..."
        )
      ).toBeInTheDocument()
    })

    it('should show error state when confirmation fails', async () => {
      const mockedApiClient = apiClient as any
      mockedApiClient.confirmEmail.mockResolvedValue({
        success: false,
        error: 'Invalid confirmation link',
      })

      renderWithRouter(<EmailConfirmationPage />)

      await waitFor(() => {
        expect(screen.getByText('Confirmation Failed')).toBeInTheDocument()
      })

      expect(screen.getByText('Invalid confirmation link')).toBeInTheDocument()
    })

    it('should show error when userId or token is missing', async () => {
      // Mock useSearchParams to return empty params
      vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), vi.fn()])

      renderWithRouter(<EmailConfirmationPage />)

      await waitFor(() => {
        expect(screen.getByText('Confirmation Failed')).toBeInTheDocument()
      })

      expect(
        screen.getByText('Invalid confirmation link. Please check your email and try again.')
      ).toBeInTheDocument()
    })

    it('should navigate to get-started page after successful confirmation', async () => {
      const mockedApiClient = apiClient as any
      mockedApiClient.confirmEmail.mockResolvedValue({
        success: true,
        message: 'Email confirmed successfully!',
      })

      renderWithRouter(<EmailConfirmationPage />)

      await waitFor(() => {
        expect(screen.getByText('Email Confirmed!')).toBeInTheDocument()
      })

      // Wait for navigation timeout
      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith('/get-started')
        },
        { timeout: 4000 }
      )
    })
  })

  describe('ConfirmationPendingPage', () => {
    it('should display the correct email address', () => {
      renderWithRouter(<ConfirmationPendingPage />)

      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByText('Check Your Email')).toBeInTheDocument()
    })

    it('should show registration success message', () => {
      renderWithRouter(<ConfirmationPendingPage />)

      expect(screen.getByText('Registration Successful!')).toBeInTheDocument()
      expect(screen.getByText("We've sent a confirmation email to:")).toBeInTheDocument()
    })

    it('should show resend button', () => {
      renderWithRouter(<ConfirmationPendingPage />)

      expect(screen.getByText('Resend Email')).toBeInTheDocument()
    })

    it('should handle resend email successfully', async () => {
      const mockedApiClient = apiClient as any
      mockedApiClient.resendConfirmationEmail.mockResolvedValue({
        success: true,
        message: 'Confirmation email sent successfully!',
      })

      renderWithRouter(<ConfirmationPendingPage />)

      const resendButton = screen.getByText('Resend Email')
      fireEvent.click(resendButton)

      await waitFor(() => {
        expect(screen.getByText('Confirmation email sent successfully!')).toBeInTheDocument()
      })

      expect(mockedApiClient.resendConfirmationEmail).toHaveBeenCalledWith('test@example.com')
    })

    it('should handle resend email error', async () => {
      const mockedApiClient = apiClient as any
      mockedApiClient.resendConfirmationEmail.mockResolvedValue({
        success: false,
        error: 'Failed to resend email',
      })

      renderWithRouter(<ConfirmationPendingPage />)

      const resendButton = screen.getByText('Resend Email')
      fireEvent.click(resendButton)

      await waitFor(() => {
        expect(screen.getByText('Failed to resend email')).toBeInTheDocument()
      })
    })

    it('should show instructions for next steps', () => {
      renderWithRouter(<ConfirmationPendingPage />)

      expect(screen.getByText('What to do next:')).toBeInTheDocument()
      expect(
        screen.getByText('Check your email inbox (and spam folder if needed)')
      ).toBeInTheDocument()
      expect(screen.getByText('Click the "Confirm Email" button in the email')).toBeInTheDocument()
      expect(screen.getByText("You'll be redirected to complete your setup")).toBeInTheDocument()
    })
  })

  describe('ResendConfirmationPage', () => {
    it('should render form with email input', () => {
      renderWithRouter(<ResendConfirmationPage />)

      expect(screen.getByText('Resend Confirmation')).toBeInTheDocument()
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
      expect(screen.getByText('Send Confirmation Email')).toBeInTheDocument()
    })

    it('should validate email input', async () => {
      renderWithRouter(<ResendConfirmationPage />)

      const emailInput = screen.getByLabelText('Email Address')
      const submitButton = screen.getByText('Send Confirmation Email')

      // Test with invalid email
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.blur(emailInput)

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
      })

      // Submit button should be disabled
      expect(submitButton).toBeDisabled()
    })

    it('should handle successful resend', async () => {
      const mockedApiClient = apiClient as any
      mockedApiClient.resendConfirmationEmail.mockResolvedValue({
        success: true,
        message: 'Confirmation email sent successfully!',
      })

      renderWithRouter(<ResendConfirmationPage />)

      const emailInput = screen.getByLabelText('Email Address')
      const submitButton = screen.getByText('Send Confirmation Email')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Confirmation email sent successfully!')).toBeInTheDocument()
      })

      expect(mockedApiClient.resendConfirmationEmail).toHaveBeenCalledWith('test@example.com')
    })

    it('should handle resend failure', async () => {
      const mockedApiClient = apiClient as any
      mockedApiClient.resendConfirmationEmail.mockResolvedValue({
        success: false,
        error: 'Email not found',
      })

      renderWithRouter(<ResendConfirmationPage />)

      const emailInput = screen.getByLabelText('Email Address')
      const submitButton = screen.getByText('Send Confirmation Email')

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email not found')).toBeInTheDocument()
      })
    })

    it('should show back to login link', () => {
      renderWithRouter(<ResendConfirmationPage />)

      const backLink = screen.getByText('Back to Login')
      expect(backLink).toBeInTheDocument()
      expect(backLink.closest('a')).toHaveAttribute('href', '/login')
    })
  })
})
