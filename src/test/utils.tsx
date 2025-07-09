/**
 * Test Utilities for Round Dashboard
 *
 * Provides reusable testing utilities, custom render functions,
 * and common test helpers.
 */

import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'queries'> {
  initialEntries?: string[]
  route?: string
}

export const renderWithProviders = (ui: React.ReactElement, options: CustomRenderOptions = {}) => {
  const { ...renderOptions } = options

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
  )

  const user = userEvent.setup()

  return {
    user,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

// Common test helpers
export const testHelpers = {
  // Helper to test form submissions
  async submitForm(user: ReturnType<typeof userEvent.setup>, form: HTMLElement) {
    await user.click(form.querySelector('button[type="submit"]')!)
  },

  // Helper to fill form fields
  async fillInput(user: ReturnType<typeof userEvent.setup>, input: HTMLElement, value: string) {
    await user.clear(input)
    await user.type(input, value)
  },

  // Helper to test responsive behavior
  mockViewport(width: number, height: number) {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    })
    window.dispatchEvent(new Event('resize'))
  },

  // Helper to test accessibility
  async testKeyboardNavigation(user: ReturnType<typeof userEvent.setup>, elements: HTMLElement[]) {
    for (const element of elements) {
      await user.tab()
      expect(element).toHaveFocus()
    }
  },
}

// Mock data factories
export const mockData = {
  // Mock user registration data
  registrationData: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 555-123-4567',
    password: 'SecurePassword123!',
  },

  // Mock login data
  loginData: {
    email: 'john.doe@example.com',
    password: 'SecurePassword123!',
  },

  // Mock API responses
  apiResponses: {
    loginSuccess: {
      success: true,
      data: {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    },
    loginError: {
      success: false,
      error: 'Invalid credentials',
    },
    registrationSuccess: {
      success: true,
      data: {
        message: 'Registration successful',
        user: {
          id: '1',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    },
  },
}

// Custom matchers
export const customMatchers = {
  // Test if element has glass morphism classes
  toHaveGlassMorphism(element: HTMLElement) {
    const hasGlassClasses =
      element.classList.contains('backdrop-blur') || element.style.backdropFilter?.includes('blur')

    return {
      pass: hasGlassClasses,
      message: () =>
        hasGlassClasses
          ? 'Element has glass morphism effect'
          : 'Element does not have glass morphism effect',
    }
  },

  // Test if element has brand colors
  toHaveBrandColors(element: HTMLElement) {
    const computedStyle = getComputedStyle(element)
    const brandColors = ['#D417C8', '#14BDEA', '#7767DA'] // Round brand colors

    const hasBrandColor = brandColors.some(
      color =>
        computedStyle.color === color ||
        computedStyle.backgroundColor === color ||
        computedStyle.borderColor === color
    )

    return {
      pass: hasBrandColor,
      message: () =>
        hasBrandColor ? 'Element uses brand colors' : 'Element does not use brand colors',
    }
  },
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
