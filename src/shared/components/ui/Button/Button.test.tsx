/**
 * Button Component Tests
 *
 * Core functionality tests for Button component
 */

import { describe, it, expect, vi } from 'vitest'

import { Button } from './Button'

import { renderWithProviders } from '@/test/utils'

describe('Button Component', () => {
  describe('Core Functionality', () => {
    it('should render with children', () => {
      const { getByRole } = renderWithProviders(<Button>Click me</Button>)
      const button = getByRole('button')

      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Click me')
    })

    it('should handle click events', async () => {
      const handleClick = vi.fn()
      const { getByRole, user } = renderWithProviders(
        <Button onClick={handleClick}>Click me</Button>
      )

      await user.click(getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when disabled prop is true', () => {
      const { getByRole } = renderWithProviders(<Button disabled>Disabled</Button>)

      expect(getByRole('button')).toBeDisabled()
    })

    it('should be disabled when loading', () => {
      const { getByRole } = renderWithProviders(<Button isLoading>Loading</Button>)

      expect(getByRole('button')).toBeDisabled()
    })
  })

  describe('Variants', () => {
    it('should apply primary variant styles', () => {
      const { getByRole } = renderWithProviders(<Button variant="primary">Primary</Button>)

      expect(getByRole('button')).toHaveClass('bg-gradient-primary')
    })

    it('should apply secondary variant styles', () => {
      const { getByRole } = renderWithProviders(<Button variant="secondary">Secondary</Button>)

      expect(getByRole('button')).toHaveClass('bg-gradient-secondary')
    })

    it('should apply outline variant styles', () => {
      const { getByRole } = renderWithProviders(<Button variant="outline">Outline</Button>)

      expect(getByRole('button')).toHaveClass('border-2', 'bg-transparent')
    })

    it('should apply glass variant styles', () => {
      const { getByRole } = renderWithProviders(<Button variant="glass">Glass</Button>)

      expect(getByRole('button')).toHaveClass('glass-card')
    })
  })

  describe('Sizes', () => {
    it('should apply small size', () => {
      const { getByRole } = renderWithProviders(<Button size="sm">Small</Button>)

      expect(getByRole('button')).toHaveClass('text-sm', 'px-4', 'py-2')
    })

    it('should apply medium size (default)', () => {
      const { getByRole } = renderWithProviders(<Button size="md">Medium</Button>)

      expect(getByRole('button')).toHaveClass('px-6', 'py-3')
    })

    it('should apply large size', () => {
      const { getByRole } = renderWithProviders(<Button size="lg">Large</Button>)

      expect(getByRole('button')).toHaveClass('text-lg', 'px-8', 'py-4')
    })
  })

  describe('Accessibility', () => {
    it('should support keyboard navigation', async () => {
      const handleClick = vi.fn()
      const { getByRole, user } = renderWithProviders(
        <Button onClick={handleClick}>Press me</Button>
      )

      const button = getByRole('button')
      button.focus()

      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should accept HTML attributes', () => {
      const { getByRole } = renderWithProviders(
        <Button type="submit" aria-label="Submit form">
          Submit
        </Button>
      )

      const button = getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('aria-label', 'Submit form')
    })
  })
})
