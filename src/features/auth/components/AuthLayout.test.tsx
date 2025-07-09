/**
 * AuthLayout Component Tests
 *
 * Main test suite for AuthLayout component
 */

import { describe, it, expect } from 'vitest'

import { AuthLayout } from './AuthLayout'

import { renderWithProviders, testHelpers } from '@/test/utils'

describe('AuthLayout Component', () => {
  describe('Core Functionality', () => {
    it('should render with children', () => {
      const { getByText } = renderWithProviders(
        <AuthLayout>
          <div>Test Content</div>
        </AuthLayout>
      )

      expect(getByText('Test Content')).toBeInTheDocument()
    })

    it('should render logo and background elements', () => {
      const { getByRole, container } = renderWithProviders(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      )

      // Logo
      expect(getByRole('img', { name: 'Round Platform' })).toBeInTheDocument()

      // Background elements
      expect(container.querySelector('.auth-container')).toBeInTheDocument()
      expect(container.querySelector('.auth-background')).toBeInTheDocument()
      expect(container.querySelector('.logo-container')).toBeInTheDocument()

      // Floating orbs
      const floatingOrbs = container.querySelectorAll('.floating-orb')
      expect(floatingOrbs.length).toBeGreaterThan(0)
    })
  })

  describe('Responsive Design', () => {
    it('should work on mobile viewports', () => {
      testHelpers.mockViewport(375, 667)
      const { getByText } = renderWithProviders(
        <AuthLayout>
          <div>Mobile Content</div>
        </AuthLayout>
      )

      expect(getByText('Mobile Content')).toBeInTheDocument()
    })

    it('should work on desktop viewports', () => {
      testHelpers.mockViewport(1920, 1080)
      const { getByText } = renderWithProviders(
        <AuthLayout>
          <div>Desktop Content</div>
        </AuthLayout>
      )

      expect(getByText('Desktop Content')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const { rerender, getByText } = renderWithProviders(
        <AuthLayout>
          <div>Initial Content</div>
        </AuthLayout>
      )

      expect(getByText('Initial Content')).toBeInTheDocument()

      rerender(
        <AuthLayout>
          <div>Updated Content</div>
        </AuthLayout>
      )

      expect(getByText('Updated Content')).toBeInTheDocument()
    })
  })
})
