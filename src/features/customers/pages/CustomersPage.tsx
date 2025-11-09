import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users,
  Eye,
  Edit,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MoreHorizontal,
  Grid3X3,
  List,
  Download,
  Building2,
  User,
  CheckSquare,
  Square
} from 'lucide-react'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'

import { AddCustomerModal } from '../components/AddCustomerModal'
import CustomerTable from '../components/CustomerTable'

import { SearchFilterToolbar } from '@/shared/components'
import type { FilterField } from '@/shared/components'
import { ActionButton } from '@/shared/components/ActionButton'
import { PlainButton } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { Pagination } from '@/shared/components/Pagination'
import type { ViewMode, ViewModeOption } from '@/shared/components/ViewModeToggle'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { useCurrencies } from '@/shared/hooks/api/useCountryCurrency'
import { useViewPreferences } from '@/shared/hooks/useViewPreferences'
import { customerService } from '@/shared/services/api/customer.service'
import type { CustomerResponse, CustomerSearchParams } from '@/shared/services/api/customer.service'


// CustomerStatus enum values from backend
enum CustomerStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Cancelled = 4
}

const getStatusText = (status: number | string): string => {
  const statusValue = typeof status === 'string' ? parseInt(status) : status
  
  switch (statusValue) {
    case CustomerStatus.Active:
      return 'Active'
    case CustomerStatus.Inactive:
      return 'Inactive'
    case CustomerStatus.Suspended:
      return 'Suspended'
    case CustomerStatus.Cancelled:
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}

const getStatusClass = (status: number | string): string => {
  const statusValue = typeof status === 'string' ? parseInt(status) : status
  
  switch (statusValue) {
    case CustomerStatus.Active:
      return 'bg-green-500/20 text-green-400 border border-green-500/30'
    case CustomerStatus.Inactive:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
    case CustomerStatus.Suspended:
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
    case CustomerStatus.Cancelled:
      return 'bg-red-500/20 text-[#D417C8] border border-red-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }
}

// Sort configuration
type SortField = 'displayName' | 'email' | 'company' | 'status' | 'signupDate' | 'currency'
type SortDirection = 'asc' | 'desc'

interface SortConfig {
  field: SortField
  direction: SortDirection
}

const CustomersPage: React.FC = () => {
  const { showError, showSuccess } = useGlobalToast()
  const { preferences, setViewMode, setItemsPerPage, setSortConfig } = useViewPreferences()
  
  // Data state
  const [customers, setCustomers] = useState<CustomerResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [skeletonLoading, setSkeletonLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  
  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [selectionMode, setSelectionMode] = useState(false)
  
  // View and pagination state
  const [viewMode, setViewModeState] = useState<ViewMode>(preferences.viewMode)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPageState] = useState(preferences.itemsPerPage)
  
  // Sort state
  const [sortConfig, setSortConfigState] = useState<SortConfig>({
    field: preferences.sortField as SortField,
    direction: preferences.sortDirection
  })

  // Filter state
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedCurrency, setSelectedCurrency] = useState<string>('')
  const [selectedPortalAccess, setSelectedPortalAccess] = useState<string>('')
  
  // Search state - will be sent to backend
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Track if this is the first load to show full loading overlay
  const isFirstLoadRef = useRef(true)

  // Fetch currencies for dynamic currency filter
  const { data: currenciesData } = useCurrencies()

  // View mode options for the toolbar
  const viewModeOptions: ViewModeOption[] = [
    { value: 'table', icon: List, label: 'Table' },
    { value: 'grid', icon: Grid3X3, label: 'Cards' }
  ]

  // Update view mode and persist preferences
  const handleViewModeChange = (mode: ViewMode) => {
    setViewModeState(mode)
    setViewMode(mode)
  }

  // Update items per page and persist preferences
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPageState(items)
    setItemsPerPage(items)
    setCurrentPage(1)
  }

  // Update sort config and persist preferences
  const handleSortChange = (field: string) => {
    const sortField = field as SortField
    const newDirection = sortConfig.field === sortField && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfigState({ field: sortField, direction: newDirection })
    setSortConfig(sortField, newDirection)
  }

  const loadCustomers = useCallback(async () => {
    try {
      // Show loading overlay on first load, skeleton for subsequent loads
      if (isFirstLoadRef.current) {
        setLoading(true)
      } else {
        setSkeletonLoading(true)
      }
      
      // Build search params - ALL filtering and search done by BACKEND
      const searchParams: CustomerSearchParams = {
        pageNumber: currentPage,
        pageSize: itemsPerPage,
        searchQuery: searchQuery.trim() || undefined,
        orderBy: (() => {
          if (sortConfig.field === 'displayName') return 'FirstName'
          if (sortConfig.field === 'signupDate') return 'CreatedDate'
          return sortConfig.field.charAt(0).toUpperCase() + sortConfig.field.slice(1)
        })(),
        isAscending: sortConfig.direction === 'asc',
        // Multiple filters - all sent simultaneously
        Status: selectedStatus || undefined,
        Type: selectedCustomerType || undefined,
        Currency: selectedCurrency || undefined,
        PortalAccess: selectedPortalAccess || undefined
      }

      const response = await customerService.getAll(searchParams)
      
      // Use backend data directly - NO client-side filtering or searching
      setCustomers(response.items)
      setTotalCount(response.totalCount)
    } catch (error: unknown) {
      // Enhanced error handling with specific messages
      let errorMessage = 'Failed to load customers'
      
      // Type guard to check if error has response property
      const hasResponse = (err: unknown): err is { response: { status: number; data?: { errors?: Record<string, string[]> } } } => typeof err === 'object' && err !== null && 'response' in err

      // Type guard for network errors
      const hasNetworkProps = (err: unknown): err is { code?: string; message?: string } => typeof err === 'object' && err !== null
      
      if (hasResponse(error) && error.response?.status === 400) {
        // Validation error - show specific field errors
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
      } else if (hasNetworkProps(error) && (error.code === 'ECONNABORTED' || error.message === 'Network Error')) {
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
  }, [currentPage, itemsPerPage, sortConfig, searchQuery, selectedCustomerType, selectedStatus, selectedCurrency, selectedPortalAccess, showError])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  // Client-side search - now handled by backend
  // Search queries are sent to backend via searchParams.searchQuery

  // Display customers directly from backend (already filtered/searched)
  const displayedCustomers = customers

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const formatDate = (dateString: string) => new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString))

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCustomerAdded = () => {
    loadCustomers()
    setShowAddModal(false)
    showSuccess('Customer added successfully')
  }

  const handleExportSelected = () => {
    if (selectedCustomers.length === 0) {
      showError('Please select customers to export')
      return
    }
    showSuccess('Export functionality coming soon')
  }

  const handleBulkEdit = () => {
    if (selectedCustomers.length === 0) {
      showError('Please select customers to edit')
      return
    }
    showSuccess('Bulk edit functionality coming soon')
  }

  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedCustomerType('')
    setSelectedStatus('')
    setSelectedCurrency('')
    setSelectedPortalAccess('')
    setCurrentPage(1)
  }

  // Build currency options from API data
  const currencyOptions = [
    { id: '', name: 'All Currencies' },
    ...(currenciesData?.map(currency => ({
      id: currency.currencyCodeAlpha,
      name: `${currency.currencyCodeAlpha} - ${currency.currencyName}`
    })).sort((a, b) => a.id.localeCompare(b.id)) || [])
  ]

  // Filter fields for the search toolbar
  const filterFields: FilterField[] = [
    {
      id: 'customerType',
      label: 'Customer Type',
      type: 'select',
      value: selectedCustomerType,
      onChange: (value: string) => {
        setSelectedCustomerType(value)
        setCurrentPage(1)
      },
      onClear: () => {
        setSelectedCustomerType('')
        setCurrentPage(1)
      },
      options: [
        { id: '', name: 'All Types' },
        { id: 'Individual', name: 'Individual' },
        { id: 'Business', name: 'Business' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: selectedStatus,
      onChange: (value: string) => {
        setSelectedStatus(value)
        setCurrentPage(1)
      },
      onClear: () => {
        setSelectedStatus('')
        setCurrentPage(1)
      },
      options: [
        { id: '', name: 'All Status' },
        { id: 'Active', name: 'Active' },
        { id: 'Inactive', name: 'Inactive' },
        { id: 'Suspended', name: 'Suspended' },
        { id: 'Cancelled', name: 'Cancelled' }
      ]
    },
    {
      id: 'currency',
      label: 'Currency',
      type: 'select',
      value: selectedCurrency,
      onChange: (value: string) => {
        setSelectedCurrency(value)
        setCurrentPage(1)
      },
      onClear: () => {
        setSelectedCurrency('')
        setCurrentPage(1)
      },
      options: currencyOptions
    },
    {
      id: 'portalAccess',
      label: 'Portal Access',
      type: 'select',
      value: selectedPortalAccess,
      onChange: (value: string) => {
        setSelectedPortalAccess(value)
        setCurrentPage(1)
      },
      onClear: () => {
        setSelectedPortalAccess('')
        setCurrentPage(1)
      },
      options: [
        { id: '', name: 'All' },
        { id: 'true', name: 'Enabled' },
        { id: 'false', name: 'Disabled' }
      ]
    }
  ]

  // Show skeleton loading only on first load
  if (isFirstLoadRef.current && loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="w-48 h-8 bg-[#262626] rounded animate-pulse" />
              <div className="w-64 h-4 bg-[#262626] rounded animate-pulse" />
            </div>
            <div className="w-32 h-10 bg-[#262626] rounded-lg animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-6 bg-[#141414] border border-[#262626] rounded-2xl animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#262626] rounded-xl" />
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-[#262626] rounded" />
                      <div className="w-32 h-3 bg-[#262626] rounded" />
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-[#262626] rounded-lg" />
                </div>
                
                <div className="space-y-3">
                  <div className="w-full h-3 bg-[#262626] rounded" />
                  <div className="w-3/4 h-3 bg-[#262626] rounded" />
                  <div className="w-1/2 h-3 bg-[#262626] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* All-in-one Search and Action Toolbar */}
        <div className="space-y-4">
          <SearchFilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search customers by name, email, company, phone, or tags..."
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            filterFields={filterFields}
            onClearFilters={clearAllFilters}
            searchResults={{
              total: totalCount,
              filtered: displayedCustomers.length
            }}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            viewModeOptions={viewModeOptions}
            additionalActions={
              <>
                {selectionMode ? (
                  <>
                    {selectedCustomers.length > 0 && (
                      <>
                        <ActionButton
                          label={`Export (${selectedCustomers.length})`}
                          variant="ghost"
                          size="sm"
                          icon={Download}
                          onClick={handleExportSelected}
                        />
                        <ActionButton
                          label={`Bulk Edit (${selectedCustomers.length})`}
                          variant="ghost"
                          size="sm"
                          icon={Edit}
                          onClick={handleBulkEdit}
                        />
                      </>
                    )}
                    <ActionButton
                      label="Cancel Selection"
                      variant="ghost"
                      size="md"
                      icon={Square}
                      onClick={() => {
                        setSelectedCustomers([])
                        setSelectionMode(false)
                      }}
                    />
                  </>
                ) : (
                  <>
                    <ActionButton
                      label="Select"
                      variant="ghost"
                      size="md"
                      icon={CheckSquare}
                      onClick={() => setSelectionMode(true)}
                    />
                    <ActionButton
                      label="Export All"
                      variant="ghost"
                      size="md"
                      icon={Download}
                      onClick={() => showSuccess('Export functionality coming soon')}
                    />
                  </>
                )}
                <ActionButton
                  label="Add Customer"
                  variant="primary"
                  size="md"
                  onClick={() => setShowAddModal(true)}
                />
              </>
            }
          />
        </div>

        {/* Content Area */}
        <div className="relative">
          {/* Show content immediately, let table handle loading states */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
            {skeletonLoading ? (
              // Skeleton loading for grid view
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <Card key={`skeleton-${index}`} padding="lg" className="h-full">
                  <div className="animate-pulse space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-white/5 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-white/5 rounded w-3/4" />
                        <div className="h-4 bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-white/5 rounded" />
                      <div className="h-4 bg-white/5 rounded w-5/6" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-white/5 rounded w-16" />
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-white/5 rounded-lg" />
                        <div className="w-8 h-8 bg-white/5 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              displayedCustomers.map((customer: CustomerResponse) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative h-full"
              >
              <Card padding="lg" className="h-full hover:shadow-lg hover:shadow-[#D417C8]/10 transition-all duration-300">
                {/* Card selection checkbox - only show in selection mode */}
                {selectionMode && (
                  <div className={`absolute top-4 right-4 transition-all duration-200 ${
                    selectedCustomers.includes(customer.id) ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <label htmlFor={`customer-card-${customer.id}`} className="flex items-center cursor-pointer">
                      <span className="sr-only">Select customer {customer.displayName}</span>
                      <div className={`relative ${selectedCustomers.includes(customer.id) ? 'bg-[#D417C8]/20 p-1 rounded-lg border border-[#D417C8]/50' : ''}`}>
                        <input
                          id={`customer-card-${customer.id}`}
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCustomers([...selectedCustomers, customer.id])
                            } else {
                              setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id))
                            }
                          }}
                          className="w-5 h-5 text-[#D417C8] bg-[#1a1a1a] border-[#333333] rounded focus:ring-[#D417C8] focus:ring-2 cursor-pointer"
                        />
                      </div>
                    </label>
                  </div>
                )}

                {/* Header Section */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-[#D417C8]/10 rounded-xl border border-[#D417C8]/20">
                    {customer.isBusinessCustomer ? (
                      <Building2 className="w-5 h-5 text-[#D417C8]" />
                    ) : (
                      <User className="w-5 h-5 text-[#D417C8]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-white group-hover:text-[#D417C8] transition-colors tracking-tight">
                        {customer.effectiveDisplayName || customer.displayName}
                      </h3>
                      {customer.isBusinessCustomer && (
                        <span className="px-2 py-1 bg-[#14BDEA]/10 text-[#14BDEA] border border-[#14BDEA]/20 rounded text-xs font-medium">
                          Business
                        </span>
                      )}
                    </div>
                    {customer.company && (
                      <p className="text-sm text-[#a3a3a3]">{customer.company}</p>
                    )}
                  </div>
                  <PlainButton className="p-2 text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all duration-200" aria-label="Customer actions">
                    <MoreHorizontal className="w-4 h-4" />
                  </PlainButton>
                </div>

                {/* Information Cards */}
                <div className="space-y-3 mb-4">
                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#14BDEA]" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-normal tracking-tight text-white truncate">{customer.email}</div>
                        <div className="text-xs text-white/60">Primary email</div>
                      </div>
                    </div>
                  </Card>
                  
                  {customer.phoneNumber && (
                    <Card variant="nested" padding="md">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#42E695]" />
                        <div className="flex-1">
                          <div className="text-sm font-normal tracking-tight text-white">{customer.phoneNumber}</div>
                          <div className="text-xs text-white/60">Phone number</div>
                        </div>
                      </div>
                    </Card>
                  )}
                  
                  {customer.billingAddress && (
                    <Card variant="nested" padding="md">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-normal tracking-tight text-white truncate">
                            {customer.billingAddress.city}, {customer.billingAddress.country}
                          </div>
                          <div className="text-xs text-white/60">Location</div>
                        </div>
                      </div>
                    </Card>
                  )}
                  
                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#7767DA]" />
                      <div>
                        <div className="text-sm font-normal tracking-tight text-white">{formatDate(customer.signupDate)}</div>
                        <div className="text-xs text-white/60">Customer since</div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-normal tracking-tight ${getStatusClass(customer.status)}`}>
                      {getStatusText(customer.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="p-2 text-white/50 hover:text-[#14BDEA] hover:bg-[#14BDEA]/10 rounded-lg transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/customers/${customer.id}/edit`}
                      className="p-2 text-white/50 hover:text-[#D417C8] hover:bg-[#D417C8]/10 rounded-lg transition-all duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Tags */}
                {customer.tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#7767DA]/20 text-[#7767DA] border border-[#7767DA]/30 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {customer.tags.length > 3 && (
                        <span className="px-2 py-1 bg-[#262626] text-[#a3a3a3] rounded text-xs">
                          +{customer.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))
            )}
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CustomerTable
                  customers={displayedCustomers}
                  sortConfig={sortConfig}
                  onSort={handleSortChange}
                  loading={loading || skeletonLoading}
                  selectable={selectionMode}
                  selectedIds={selectedCustomers}
                  onSelectionChange={setSelectedCustomers}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {!loading && totalCount > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            showItemsPerPage
            showGoToFirst
            showGoToLast
            pageSizeOptions={[6, 12, 24, 48]}
          />
        )}

        {/* Empty State */}
        {!loading && displayedCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center">
              <Users className="w-12 h-12 text-[#737373]" />
            </div>
            <h3 className="text-xl font-medium tracking-tight text-white mb-2">No customers found</h3>
            <p className="text-[#a3a3a3] mb-6">
              {searchQuery || selectedCustomerType || selectedStatus || selectedCurrency
                ? 'No customers match your current filters. Try adjusting your search criteria or clearing some filters.' 
                : 'Get started by adding your first customer'}
            </p>
            {!searchQuery && (
              <ActionButton
                label="Add Customer"
                variant="primary"
                size="md"
                onClick={() => setShowAddModal(true)}
              />
            )}
          </div>
        )}

        {/* Add Customer Modal */}
        <AddCustomerModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCustomerAdded={handleCustomerAdded}
        />
      </div>
    </DashboardLayout>
  )
}

export default CustomersPage
