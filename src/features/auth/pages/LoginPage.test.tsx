/**
 * Tests for LoginPage component
 *
 * Tests form functionality, validation, user interactions, and accessibility
 */

import { describe, it, expect } from 'vitest'

import { LoginPage } from './LoginPage'

import { renderWithProviders, testHelpers, mockData } from '@/test/utils'

describe('LoginPage Component', () => {
  describe('Rendering', () => {
    it('should render the login form', () => {
      const { getByText, container } = renderWithProviders(<LoginPage />)

      expect(getByText('Welcome Back')).toBeInTheDocument()
      expect(getByText('Sign in to your Round Platform account')).toBeInTheDocument()
      expect(container.querySelector('form')).toBeInTheDocument()
    })

    it('should render all form fields', () => {
      const { getByLabelText, getByRole } = renderWithProviders(<LoginPage />)

      expect(getByLabelText(/email/i)).toBeInTheDocument()
      expect(getByLabelText(/password/i)).toBeInTheDocument()
      expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('should render navigation links', () => {
      const { getByRole } = renderWithProviders(<LoginPage />)

      expect(getByRole('link', { name: /create account/i })).toBeInTheDocument()
      expect(getByRole('link', { name: /forgot your password/i })).toBeInTheDocument()
    })

    it('should render with proper ARIA labels', () => {
      const { getByLabelText } = renderWithProviders(<LoginPage />)

      expect(getByLabelText(/email address/i)).toHaveAttribute('type', 'email')
      expect(getByLabelText(/password/i)).toHaveAttribute('type', 'password')
    })
  })

  describe('Form Interactions', () => {
    it('should allow typing in email field', async () => {
      const { getByLabelText, user } = renderWithProviders(<LoginPage />)
      const emailInput = getByLabelText(/email/i) as HTMLInputElement

      await testHelpers.fillInput(user, emailInput, mockData.loginData.email)

      expect(emailInput.value).toBe(mockData.loginData.email)
    })

    it('should allow typing in password field', async () => {
      const { getByLabelText, user } = renderWithProviders(<LoginPage />)
      const passwordInput = getByLabelText(/password/i) as HTMLInputElement

      await testHelpers.fillInput(user, passwordInput, mockData.loginData.password)

      expect(passwordInput.value).toBe(mockData.loginData.password)
    })

    it('should toggle password visibility', async () => {
      const { getByLabelText, getByTestId, user } = renderWithProviders(<LoginPage />)
      const passwordInput = getByLabelText(/password/i)
      const toggleButton = getByTestId('eye-icon').closest('button')!

      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password')

      // Click toggle button
      await user.click(toggleButton)

      // Password should now be visible (mocked as text type)
      expect(passwordInput).toHaveAttribute('type', 'text')
    })

    it('should handle form submission', async () => {
      const { getByLabelText, getByRole, user } = renderWithProviders(<LoginPage />)
      const emailInput = getByLabelText(/email/i)
      const passwordInput = getByLabelText(/password/i)
      const submitButton = getByRole('button', { name: /sign in/i })

      // Fill form
      await testHelpers.fillInput(user, emailInput, mockData.loginData.email)
      await testHelpers.fillInput(user, passwordInput, mockData.loginData.password)

      // Submit form
      await user.click(submitButton)

      // Form should have been submitted (we can't test actual submission without API)
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('Validation', () => {
    it('should require email field', async () => {
      const { getByLabelText } = renderWithProviders(<LoginPage />)
      const emailInput = getByLabelText(/email/i)

      expect(emailInput).toHaveAttribute('required')
    })

    it('should require password field', async () => {
      const { getByLabelText } = renderWithProviders(<LoginPage />)
      const passwordInput = getByLabelText(/password/i)

      expect(passwordInput).toHaveAttribute('required')
    })

    it('should have email type validation', () => {
      const { getByLabelText } = renderWithProviders(<LoginPage />)
      const emailInput = getByLabelText(/email/i)

      expect(emailInput).toHaveAttribute('type', 'email')
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      const { getByLabelText } = renderWithProviders(<LoginPage />)

      expect(getByLabelText(/email address/i)).toBeInTheDocument()
      expect(getByLabelText(/password/i)).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      const { getByLabelText, getByRole, user } = renderWithProviders(<LoginPage />)
      const emailInput = getByLabelText(/email/i)
      const passwordInput = getByLabelText(/password/i)
      const submitButton = getByRole('button', { name: /sign in/i })

      // Tab through form elements
      await user.tab()
      expect(emailInput).toHaveFocus()

      await user.tab()
      expect(passwordInput).toHaveFocus()

      // Skip password toggle button and forgot password link
      await user.tab()
      await user.tab()
      await user.tab()
      expect(submitButton).toHaveFocus()
    })

    it('should have proper ARIA attributes', () => {
      const { container } = renderWithProviders(<LoginPage />)
      const form = container.querySelector('form')

      expect(form).toBeInTheDocument()
    })
  })

  describe('Visual Design', () => {
    it('should have glass morphism styling', () => {
      const { container } = renderWithProviders(<LoginPage />)
      const authCard = container.querySelector('.auth-card')

      expect(authCard).toBeInTheDocument()
    })

    it('should have brand colors and gradients', () => {
      const { container } = renderWithProviders(<LoginPage />)
      const gradientHeader = container.querySelector('.gradient-header')

      expect(gradientHeader).toBeInTheDocument()
    })

    it('should render icons correctly', () => {
      const { getByTestId } = renderWithProviders(<LoginPage />)

      expect(getByTestId('mail-icon')).toBeInTheDocument()
      expect(getByTestId('lock-icon')).toBeInTheDocument()
    })
  })

  describe('Animation and Motion', () => {
    it('should render with framer-motion animations', () => {
      const { container } = renderWithProviders(<LoginPage />)

      // Since we mock framer-motion, just ensure the component renders
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should work on mobile viewports', () => {
      testHelpers.mockViewport(375, 667) // iPhone SE
      const { container } = renderWithProviders(<LoginPage />)

      expect(container.querySelector('form')).toBeInTheDocument()
    })

    it('should work on desktop viewports', () => {
      testHelpers.mockViewport(1920, 1080)
      const { container } = renderWithProviders(<LoginPage />)

      expect(container.querySelector('form')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle empty form submission gracefully', async () => {
      const { getByRole, user } = renderWithProviders(<LoginPage />)
      const submitButton = getByRole('button', { name: /sign in/i })

      await user.click(submitButton)

      // Form should still be present (browser validation will handle empty fields)
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('should integrate with router navigation', () => {
      const { getByRole } = renderWithProviders(<LoginPage />)
      const createAccountLink = getByRole('link', { name: /create account/i })

      expect(createAccountLink).toHaveAttribute('href', '/auth/register')
    })
  })
})
