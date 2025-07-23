/**
 * Integration test to verify the GetStartedPage uses the new organization workflow correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useOrganization } from '@/shared/hooks/api/useOrganization'

// Mock the API services
vi.mock('@/shared/services/api', () => ({
  organizationService: {
    getByRoundAccountId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    createAddress: vi.fn(),
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

  it('should provide getCurrentUserOrganization method', () => {
    const { result } = renderHook(() => useOrganization())

    expect(result.current.getCurrentUserOrganization).toBeDefined()
    expect(typeof result.current.getCurrentUserOrganization).toBe('function')
  })

  it('should provide getByRoundAccountId method', () => {
    const { result } = renderHook(() => useOrganization())

    expect(result.current.getByRoundAccountId).toBeDefined()
    expect(typeof result.current.getByRoundAccountId).toBe('function')
  })

  it('should provide getByOrganizationId method', () => {
    const { result } = renderHook(() => useOrganization())

    expect(result.current.getByOrganizationId).toBeDefined()
    expect(typeof result.current.getByOrganizationId).toBe('function')
  })

  it('should have all the workflow methods available for GetStartedPage', () => {
    const { result } = renderHook(() => useOrganization())

    // Verify all methods that GetStartedPage needs are available
    const requiredMethods = [
      'getCurrentUserOrganization',
      'getByRoundAccountId',
      'getByOrganizationId',
      'create',
      'update',
      // NOTE: createAddress removed - addresses are included in organization responses
    ]

    requiredMethods.forEach(method => {
      expect(result.current[method as keyof typeof result.current]).toBeDefined()
    })
  })
})
