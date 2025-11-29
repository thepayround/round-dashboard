import { Grid3X3, List } from 'lucide-react'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useCurrencies } from '@/shared/hooks/api/useCountryCurrency'
import { useViewPreferences } from '@/shared/hooks/useViewPreferences'
import { customerService, CustomerType as ApiCustomerType } from '@/shared/services/api/customer.service'
import type { CustomerResponse, CustomerSearchParams } from '@/shared/services/api/customer.service'
import type { FilterField, ViewMode } from '@/shared/widgets/SearchFilterToolbar/SearchFilterToolbar'

// Define ViewModeOption locally
export interface ViewModeOption {
  value: ViewMode
  label: string
  icon: React.ComponentType<{ className?: string }>
}

type SortField = 'displayName' | 'email' | 'company' | 'status' | 'signupDate' | 'currency'
type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  direction: SortDirection
}

interface UseCustomersControllerResult {
  customers: CustomerResponse[]
  totalCount: number
  totalPages: number
  loading: boolean
  skeletonLoading: boolean
  initialLoading: boolean
  hasActiveFilters: boolean
  viewMode: ViewMode
  viewModeOptions: ViewModeOption[]
  handleViewModeChange: (mode: ViewMode) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  showFilters: boolean
  toggleFilters: () => void
  filterFields: FilterField[]
  clearAllFilters: () => void
  showAddModal: boolean
  openAddModal: () => void
  closeAddModal: () => void
  currentPage: number
  handlePageChange: (page: number) => void
  itemsPerPage: number
  handleItemsPerPageChange: (items: number) => void
  sortConfig: SortConfig
  handleSortChange: (field: string) => void
  selectionMode: boolean
  setSelectionMode: (value: boolean) => void
  selectedCustomers: string[]
  setSelectedCustomers: Dispatch<SetStateAction<string[]>>
  handleCustomerAdded: () => void
  handleExportSelected: () => void
  handleBulkEdit: () => void
  handleExportAll: () => void
  searchSummary: {
    total: number
    filtered: number
  }
}

const mapSortFieldToApi = (field: SortField) => {
  if (field === 'displayName') return 'FirstName'
  if (field === 'signupDate') return 'CreatedDate'
  return field.charAt(0).toUpperCase() + field.slice(1)
}

const STATUS_LABELS: Record<string, string> = {
  '1': 'Active',
  '2': 'Inactive',
  '3': 'Suspended',
  '4': 'Cancelled',
  Active: 'Active',
  Inactive: 'Inactive',
  Suspended: 'Suspended',
  Cancelled: 'Cancelled',
}

const normalizeStatus = (value: string) => STATUS_LABELS[value] ?? value

export const useCustomersController = (): UseCustomersControllerResult => {
  const { showError, showSuccess } = useGlobalToast()
  const { preferences, setItemsPerPage, setSortConfig, setViewMode } = useViewPreferences()
  const { data: currenciesData } = useCurrencies()

  const [customers, setCustomers] = useState<CustomerResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [viewMode, setViewModeState] = useState<ViewMode>(preferences.viewMode)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPageState, setItemsPerPageState] = useState(preferences.itemsPerPage)
  const [sortConfig, setSortConfigState] = useState<SortConfig>({
    field: preferences.sortField as SortField,
    direction: preferences.sortDirection,
  })
  const [selectedCustomerType, setSelectedCustomerType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [selectedPortalAccess, setSelectedPortalAccess] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const isFirstLoadRef = useRef(true)

  const viewModeOptions: ViewModeOption[] = useMemo(
    () => [
      { value: 'table', icon: List, label: 'Table' },
      { value: 'grid', icon: Grid3X3, label: 'Cards' },
    ],
    []
  )

  const handleViewModeChange = useCallback(
    (mode: ViewMode) => {
      setViewModeState(mode)
      setViewMode(mode)
    },
    [setViewMode]
  )

  const handleItemsPerPageChange = useCallback(
    (items: number) => {
      setItemsPerPageState(items)
      setItemsPerPage(items)
      setCurrentPage(1)
    },
    [setItemsPerPage]
  )

  const handleSortChange = useCallback(
    (field: string) => {
      const sortField = field as SortField
      const newDirection =
        sortConfig.field === sortField && sortConfig.direction === 'asc' ? 'desc' : 'asc'
      setSortConfigState({ field: sortField, direction: newDirection })
      setSortConfig(sortField, newDirection)
    },
    [setSortConfig, sortConfig]
  )

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev)
  }, [])

  const loadCustomers = useCallback(async () => {
    try {
      if (isFirstLoadRef.current) {
        setLoading(true)
      } else {
        setSkeletonLoading(true)
      }

      const statusFilter = selectedStatus || undefined
      const statusLabelFilter = statusFilter ? normalizeStatus(statusFilter) : undefined
      const typeFilter = selectedCustomerType || undefined
      const portalAccessFilter = selectedPortalAccess || undefined
      const currencyFilter = selectedCurrency || undefined

      const searchParams: CustomerSearchParams = {
        pageNumber: currentPage,
        pageSize: itemsPerPageState,
        searchQuery: searchQuery.trim() || undefined,
        orderBy: mapSortFieldToApi(sortConfig.field),
        isAscending: sortConfig.direction === 'asc',
        Status: statusFilter,
        Type: typeFilter,
        Currency: currencyFilter,
        PortalAccess: portalAccessFilter,
      }

      const response = await customerService.getAll(searchParams)

      const filteredItems = response.items.filter((customer) => {
        if (typeFilter && customer.type !== typeFilter) return false

        if (statusLabelFilter) {
          const customerStatus = normalizeStatus(String(customer.status))
          if (customerStatus !== statusLabelFilter && String(customer.status) !== statusFilter) return false
        }

        if (currencyFilter && customer.currency !== currencyFilter) return false

        if (portalAccessFilter) {
          const wantsPortalAccess = portalAccessFilter === 'true'
          if (customer.portalAccess !== wantsPortalAccess) return false
        }

        return true
      })

      const hasFiltersApplied =
        Boolean(typeFilter) ||
        Boolean(statusFilter) ||
        Boolean(currencyFilter) ||
        Boolean(portalAccessFilter) ||
        Boolean(searchQuery.trim())

      setCustomers(filteredItems)
      setTotalCount(hasFiltersApplied ? filteredItems.length : response.totalCount)
    } catch (error: unknown) {
      let errorMessage = 'Failed to load customers'
      const hasResponse = (
        err: unknown
      ): err is { response: { status: number; data?: { errors?: Record<string, string[]> } } } =>
        typeof err === 'object' && err !== null && 'response' in err
      const hasNetworkProps = (err: unknown): err is { code?: string; message?: string } =>
        typeof err === 'object' && err !== null

      if (hasResponse(error) && error.response?.status === 400) {
        const validationErrors = error.response.data?.errors
        if (validationErrors) {
          const errorMessages = Object.entries(validationErrors)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
            .join('\n')
          errorMessage = `Invalid filters:\n${errorMessages}`
        } else {
          errorMessage = 'Invalid filter parameters. Please check your selections.'
        }
      } else if (hasResponse(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        errorMessage = 'You are not authorized to view customers'
      } else if (hasResponse(error) && error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (
        hasNetworkProps(error) &&
        (error.code === 'ECONNABORTED' || error.message === 'Network Error')
      ) {
        errorMessage = 'Network error. Please check your connection.'
      }

      showError(errorMessage)
      console.error('Error loading customers:', error)
    } finally {
      if (isFirstLoadRef.current) {
        setLoading(false)
        isFirstLoadRef.current = false
      } else {
        setSkeletonLoading(false)
      }
    }
  }, [
    currentPage,
    itemsPerPageState,
    searchQuery,
    sortConfig.field,
    sortConfig.direction,
    selectedStatus,
    selectedCustomerType,
    selectedCurrency,
    selectedPortalAccess,
    showError,
  ])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleCustomerAdded = useCallback(() => {
    loadCustomers()
    setShowAddModal(false)
    showSuccess('Customer added successfully')
  }, [loadCustomers, showSuccess])

  const handleExportSelected = useCallback(() => {
    if (selectedCustomers.length === 0) {
      showError('Please select customers to export')
      return
    }
    showSuccess('Export functionality coming soon')
  }, [selectedCustomers.length, showError, showSuccess])

  const handleBulkEdit = useCallback(() => {
    if (selectedCustomers.length === 0) {
      showError('Please select customers to edit')
      return
    }
    showSuccess('Bulk edit functionality coming soon')
  }, [selectedCustomers.length, showError, showSuccess])

  const handleExportAll = useCallback(() => {
    showSuccess('Export functionality coming soon')
  }, [showSuccess])

  const clearAllFilters = useCallback(() => {
    setSelectedCustomerType('')
    setSelectedStatus('')
    setSelectedCurrency('')
    setSelectedPortalAccess('')
    setCurrentPage(1)
  }, [])

  const currencyOptions = useMemo(
    () => [
      { id: '', name: 'All Currencies' },
      ...(currenciesData
        ?.map(currency => ({
          id: currency.currencyCodeAlpha,
          name: `${currency.currencyCodeAlpha} - ${currency.currencyName}`,
        }))
        .sort((a, b) => a.id.localeCompare(b.id)) ?? []),
    ],
    [currenciesData]
  )

  const filterFields = useMemo<FilterField[]>(() => {
    const withPageReset = (setter: (value: string) => void) => (value: string) => {
      setter(value)
      setCurrentPage(1)
    }

    return [
      {
        id: 'customerType',
        label: 'Customer Type',
        type: 'select',
        value: selectedCustomerType,
        onChange: withPageReset(setSelectedCustomerType),
        onClear: () => withPageReset(setSelectedCustomerType)(''),
        options: [
          { id: '', name: 'All Types' },
          { id: ApiCustomerType.Individual, name: 'Individual' },
          { id: ApiCustomerType.Business, name: 'Business' },
        ],
      },
      {
        id: 'status',
        label: 'Status',
        type: 'select',
        value: selectedStatus,
        onChange: withPageReset(setSelectedStatus),
        onClear: () => withPageReset(setSelectedStatus)(''),
        options: [
          { id: '', name: 'All Status' },
          { id: '1', name: normalizeStatus('1') },
          { id: '2', name: normalizeStatus('2') },
          { id: '3', name: normalizeStatus('3') },
          { id: '4', name: normalizeStatus('4') },
        ],
      },
      {
        id: 'currency',
        label: 'Currency',
        type: 'select',
        value: selectedCurrency,
        onChange: withPageReset(setSelectedCurrency),
        onClear: () => withPageReset(setSelectedCurrency)(''),
        options: currencyOptions,
      },
      {
        id: 'portalAccess',
        label: 'Portal Access',
        type: 'select',
        value: selectedPortalAccess,
        onChange: withPageReset(setSelectedPortalAccess),
        onClear: () => withPageReset(setSelectedPortalAccess)(''),
        options: [
          { id: '', name: 'All' },
          { id: 'true', name: 'Enabled' },
          { id: 'false', name: 'Disabled' },
        ],
      },
    ]
  }, [
    currencyOptions,
    selectedCurrency,
    selectedCustomerType,
    selectedPortalAccess,
    selectedStatus,
  ])

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPageState))
  const initialLoading = isFirstLoadRef.current && loading
  const hasActiveFilters = Boolean(
    selectedCustomerType || selectedStatus || selectedCurrency || selectedPortalAccess
  )

  return {
    customers,
    totalCount,
    totalPages,
    loading,
    skeletonLoading,
    initialLoading,
    hasActiveFilters,
    viewMode,
    viewModeOptions,
    handleViewModeChange,
    searchQuery,
    setSearchQuery,
    showFilters,
    toggleFilters,
    filterFields,
    clearAllFilters,
    showAddModal,
    openAddModal: () => setShowAddModal(true),
    closeAddModal: () => setShowAddModal(false),
    currentPage,
    handlePageChange,
    itemsPerPage: itemsPerPageState,
    handleItemsPerPageChange,
    sortConfig,
    handleSortChange,
    selectionMode,
    setSelectionMode,
    selectedCustomers,
    setSelectedCustomers,
    handleCustomerAdded,
    handleExportSelected,
    handleBulkEdit,
    handleExportAll,
    searchSummary: {
      total: totalCount,
      filtered: customers.length,
    },
  }
}
