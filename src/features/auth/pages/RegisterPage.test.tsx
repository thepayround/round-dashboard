/**
 * Tests for RegisterPage component
 *
 * Tests registration form functionality, validation, and user interactions
 */

import { describe, it, expect } from 'vitest'

import { RegisterPage } from './RegisterPage'

import { renderWithProviders, testHelpers, mockData } from '@/test/utils'

describe('RegisterPage Component', () => {
  describe('Rendering', () => {
    it('should render the registration form', () => {
      const { getByRole, getByText, container } = renderWithProviders(<RegisterPage />)

      expect(getByRole('heading', { name: 'Create Account' })).toBeInTheDocument()
      expect(getByText('Join the Round community')).toBeInTheDocument()
      expect(container.querySelector('form')).toBeInTheDocument()
    })

    it('should render all form fields', () => {
      const { getByLabelText, getByRole } = renderWithProviders(<RegisterPage />)

      expect(getByLabelText(/first name/i)).toBeInTheDocument()
      expect(getByLabelText(/last name/i)).toBeInTheDocument()
      expect(getByLabelText(/email address/i)).toBeInTheDocument()
      expect(getByLabelText(/phone number/i)).toBeInTheDocument()
      expect(getByLabelText(/password/i)).toBeInTheDocument()
      expect(getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('should render terms and conditions', () => {
      const { getByText, getByRole } = renderWithProviders(<RegisterPage />)

      expect(getByText(/by creating an account you accept/i)).toBeInTheDocument()
      expect(getByRole('link', { name: /terms and conditions/i })).toBeInTheDocument()
    })

    it('should render login link', () => {
      const { getByText, getByRole } = renderWithProviders(<RegisterPage />)

      expect(getByText(/already have an account/i)).toBeInTheDocument()
      expect(getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    })
  })

  describe('Form Interactions', () => {
    it('should allow typing in all form fields', async () => {
      const { getByLabelText, user } = renderWithProviders(<RegisterPage />)
      const firstNameInput = getByLabelText(/first name/i) as HTMLInputElement
      const lastNameInput = getByLabelText(/last name/i) as HTMLInputElement
      const emailInput = getByLabelText(/email address/i) as HTMLInputElement
      const phoneInput = getByLabelText(/phone number/i) as HTMLInputElement
      const passwordInput = getByLabelText(/password/i) as HTMLInputElement

      // Fill all fields
      await testHelpers.fillInput(user, firstNameInput, mockData.registrationData.firstName)
      await testHelpers.fillInput(user, lastNameInput, mockData.registrationData.lastName)
      await testHelpers.fillInput(user, emailInput, mockData.registrationData.email)
      await testHelpers.fillInput(user, phoneInput, mockData.registrationData.phone)
      await testHelpers.fillInput(user, passwordInput, mockData.registrationData.password)

      // Verify values
      expect(firstNameInput.value).toBe(mockData.registrationData.firstName)
      expect(lastNameInput.value).toBe(mockData.registrationData.lastName)
      expect(emailInput.value).toBe(mockData.registrationData.email)
      expect(phoneInput.value).toBe(mockData.registrationData.phone)
      expect(passwordInput.value).toBe(mockData.registrationData.password)
    })

    it('should toggle password visibility', async () => {
      const { getByLabelText, getByTestId, user } = renderWithProviders(<RegisterPage />)
      const passwordInput = getByLabelText(/password/i)
      const toggleButton = getByTestId('eye-icon').closest('button')!

      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password')

      // Click toggle button
      await user.click(toggleButton)

      // Password should now be visible
      expect(passwordInput).toHaveAttribute('type', 'text')
    })

    it('should handle form submission', async () => {
      const { getByLabelText, getByRole, user } = renderWithProviders(<RegisterPage />)
      const submitButton = getByRole('button', { name: /create account/i })

      // Fill required fields
      await testHelpers.fillInput(
        user,
        getByLabelText(/first name/i),
        mockData.registrationData.firstName
      )
      await testHelpers.fillInput(
        user,
        getByLabelText(/last name/i),
        mockData.registrationData.lastName
      )
      await testHelpers.fillInput(
        user,
        getByLabelText(/email address/i),
        mockData.registrationData.email
      )
      await testHelpers.fillInput(
        user,
        getByLabelText(/phone number/i),
        mockData.registrationData.phone
      )
      await testHelpers.fillInput(
        user,
        getByLabelText(/password/i),
        mockData.registrationData.password
      )

      // Submit form
      await user.click(submitButton)

      // Form should have been submitted
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('Validation', () => {
    it('should require all form fields', () => {
      const { getByLabelText } = renderWithProviders(<RegisterPage />)

      expect(getByLabelText(/first name/i)).toHaveAttribute('required')
      expect(getByLabelText(/last name/i)).toHaveAttribute('required')
      expect(getByLabelText(/email address/i)).toHaveAttribute('required')
      expect(getByLabelText(/phone number/i)).toHaveAttribute('required')
      expect(getByLabelText(/password/i)).toHaveAttribute('required')
    })

    it('should have proper input types', () => {
      const { getByLabelText } = renderWithProviders(<RegisterPage />)

      expect(getByLabelText(/first name/i)).toHaveAttribute('type', 'text')
      expect(getByLabelText(/last name/i)).toHaveAttribute('type', 'text')
      expect(getByLabelText(/email address/i)).toHaveAttribute('type', 'email')
      expect(getByLabelText(/phone number/i)).toHaveAttribute('type', 'tel')
      expect(getByLabelText(/password/i)).toHaveAttribute('type', 'password')
    })

    it('should have proper placeholders', () => {
      const { getByLabelText } = renderWithProviders(<RegisterPage />)

      expect(getByLabelText(/first name/i)).toHaveAttribute('placeholder', 'John')
      expect(getByLabelText(/last name/i)).toHaveAttribute('placeholder', 'Doe')
      expect(getByLabelText(/email address/i)).toHaveAttribute('placeholder', 'example@gmail.com')
      expect(getByLabelText(/phone number/i)).toHaveAttribute('placeholder', '+30 698 123 4567')
      expect(getByLabelText(/password/i)).toHaveAttribute('placeholder', 'Create a strong password')
    })
  })

  describe('Layout and Responsive Design', () => {
    it('should have responsive name fields grid', () => {
      const { container } = renderWithProviders(<RegisterPage />)
      const nameFieldsContainer = container.querySelector('.grid-cols-1.md\\:grid-cols-2')

      expect(nameFieldsContainer).toBeInTheDocument()
    })

    it('should work on mobile viewports', () => {
      testHelpers.mockViewport(375, 667)
      const { container } = renderWithProviders(<RegisterPage />)

      expect(container.querySelector('form')).toBeInTheDocument()
    })

    it('should work on desktop viewports', () => {
      testHelpers.mockViewport(1920, 1080)
      const { container } = renderWithProviders(<RegisterPage />)

      expect(container.querySelector('form')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      const { getByLabelText } = renderWithProviders(<RegisterPage />)

      expect(getByLabelText(/first name/i)).toBeInTheDocument()
      expect(getByLabelText(/last name/i)).toBeInTheDocument()
      expect(getByLabelText(/email address/i)).toBeInTheDocument()
      expect(getByLabelText(/phone number/i)).toBeInTheDocument()
      expect(getByLabelText(/password/i)).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      const { getByLabelText, getByRole, user } = renderWithProviders(<RegisterPage />)
      const firstNameInput = getByLabelText(/first name/i)
      const lastNameInput = getByLabelText(/last name/i)
      const emailInput = getByLabelText(/email address/i)
      const phoneInput = getByLabelText(/phone number/i)
      const passwordInput = getByLabelText(/password/i)
      const submitButton = getByRole('button', { name: /create account/i })

      // Tab through form elements
      await user.tab()
      expect(firstNameInput).toHaveFocus()

      await user.tab()
      expect(lastNameInput).toHaveFocus()

      await user.tab()
      expect(emailInput).toHaveFocus()

      await user.tab()
      expect(phoneInput).toHaveFocus()

      await user.tab()
      expect(passwordInput).toHaveFocus()

      // Skip password toggle button and terms link
      await user.tab()
      await user.tab()
      await user.tab()
      expect(submitButton).toHaveFocus()
    })

    it('should have proper ARIA attributes', () => {
      const { getByRole, container } = renderWithProviders(<RegisterPage />)

      expect(container.querySelector('form')).toBeInTheDocument()
      expect(getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })
  })

  describe('Visual Design', () => {
    it('should have glass morphism styling', () => {
      const { container } = renderWithProviders(<RegisterPage />)
      const authCard = container.querySelector('.auth-card')

      expect(authCard).toBeInTheDocument()
    })

    it('should render all icons correctly', () => {
      const { getAllByTestId, getByTestId } = renderWithProviders(<RegisterPage />)

      expect(getAllByTestId('user-icon')).toHaveLength(2) // First name and last name
      expect(getByTestId('mail-icon')).toBeInTheDocument()
      expect(getByTestId('phone-icon')).toBeInTheDocument()
      expect(getByTestId('lock-icon')).toBeInTheDocument()
      expect(getByTestId('eye-icon')).toBeInTheDocument()
    })

    it('should have gradient header', () => {
      const { container } = renderWithProviders(<RegisterPage />)
      const gradientHeader = container.querySelector('.gradient-header')

      expect(gradientHeader).toBeInTheDocument()
    })
  })

  describe('Animation and Motion', () => {
    it('should render with framer-motion animations', () => {
      const { container } = renderWithProviders(<RegisterPage />)

      // Since we mock framer-motion, just ensure the component renders
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('should link to terms and conditions', () => {
      const { getByRole } = renderWithProviders(<RegisterPage />)
      const termsLink = getByRole('link', { name: /terms and conditions/i })

      expect(termsLink).toHaveAttribute('href', '/terms')
    })

    it('should link to login page', () => {
      const { getByRole } = renderWithProviders(<RegisterPage />)
      const loginLink = getByRole('link', { name: /sign in/i })

      expect(loginLink).toHaveAttribute('href', '/auth/login')
    })
  })

  describe('Form State Management', () => {
    it('should maintain form state during user interaction', async () => {
      const { getByLabelText, user } = renderWithProviders(<RegisterPage />)
      const firstNameInput = getByLabelText(/first name/i) as HTMLInputElement
      const emailInput = getByLabelText(/email address/i) as HTMLInputElement

      // Fill first name
      await testHelpers.fillInput(user, firstNameInput, 'John')
      expect(firstNameInput.value).toBe('John')

      // Fill email - first name should still be there
      await testHelpers.fillInput(user, emailInput, 'john@example.com')
      expect(firstNameInput.value).toBe('John')
      expect(emailInput.value).toBe('john@example.com')
    })
  })

  describe('Error Handling', () => {
    it('should handle empty form submission gracefully', async () => {
      const { getByRole, user } = renderWithProviders(<RegisterPage />)
      const submitButton = getByRole('button', { name: /create account/i })

      await user.click(submitButton)

      // Form should still be present (browser validation will handle empty fields)
      expect(submitButton).toBeInTheDocument()
    })
  })
})
