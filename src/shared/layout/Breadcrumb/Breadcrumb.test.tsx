import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'

import type { BreadcrumbItem } from './Breadcrumb'
import { Breadcrumb } from './Breadcrumb'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    nav: (props: any) => React.createElement('nav', props),
    div: (props: any) => React.createElement('div', props),
  },
  AnimatePresence: (props: any) => props.children,
}))

const renderWithRouter = (component: React.ReactElement, initialPath = '/') =>
  render(<MemoryRouter initialEntries={[initialPath]}>{component}</MemoryRouter>)

describe('Breadcrumb', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithRouter(<Breadcrumb />)
    })

    it('does not render when only one item (dashboard)', () => {
      const { container } = renderWithRouter(<Breadcrumb />, '/dashboard')
      expect(container.firstChild).toBeNull()
    })

    it('renders breadcrumb items when multiple items present', () => {
      renderWithRouter(<Breadcrumb />, '/dashboard/billing')

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Billing')).toBeInTheDocument()
    })

    it('renders custom breadcrumb items', () => {
      const customItems: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Product Details', isActive: true },
      ]

      renderWithRouter(<Breadcrumb items={customItems} />)

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('Product Details')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('renders clickable links for non-active items', () => {
      renderWithRouter(<Breadcrumb />, '/dashboard/billing/invoices')

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      const billingLink = screen.getByRole('link', { name: /billing/i })

      expect(dashboardLink).toHaveAttribute('href', '/dashboard')
      expect(billingLink).toHaveAttribute('href', '/dashboard/billing')
    })

    it('does not render link for active item', () => {
      renderWithRouter(<Breadcrumb />, '/dashboard/billing')

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      const billingText = screen.getByText('Billing')

      expect(dashboardLink).toBeInTheDocument()
      expect(billingText.closest('a')).toBeNull()
    })
  })

  describe('Path Generation', () => {
    it('generates correct breadcrumbs for nested routes', () => {
      renderWithRouter(<Breadcrumb />, '/dashboard/billing/invoices')

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Billing')).toBeInTheDocument()
      expect(screen.getByText('Invoices')).toBeInTheDocument()
    })

    it('handles revenue-analytics route correctly', () => {
      renderWithRouter(<Breadcrumb />, '/dashboard/revenue-analytics')

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Revenue Analytics')).toBeInTheDocument()
    })

    it('handles ai-assistant route correctly', () => {
      renderWithRouter(<Breadcrumb />, '/dashboard/ai-assistant')

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('AI Assistant')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper navigation landmark', () => {
      renderWithRouter(<Breadcrumb />, '/dashboard/billing')

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('has proper link roles', () => {
      renderWithRouter(<Breadcrumb />, '/dashboard/billing/invoices')

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(2) // Dashboard and Billing are clickable
    })
  })

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = renderWithRouter(
        <Breadcrumb className="custom-breadcrumb" />,
        '/dashboard/billing'
      )

      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('custom-breadcrumb')
    })
  })
})
