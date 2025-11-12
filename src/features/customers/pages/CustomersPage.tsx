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
  Download,
  Building2,
  User,
  CheckSquare,
  Square,
} from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { AddCustomerModal } from '../components/AddCustomerModal'
import CustomerTable from '../components/CustomerTable'
import { useCustomersController } from '../hooks/useCustomersController'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import type { CustomerResponse } from '@/shared/services/api/customer.service'
import { ActionButton } from '@/shared/ui/ActionButton'
import { IconButton } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Pagination } from '@/shared/ui/Pagination'
import { SearchFilterToolbar } from '@/shared/widgets/SearchFilterToolbar'


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
      return 'bg-[#38D39F]/10 text-[#38D39F] border border-[#38D39F]/40'
    case CustomerStatus.Inactive:
      return 'bg-[#262626] text-white/60 border border-white/10'
    case CustomerStatus.Suspended:
      return 'bg-[#FF9F0A]/10 text-[#FF9F0A] border border-[#FF9F0A]/40'
    case CustomerStatus.Cancelled:
      return 'bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/40'
    default:
      return 'bg-[#262626] text-white/60 border border-white/10'
  }
}

const CustomersPage: React.FC = () => {
  const {
    customers: displayedCustomers,
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
    openAddModal,
    closeAddModal,
    currentPage,
    handlePageChange,
    itemsPerPage,
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
    searchSummary,
  } = useCustomersController()

  const hasSearchOrFilters = Boolean(searchQuery) || hasActiveFilters

  const formatDate = (dateString: string) => new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString))

  // Show skeleton loading only on first load
  if (initialLoading) {
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
            onToggleFilters={toggleFilters}
            filterFields={filterFields}
            onClearFilters={clearAllFilters}
            searchResults={searchSummary}
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
                      onClick={handleExportAll}
                    />
                  </>
                )}
                <ActionButton
                  label="Add Customer"
                  variant="primary"
                  size="md"
                  onClick={openAddModal}
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
                  <IconButton
                    icon={MoreHorizontal}
                    variant="ghost"
                    size="sm"
                    aria-label="Customer actions"
                    className="text-white/50 hover:text-white"
                  />
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
              {hasSearchOrFilters
                ? 'No customers match your current filters. Try adjusting your search criteria or clearing some filters.'
                : 'Get started by adding your first customer'}
            </p>
            {!hasSearchOrFilters && (
              <ActionButton
                label="Add Customer"
                variant="primary"
                size="md"
                onClick={openAddModal}
              />
            )}
          </div>
        )}

        {/* Add Customer Modal */}
        <AddCustomerModal
          isOpen={showAddModal}
          onClose={closeAddModal}
          onCustomerAdded={handleCustomerAdded}
        />
      </div>
    </DashboardLayout>
  )
}

export default CustomersPage

