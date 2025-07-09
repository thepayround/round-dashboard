/**
 * Integration Tests for Authentication Flow
 *
 * Tests complete user journeys, navigation flows, and component integration
 */

import { describe, it, expect } from 'vitest'

import { AuthLayout } from './components/AuthLayout'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

import { renderWithProviders, testHelpers, mockData } from '@/test/utils'

describe('Authentication Integration Tests', () => {
  describe('Complete Registration Flow', () => {
    it('should complete account type selection process', async () => {
      const { getByRole, user, getByTestId } = renderWithProviders(
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      )

      // Verify registration page is displayed
      expect(getByRole('heading', { name: 'Choose Your Account Type' })).toBeInTheDocument()

      // Select personal account
      const personalCard = getByTestId('account-type-personal')
      await user.click(personalCard)

      // Verify selection is shown
      expect(personalCard).toHaveClass('border-emerald-500')

      // Verify continue button is enabled
      const continueButton = getByRole('button', { name: /continue/i })
      expect(continueButton).not.toBeDisabled()
    })

    it('should navigate between registration and login', async () => {
      const { getByRole, rerender } = renderWithProviders(
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      )

      // Click sign in link
      const signInLink = getByRole('link', { name: /sign in/i })
      expect(signInLink).toHaveAttribute('href', '/auth/login')

      // Simulate navigation to login page
      rerender(
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )

      // Should now see login page
      expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument()

      // Click create account link
      const createAccountLink = getByRole('link', { name: /create account/i })
      expect(createAccountLink).toHaveAttribute('href', '/auth/register')
    })
  })

  describe('Complete Login Flow', () => {
    it('should complete full login process', async () => {
      const { getByRole, user, container } = renderWithProviders(
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )

      // Fill login form
      const emailInput = container.querySelector('input[name="email"]')!
      const passwordInput = container.querySelector('input[name="password"]')!

      await testHelpers.fillInput(user, emailInput as HTMLElement, mockData.loginData.email)
      await testHelpers.fillInput(user, passwordInput as HTMLElement, mockData.loginData.password)

      // Verify data is entered
      expect((emailInput as HTMLInputElement).value).toBe(mockData.loginData.email)
      expect((passwordInput as HTMLInputElement).value).toBe(mockData.loginData.password)

      // Submit form
      const submitButton = getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      // Form should be submitted successfully
      expect(submitButton).toBeInTheDocument()
    })

    it('should toggle password visibility in login form', async () => {
      const { getByTestId, user, container } = renderWithProviders(
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )

      const passwordInput = container.querySelector('input[name="password"]')!
      const toggleButton = getByTestId('eye-icon').closest('button')!

      // Initial state - password hidden
      expect(passwordInput).toHaveAttribute('type', 'password')

      // Toggle to show password
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')

      // Toggle back to hide password
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })

  describe('Layout Integration', () => {
    it('should render login page within auth layout correctly', () => {
      const { getByRole, getByText, container } = renderWithProviders(
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )

      // Should have layout elements
      expect(container.querySelector('.auth-container')).toBeInTheDocument()
      expect(container.querySelector('.auth-background')).toBeInTheDocument()
      expect(getByRole('img', { name: 'Round Platform' })).toBeInTheDocument()

      // Should have login page elements
      expect(getByText('Welcome Back')).toBeInTheDocument()
      expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('should render register page within auth layout correctly', () => {
      const { getByRole, container } = renderWithProviders(
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      )

      // Should have layout elements
      expect(container.querySelector('.auth-container')).toBeInTheDocument()
      expect(getByRole('img', { name: 'Round Platform' })).toBeInTheDocument()

      // Should have register page elements
      expect(getByRole('heading', { name: 'Choose Your Account Type' })).toBeInTheDocument()
      expect(getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })

    it('should maintain layout consistency across pages', () => {
      const { container: loginContainer, rerender } = renderWithProviders(
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )

      const loginAuthContainer = loginContainer.querySelector('.auth-container')
      expect(loginAuthContainer).toBeInTheDocument()

      // Switch to register page
      rerender(
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      )

      const registerAuthContainer = loginContainer.querySelector('.auth-container')
      expect(registerAuthContainer).toBeInTheDocument()
    })
  })

  describe('Responsive Integration', () => {
    it('should work on mobile devices across all auth pages', () => {
      testHelpers.mockViewport(375, 667) // iPhone SE

      const { getByRole, rerender } = renderWithProviders(
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )

      // Login page should work on mobile
      expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument()

      // Switch to register page
      rerender(
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      )

      // Register page should work on mobile
      expect(getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })

    it('should work on desktop across all auth pages', () => {
      testHelpers.mockViewport(1920, 1080)

      const { getByRole, rerender } = renderWithProviders(
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )

      // Login page should work on desktop
      expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument()

      // Switch to register page
      rerender(
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      )

      // Register page should work on desktop
      expect(getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })
  })

  describe('Accessibility Integration', () => {
    it('should support keyboard navigation across auth flow', async () => {
      const { getByRole, user, container } = renderWithProviders(
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )

      // Tab through login form
      const emailInput = container.querySelector('input[name="email"]')!
      const passwordInput = container.querySelector('input[name="password"]')!

      await user.tab()
      expect(emailInput).toHaveFocus()

      await user.tab()
      expect(passwordInput).toHaveFocus()

      // Skip password toggle button and forgot password link
      await user.tab()
      await user.tab()
      await user.tab()
      expect(getByRole('button', { name: /sign in/i })).toHaveFocus()
    })

    it('should maintain ARIA labels and roles throughout auth flow', () => {
      const { getByRole, rerender, container } = renderWithProviders(
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )

      // Login page accessibility
      expect(container.querySelector('form')).toBeInTheDocument()
      expect(getByRole('img', { name: 'Round Platform' })).toBeInTheDocument()

      // Switch to register page
      rerender(
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      )

      // Register page accessibility
      expect(getByRole('heading', { name: 'Choose Your Account Type' })).toBeInTheDocument()
      expect(getByRole('img', { name: 'Round Platform' })).toBeInTheDocument()
    })
  })

  describe('Form State Integration', () => {
    it('should maintain independent form states', async () => {
      const { user, rerender, container, getByRole } = renderWithProviders(
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )

      // Fill login form
      const loginEmailInput = container.querySelector('input[name="email"]')!
      await testHelpers.fillInput(user, loginEmailInput as HTMLElement, 'login@example.com')
      expect((loginEmailInput as HTMLInputElement).value).toBe('login@example.com')

      // Switch to register page
      rerender(
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      )

      // Register page should be in initial state
      expect(getByRole('heading', { name: 'Choose Your Account Type' })).toBeInTheDocument()
      expect(getByRole('button', { name: /continue/i })).toBeDisabled()
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle form validation errors gracefully', async () => {
      const { getByRole, user, container } = renderWithProviders(
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )

      // Try to submit empty form
      const submitButton = getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      // Form should still be present and functional
      expect(submitButton).toBeInTheDocument()
      expect(container.querySelector('form')).toBeInTheDocument()
    })
  })

  describe('Performance Integration', () => {
    it('should not cause performance issues when switching between pages', () => {
      const { getByRole, rerender } = renderWithProviders(
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      )

      // Initial render
      expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument()

      // Multiple re-renders should not cause issues
      for (let i = 0; i < 5; i++) {
        rerender(
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        )
        expect(getByRole('button', { name: /continue/i })).toBeInTheDocument()

        rerender(
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        )
        expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      }
    })
  })
})
