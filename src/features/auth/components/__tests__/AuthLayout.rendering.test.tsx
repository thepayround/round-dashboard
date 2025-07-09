/**
 * AuthLayout Rendering Tests
 *
 * Tests basic rendering functionality
 */

import { describe, it, expect } from 'vitest'

import { AuthLayout } from '../AuthLayout'

import { renderWithProviders } from '@/test/utils'

describe('AuthLayout - Rendering', () => {
  it('should render children content', () => {
    const { getByText } = renderWithProviders(
      <AuthLayout>
        <div>Test Content</div>
      </AuthLayout>
    )

    expect(getByText('Test Content')).toBeInTheDocument()
  })

  it('should render the logo', () => {
    const { getByRole } = renderWithProviders(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    )

    expect(getByRole('img', { name: 'Round Platform' })).toBeInTheDocument()
  })

  it('should render floating orb background elements', () => {
    const { container } = renderWithProviders(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    )

    const floatingOrbs = container.querySelectorAll('.floating-orb')
    expect(floatingOrbs.length).toBeGreaterThan(0)
  })

  it('should render multiple children', () => {
    const { getByText } = renderWithProviders(
      <AuthLayout>
        <div>First Child</div>
        <div>Second Child</div>
        <button>Third Child</button>
      </AuthLayout>
    )

    expect(getByText('First Child')).toBeInTheDocument()
    expect(getByText('Second Child')).toBeInTheDocument()
    expect(getByText('Third Child')).toBeInTheDocument()
  })

  it('should render complex child components', () => {
    const ComplexChild = () => (
      <div>
        <h1>Complex Component</h1>
        <form>
          <input type="text" placeholder="Test input" />
          <button type="submit">Submit</button>
        </form>
      </div>
    )

    const { getByText, getByRole } = renderWithProviders(
      <AuthLayout>
        <ComplexChild />
      </AuthLayout>
    )

    expect(getByText('Complex Component')).toBeInTheDocument()
    expect(getByRole('textbox')).toBeInTheDocument()
    expect(getByRole('button')).toBeInTheDocument()
  })

  it('should handle empty children gracefully', () => {
    const { container } = renderWithProviders(<AuthLayout>{null}</AuthLayout>)

    expect(container.querySelector('.auth-container')).toBeInTheDocument()
  })
})
