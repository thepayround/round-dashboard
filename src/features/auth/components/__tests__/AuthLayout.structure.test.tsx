/**
 * AuthLayout Structure Tests
 *
 * Tests layout structure and CSS classes
 */

import { describe, it, expect } from 'vitest'

import { AuthLayout } from '../AuthLayout'

import { renderWithProviders } from '@/test/utils'

describe('AuthLayout - Structure', () => {
  it('should have auth container wrapper', () => {
    const { container } = renderWithProviders(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    )

    const authContainer = container.querySelector('.auth-container')
    expect(authContainer).toBeInTheDocument()
  })

  it('should have auth background wrapper', () => {
    const { container } = renderWithProviders(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    )

    const authBackground = container.querySelector('.auth-background')
    expect(authBackground).toBeInTheDocument()
  })

  it('should have logo container', () => {
    const { container } = renderWithProviders(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    )

    const logoContainer = container.querySelector('.logo-container')
    expect(logoContainer).toBeInTheDocument()
  })

  it('should apply proper CSS classes for styling', () => {
    const { container } = renderWithProviders(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    )

    const authContainer = container.querySelector('.auth-container')
    expect(authContainer).toHaveClass('auth-container')

    const authBackground = container.querySelector('.auth-background')
    expect(authBackground).toHaveClass('auth-background')
  })

  it('should have floating orbs with proper classes', () => {
    const { container } = renderWithProviders(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    )

    const floatingOrbs = container.querySelectorAll('.floating-orb')
    floatingOrbs.forEach(orb => {
      expect(orb).toHaveClass('floating-orb')
    })
  })

  it('should render floating orb elements', () => {
    const { container } = renderWithProviders(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    )

    const floatingOrbs = container.querySelectorAll('.floating-orb')
    expect(floatingOrbs.length).toBeGreaterThanOrEqual(3)
  })
})
