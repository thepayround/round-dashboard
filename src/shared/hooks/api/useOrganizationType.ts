/**
 * Organization Type hook for fetching organization types from API
 */

import { useState, useEffect } from 'react'
import { organizationTypeService } from '../../services/api'
import type { OrganizationTypeResponse } from '../../types/api/organizationType'

export const useOrganizationTypes = () => {
  const [data, setData] = useState<OrganizationTypeResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const refetch = async () => {
    setIsLoading(true)
    setIsError(false)
    
    try {
      const response = await organizationTypeService.getOrganizationTypes()
      if (response.success && response.data) {
        setData(response.data)
      } else {
        setIsError(true)
        setData([])
      }
    } catch (error) {
      console.error('Error fetching organization types:', error)
      setIsError(true)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return {
    data,
    isLoading,
    isError,
    refetch,
  }
}
