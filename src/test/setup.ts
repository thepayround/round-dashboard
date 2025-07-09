/**
 * Test Setup for Round Dashboard
 *
 * This file configures the testing environment with necessary polyfills,
 * mocks, and global test utilities.
 */

import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeAll, vi } from 'vitest'

// Global test setup
beforeAll(() => {
  // Mock window.matchMedia for responsive design tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock ResizeObserver for components that use it
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock IntersectionObserver for components that use it
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock console methods to reduce noise in tests
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

// Clean up after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
    h1: ({ children, ...props }: any) => React.createElement('h1', props, children),
    p: ({ children, ...props }: any) => React.createElement('p', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
    form: ({ children, ...props }: any) => React.createElement('form', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock react-router-dom with proper React components
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
    Link: ({ children, to, ...props }: any) =>
      React.createElement('a', { href: to, ...props }, children),
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null, key: 'default' }),
    useParams: () => ({}),
  }
})

// Mock Lucide React icons with proper React components
vi.mock('lucide-react', () => ({
  User: ({ ...props }: any) => React.createElement('svg', { 'data-testid': 'user-icon', ...props }),
  Mail: ({ ...props }: any) => React.createElement('svg', { 'data-testid': 'mail-icon', ...props }),
  Lock: ({ ...props }: any) => React.createElement('svg', { 'data-testid': 'lock-icon', ...props }),
  Eye: ({ ...props }: any) => React.createElement('svg', { 'data-testid': 'eye-icon', ...props }),
  EyeOff: ({ ...props }: any) =>
    React.createElement('svg', { 'data-testid': 'eye-off-icon', ...props }),
  Phone: ({ ...props }: any) =>
    React.createElement('svg', { 'data-testid': 'phone-icon', ...props }),
  ArrowRight: ({ ...props }: any) =>
    React.createElement('svg', { 'data-testid': 'arrow-right-icon', ...props }),
  Building: ({ ...props }: any) =>
    React.createElement('svg', { 'data-testid': 'building-icon', ...props }),
  Loader2: ({ ...props }: any) =>
    React.createElement('svg', { 'data-testid': 'loader-icon', ...props }),
  AlertCircle: ({ ...props }: any) =>
    React.createElement('svg', { 'data-testid': 'alert-circle-icon', ...props }),
}))

// Global test utilities - Custom matchers are provided by @testing-library/jest-dom
// which is imported above. These type declarations are not needed as the types
// are already provided by the testing library.
