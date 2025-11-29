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
import { Checkbox } from '@/shared/ui'
import { Pagination } from '@/shared/ui/Pagination'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Skeleton } from '@/shared/ui/shadcn/skeleton'
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

const getStatusVariant = (status: number | string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const statusValue = typeof status === 'string' ? parseInt(status) : status

  switch (statusValue) {
    case CustomerStatus.Active:
      return 'default' // Active uses primary color (success-like)
    case CustomerStatus.Inactive:
      return 'outline' // Inactive uses neutral outline
    case CustomerStatus.Suspended:
      return 'secondary' // Suspended uses secondary color (warning-like)
    case CustomerStatus.Cancelled:
      return 'destructive' // Cancelled uses destructive (error)
    default:
      return 'outline'
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
        {/* Page Skeleton - Inline replacement for PageSkeleton */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-6">
            <Skeleton className="h-9 w-48" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="h-64">
                  <CardContent className="p-6">
                    <Skeleton className="h-full w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Page Header - Inline replacement for PageHeader */}
      <div className="flex items-center justify-between pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Customers</h1>
        </div>
      </div>

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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleExportSelected}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export ({selectedCustomers.length})
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBulkEdit}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Bulk Edit ({selectedCustomers.length})
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="default"
                      onClick={() => {
                        setSelectedCustomers([])
                        setSelectionMode(false)
                      }}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Cancel Selection
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="default"
                      onClick={() => setSelectionMode(true)}
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Select
                    </Button>
                    <Button
                      variant="ghost"
                      size="default"
                      onClick={handleExportAll}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  </>
                )}
                <Button
                  variant="default"
                  size="default"
                  onClick={openAddModal}
                >
                  Add Customer
                </Button>
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
                    <Card key={`skeleton-${index}`} className="p-6 h-full">
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <Skeleton className="w-11 h-11 rounded-xl" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-6 w-16" />
                          <div className="flex gap-2">
                            <Skeleton className="w-8 h-8" />
                            <Skeleton className="w-8 h-8" />
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
                      <Card className="p-6 h-full hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                        {/* Card selection checkbox - only show in selection mode */}
                        {selectionMode && (
                          <div className={`absolute top-4 right-4 transition-all duration-200 ${selectedCustomers.includes(customer.id) ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'
                            }`}>
                            <div className={`relative ${selectedCustomers.includes(customer.id) ? 'bg-primary/20 p-1 rounded-lg border border-primary/50' : ''}`}>
                              <Checkbox
                                checked={selectedCustomers.includes(customer.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCustomers([...selectedCustomers, customer.id])
                                  } else {
                                    setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id))
                                  }
                                }}
                                aria-label={`Select customer ${customer.displayName}`}
                                className="w-5 h-5"
                              />
                            </div>
                          </div>
                        )}

                        {/* Header Section */}
                        <div className="flex items-start gap-4 mb-6">
                          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                            {customer.isBusinessCustomer ? (
                              <Building2 className="w-5 h-5 text-primary" />
                            ) : (
                              <User className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-white group-hover:text-primary transition-colors tracking-tight">
                                {customer.effectiveDisplayName || customer.displayName}
                              </h3>
                              {customer.isBusinessCustomer && (
                                <span className="px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded text-xs font-medium">
                                  Business
                                </span>
                              )}
                            </div>
                            {customer.company && (
                              <p className="text-sm text-muted-foreground">{customer.company}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Customer actions"
                            className="text-white/50 hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Information Cards */}
                        <div className="space-y-4 mb-4">
                          <Card className="p-4">
                            <div className="flex items-center gap-4">
                              <Mail className="w-4 h-4 text-secondary" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-normal tracking-tight text-white truncate">{customer.email}</div>
                                <div className="text-xs text-white/60">Primary email</div>
                              </div>
                            </div>
                          </Card>

                          {customer.phoneNumber && (
                            <Card className="p-4">
                              <div className="flex items-center gap-4">
                                <Phone className="w-4 h-4 text-success" />
                                <div className="flex-1">
                                  <div className="text-sm font-normal tracking-tight text-white">{customer.phoneNumber}</div>
                                  <div className="text-xs text-white/60">Phone number</div>
                                </div>
                              </div>
                            </Card>
                          )}

                          {customer.billingAddress && (
                            <Card className="p-4">
                              <div className="flex items-center gap-4">
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

                          <Card className="p-4">
                            <div className="flex items-center gap-4">
                              <Calendar className="w-4 h-4 text-accent" />
                              <div>
                                <div className="text-sm font-normal tracking-tight text-white">{formatDate(customer.signupDate)}</div>
                                <div className="text-xs text-white/60">Customer since</div>
                              </div>
                            </div>
                          </Card>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusVariant(customer.status)}>
                              {getStatusText(customer.status)}
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/customers/${customer.id}`}
                              className="p-2 text-white/50 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all duration-200"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/customers/${customer.id}?mode=edit`}
                              className="p-2 text-white/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>

                        {/* Tags */}
                        {customer.tags.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex flex-wrap gap-1">
                              {customer.tags.slice(0, 3).map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-accent/20 text-accent border border-accent/30 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {customer.tags.length > 3 && (
                                <span className="px-2 py-1 bg-[#262626] text-muted-foreground rounded text-xs">
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
                  isLoading={loading || skeletonLoading}
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

        {/* Empty State - Inline replacement for EmptyState */}
        {!loading && displayedCustomers.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No customers found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              {hasSearchOrFilters
                ? 'No customers match your current filters. Try adjusting your search criteria or clearing some filters.'
                : 'Get started by adding your first customer'}
            </p>
            {!hasSearchOrFilters && (
              <Button type="button" onClick={openAddModal} className="mt-6">
                Add Customer
              </Button>
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
