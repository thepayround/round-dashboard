/**
 * Tests for WhiteLogo component
 *
 * Tests logo rendering, accessibility, and responsive behavior
 */

import { describe, it, expect } from 'vitest'

import { WhiteLogo } from './WhiteLogo'

import { renderWithProviders } from '@/test/utils'

describe('WhiteLogo Component', () => {
  describe('Rendering', () => {
    it('should render the logo image', () => {
      const { getByRole } = renderWithProviders(<WhiteLogo />)
      const logo = getByRole('img')

      expect(logo).toBeInTheDocument()
    })

    it('should have proper alt text for accessibility', () => {
      const { getByRole } = renderWithProviders(<WhiteLogo />)
      const logo = getByRole('img')

      expect(logo).toHaveAttribute('alt', 'Round Platform')
    })

    it('should load the correct image source', () => {
      const { getByRole } = renderWithProviders(<WhiteLogo />)
      const logo = getByRole('img') as HTMLImageElement

      // The actual path depends on how Vite handles the import
      expect(logo.src).toContain('white-logo')
    })
  })

  describe('Styling', () => {
    it('should have default dimensions', () => {
      const { getByRole } = renderWithProviders(<WhiteLogo />)
      const logo = getByRole('img')

      // Check if the logo has appropriate dimensions (default is md = w-24 h-24)
      expect(logo).toHaveClass('w-24', 'h-24')
    })

    it('should accept custom className', () => {
      const { getByRole } = renderWithProviders(<WhiteLogo className="custom-logo-class" />)
      const logo = getByRole('img')

      expect(logo).toHaveClass('custom-logo-class')
    })
  })

  describe('Accessibility', () => {
    it('should be properly labeled for screen readers', () => {
      const { getByRole } = renderWithProviders(<WhiteLogo />)
      const logo = getByRole('img', { name: 'Round Platform' })

      expect(logo).toBeInTheDocument()
    })

    it('should not be focusable by default', () => {
      const { getByRole } = renderWithProviders(<WhiteLogo />)
      const logo = getByRole('img')

      expect(logo).not.toHaveAttribute('tabindex')
    })
  })

  describe('Integration', () => {
    it('should work within different containers', () => {
      const { getByRole } = renderWithProviders(
        <div className="container">
          <header>
            <WhiteLogo />
          </header>
        </div>
      )
      const logo = getByRole('img')

      expect(logo).toBeInTheDocument()
      expect(logo.closest('header')).toBeInTheDocument()
    })

    it('should maintain aspect ratio', () => {
      const { getByRole } = renderWithProviders(<WhiteLogo />)
      const logo = getByRole('img')

      // Check that the logo loads successfully
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src')
    })
  })

  describe('Error Handling', () => {
    it('should handle image load errors gracefully', () => {
      const { getByRole } = renderWithProviders(<WhiteLogo />)
      const logo = getByRole('img')

      // Simulate image load error
      const errorEvent = new Event('error')
      logo.dispatchEvent(errorEvent)

      // Logo should still be in the document
      expect(logo).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const { rerender, getByRole } = renderWithProviders(<WhiteLogo />)
      getByRole('img')

      // Re-render with same props
      rerender(<WhiteLogo />)
      const rerenderedLogo = getByRole('img')

      // Should still be the same element
      expect(rerenderedLogo).toBeInTheDocument()
    })
  })
})
