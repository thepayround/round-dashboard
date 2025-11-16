/* eslint-disable react-refresh/only-export-components */
/**
 * Test Helpers and Utilities
 *
 * Reusable test utilities for React hooks and components
 */
import { render, renderHook, type RenderHookOptions, type RenderOptions } from '@testing-library/react'
import React, { type ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { AuthProvider } from '@/shared/contexts/AuthContext'
import { ReferenceDataProvider } from '@/shared/contexts/ReferenceDataContext'
import { ToastProvider } from '@/shared/contexts/ToastContext'

/**
 * Custom wrapper that provides all necessary context providers
 */
interface AllProvidersProps {
  children: React.ReactNode
}

export const AllProviders: React.FC<AllProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ReferenceDataProvider preloadOnMount={false}>
            {children}
          </ReferenceDataProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

/**
 * Custom render function that wraps components with all providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

/**
 * Custom renderHook function that wraps hooks with all providers
 */
export function renderHookWithProviders<TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'>
) {
  return renderHook(hook, { wrapper: AllProviders, ...options })
}

/**
 * Wait for async state updates
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0))

/**
 * Mock factories for common API responses
 */
export const mockFactories = {
  /**
   * Create mock customer data
   */
  customer: (overrides = {}) => ({
    customerId: 'cust_123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    type: 'Individual',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  /**
   * Create mock team member data
   */
  teamMember: (overrides = {}) => ({
    id: 'mem_123',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'Admin',
    status: 'Active',
    invitedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  /**
   * Create mock organization data
   */
  organization: (overrides = {}) => ({
    id: 'org_123',
    companyName: 'Acme Corp',
    industry: 'Technology',
    companySize: '10-50',
    organizationType: 'Business',
    country: 'US',
    taxId: '123456789',
    registrationNumber: 'REG123',
    ...overrides,
  }),

  /**
   * Create mock country data
   */
  country: (overrides = {}) => ({
    countryName: 'United States',
    countryCodeAlpha2: 'US',
    countryCodeAlpha3: 'USA',
    currencyCodeAlpha: 'USD',
    currencyName: 'US Dollar',
    currencySymbol: '$',
    ...overrides,
  }),

  /**
   * Create mock currency data
   */
  currency: (overrides = {}) => ({
    currencyCodeAlpha: 'USD',
    currencyName: 'US Dollar',
    currencySymbol: '$',
    countries: [{ countryName: 'United States' }],
    ...overrides,
  }),

  /**
   * Create mock API response
   */
  apiResponse: <T,>(data: T, success = true) => ({
    success,
    data,
    message: success ? 'Success' : 'Error',
    ...(success ? {} : { error: 'Something went wrong' }),
  }),

  /**
   * Create mock pagination metadata
   */
  pagination: (overrides = {}) => ({
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPreviousPage: false,
    ...overrides,
  }),
}

/**
 * Mock service responses
 */
export const mockServiceResponses = {
  /**
   * Mock successful customer service response
   */
  customersSuccess: () => Promise.resolve(mockFactories.apiResponse([
    mockFactories.customer(),
    mockFactories.customer({ customerId: 'cust_456', firstName: 'Alice' }),
  ])),

  /**
   * Mock failed API response
   */
  apiFailure: (errorMessage = 'API Error') =>
    Promise.reject(new Error(errorMessage)),

  /**
   * Mock empty list response
   */
  emptyList: () => Promise.resolve(mockFactories.apiResponse([])),
}

/**
 * Delay helper for testing loading states
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Create a mock function with specific return value
 */
export function createMockFn<TArgs extends unknown[] = unknown[], TResult = unknown>(
  implementation?: (...args: TArgs) => TResult
) {
  return implementation ? vi.fn<TArgs, TResult>(implementation) : vi.fn<TArgs, TResult>()
}

/**
 * Helper to suppress console errors in tests
 */
export const suppressConsoleError = () => {
  const originalError = console.error
  const beforeEach = (fn: () => void) => fn()
  const afterEach = (fn: () => void) => fn()

  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = originalError
  })
}

/**
 * Helper to check if an element is visible
 */
export const isVisible = (element: HTMLElement | null): boolean => {
  if (!element) return false
  return element.offsetWidth > 0 && element.offsetHeight > 0
}

/**
 * Mock navigation
 */
export const mockNavigate = vi.fn()

/**
 * Mock toast functions
 */
export const mockToast = {
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
  showWarning: vi.fn(),
}

/**
 * Reset all mocks
 */
export const resetAllMocks = () => {
  vi.clearAllMocks()
  mockNavigate.mockClear()
  Object.values(mockToast).forEach((fn) => fn.mockClear())
}

/**
 * Create a wrapper with specific context values
 */
export function createWrapper() {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )

  Wrapper.displayName = 'TestWrapper'

  return Wrapper
}

// Type exports for convenience
export type { RenderResult } from '@testing-library/react'
export type { RenderHookResult } from '@testing-library/react'
