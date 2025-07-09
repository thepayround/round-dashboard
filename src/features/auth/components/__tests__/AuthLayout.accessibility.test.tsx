/**
 * AuthLayout Accessibility Tests
 *
 * Tests accessibility features and keyboard navigation
 */

import { describe, it, expect } from 'vitest'

import { AuthLayout } from '../AuthLayout'

import { renderWithProviders } from '@/test/utils'

describe('AuthLayout - Accessibility', () => {
  it('should have proper logo alt text', () => {
    const { getByRole } = renderWithProviders(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    )

    const logo = getByRole('img')
    expect(logo).toHaveAttribute('alt', 'Round Platform')
  })

  it('should not interfere with content accessibility', () => {
    const { getByRole } = renderWithProviders(
      <AuthLayout>
        <button>Test Button</button>
      </AuthLayout>
    )

    const button = getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toBeVisible()
  })

  it('should allow keyboard navigation to content', async () => {
    const { getByRole, user } = renderWithProviders(
      <AuthLayout>
        <button>Focusable Button</button>
      </AuthLayout>
    )

    const button = getByRole('button')
    await user.tab()
    expect(button).toHaveFocus()
  })

  it('should not interfere with content layering', () => {
    const { getByRole } = renderWithProviders(
      <AuthLayout>
        <button>Clickable Button</button>
      </AuthLayout>
    )

    const button = getByRole('button')
    expect(button).toBeVisible()
  })
})
