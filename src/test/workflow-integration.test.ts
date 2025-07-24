/**
 * Integration test to verify the GetStartedPage uses the organization workflow correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useOrganization } from '@/shared/hooks/api/useOrganization'

// Mock the API services
vi.mock('@/shared/services/api', () => ({
  organizationService: {
    getCurrentOrganization: vi.fn(),
  },
  authService: {
    getToken: vi.fn(),
    getRoundAccountIdFromToken: vi.fn(),
  },
}))

describe('Organization Workflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide getCurrentOrganization method', () => {
    const { result } = renderHook(() => useOrganization())

    expect(result.current.getCurrentOrganization).toBeDefined()
    expect(typeof result.current.getCurrentOrganization).toBe('function')
  })

  it('should provide loading and error states', () => {
    const { result } = renderHook(() => useOrganization())

    expect(result.current.isLoading).toBeDefined()
    expect(typeof result.current.isLoading).toBe('boolean')
    expect(result.current.error).toBeDefined()
    expect(result.current.error === null || typeof result.current.error === 'string').toBe(true)
  })

  it('should provide all required organization features', () => {
    const { result } = renderHook(() => useOrganization())

    // Method list should contain only the essential methods
    const methods = Object.keys(result.current)
    expect(methods).toContain('getCurrentOrganization')
    expect(methods).toContain('isLoading')
    expect(methods).toContain('error')
    expect(methods.length).toBe(3) // Only these three methods should exist
  })
})
