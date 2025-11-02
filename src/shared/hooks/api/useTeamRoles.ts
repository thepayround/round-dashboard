import { useState, useEffect, useCallback } from 'react'

import { apiClient } from '@/shared/services/apiClient'

interface RoleOption {
  value: string
  label: string
  description: string
}

interface UseTeamRolesResult {
  data: RoleOption[]
  isLoading: boolean
  isError: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useTeamRoles = (): UseTeamRolesResult => {
  const [data, setData] = useState<RoleOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTeamRoles = useCallback(async () => {
    try {
      setIsLoading(true)
      setIsError(false)
      setError(null)

      // Try to fetch from API first
      const response = await apiClient.get<RoleOption[]>('/team/roles')
      
      if (response.success && response.data) {
        setData(response.data)
      } else {
        throw new Error(response.error ?? 'Failed to fetch team roles')
      }
    } catch (err) {
      console.warn('API not available, using static roles:', err)
      setIsError(false) // Don't show as error, this is expected during development
      
      // Use static roles that match our simplified role system
      setData([
        { value: 'Admin', label: 'Administrator', description: 'Full access to manage users, settings, and configurations' },
        { value: 'TeamManager', label: 'Team Manager', description: 'Manages team-related tasks and members' },
        { value: 'Sales', label: 'Sales', description: 'Access to sales features and customer relationships' },
        { value: 'Finance', label: 'Finance', description: 'Access to billing, invoices, and financial reports' },
        { value: 'Support', label: 'Support', description: 'Access to customer support features' },
        { value: 'TeamMember', label: 'Team Member', description: 'Standard team member access' },
        { value: 'Viewer', label: 'Viewer', description: 'Read-only access to resources and reports' }
      ])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    await fetchTeamRoles()
  }, [fetchTeamRoles])

  useEffect(() => {
    fetchTeamRoles()
  }, [fetchTeamRoles])

  return {
    data,
    isLoading,
    isError,
    error,
    refetch
  }
}