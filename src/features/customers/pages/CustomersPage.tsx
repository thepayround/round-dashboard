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
  Building2,
  User,
  Download,
  CheckSquare,
  Square,
  Trash2,
} from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { AddCustomerSheet } from '../components/AddCustomerSheet'
import CustomerTable, { type VisibilityState } from '../components/CustomerTable'
import { useCustomersController } from '../hooks/useCustomersController'
import { getStatusMeta } from '../utils'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import type { CustomerResponse } from '@/shared/services/api/customer.service'
import { ColumnVisibilityToggle } from '@/shared/ui/DataTable/DataTable'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Skeleton } from '@/shared/ui/shadcn/skeleton'
import { SearchFilterToolbar } from '@/shared/widgets/SearchFilterToolbar'

const CustomersPage: React.FC = () => {
  const {
    customers: displayedCustomers,
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
    itemsPerPage,
    handleCustomerAdded,
    searchSummary,
  } = useCustomersController()

  // Selection state for export functionality
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([])

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<CustomerResponse | null>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  // Column visibility state - show only essential columns by default
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: true,
    displayName: true,
    email: true,
    company: true,
    status: true,
    currency: true,
    signupDate: true,
    phoneNumber: false,
    portalAccess: false,
    autoCollection: false,
    locale: false,
    timezone: false,
    taxNumber: false,
    tags: false,
    lastActivityDate: false,
    createdDate: false,
    modifiedDate: false,
  })

  // Column definitions for visibility toggle (only hideable columns)
  const columnDefinitions = [
    { id: 'email', visible: columnVisibility.email !== false },
    { id: 'company', visible: columnVisibility.company !== false },
    { id: 'status', visible: columnVisibility.status !== false },
    { id: 'currency', visible: columnVisibility.currency !== false },
    { id: 'signupDate', visible: columnVisibility.signupDate !== false },
    { id: 'phoneNumber', visible: columnVisibility.phoneNumber !== false },
    { id: 'portalAccess', visible: columnVisibility.portalAccess !== false },
    { id: 'autoCollection', visible: columnVisibility.autoCollection !== false },
    { id: 'locale', visible: columnVisibility.locale !== false },
    { id: 'timezone', visible: columnVisibility.timezone !== false },
    { id: 'taxNumber', visible: columnVisibility.taxNumber !== false },
    { id: 'tags', visible: columnVisibility.tags !== false },
    { id: 'lastActivityDate', visible: columnVisibility.lastActivityDate !== false },
    { id: 'createdDate', visible: columnVisibility.createdDate !== false },
    { id: 'modifiedDate', visible: columnVisibility.modifiedDate !== false },
  ]

  const handleColumnToggle = (columnId: string, visible: boolean) => {
    setColumnVisibility(prev => ({ ...prev, [columnId]: visible }))
  }

  const hasSearchOrFilters = Boolean(searchQuery) || hasActiveFilters

  // Export handlers
  const handleExportSelected = () => {
    if (selectedCustomerIds.length === 0) return
    const selectedCustomers = displayedCustomers.filter(c => selectedCustomerIds.includes(c.id))
    const csvContent = convertToCSV(selectedCustomers)
    downloadCSV(csvContent, `customers-export-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const handleExportAll = () => {
    const csvContent = convertToCSV(displayedCustomers)
    downloadCSV(csvContent, `customers-all-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const convertToCSV = (customers: CustomerResponse[]) => {
    const headers = ['ID', 'Display Name', 'First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Status', 'Currency', 'Signup Date']
    const rows = customers.map(c => [
      c.id,
      c.displayName,
      c.firstName,
      c.lastName,
      c.email,
      c.phoneNumber ?? '',
      c.company ?? '',
      c.status,
      c.currency,
      c.signupDate
    ])
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  }

  // Delete handlers
  const handleDeleteClick = (customer: CustomerResponse) => {
    setCustomerToDelete(customer)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      // TODO: Call actual delete API when backend endpoint is available
      // deleteCustomer(customerToDelete.id)
    }
    setDeleteDialogOpen(false)
    setCustomerToDelete(null)
  }

  const handleBulkDeleteClick = () => {
    if (selectedCustomerIds.length > 0) {
      setBulkDeleteDialogOpen(true)
    }
  }

  const handleConfirmBulkDelete = () => {
    // TODO: Call actual bulk delete API when backend endpoint is available
    // bulkDeleteCustomers(selectedCustomerIds)
    setSelectedCustomerIds([])
    setSelectionMode(false)
    setBulkDeleteDialogOpen(false)
  }

  // Duplicate handler - navigates to add customer with pre-filled data
  const handleDuplicate = (customer: CustomerResponse) => {
    // Store customer data in sessionStorage for the add modal to pick up
    const duplicateData = {
      ...customer,
      id: undefined, // Clear ID so a new one will be generated
      displayName: `${customer.displayName} (Copy)`,
    }
    sessionStorage.setItem('duplicateCustomerData', JSON.stringify(duplicateData))
    openAddModal()
  }

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
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">Customers</h1>
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
            columnsToggle={
              viewMode === 'table' ? (
                <ColumnVisibilityToggle
                  columns={columnDefinitions}
                  onToggle={handleColumnToggle}
                />
              ) : undefined
            }
            additionalActions={
              <div className="flex items-center gap-2">
                {selectionMode ? (
                  <>
                    {selectedCustomerIds.length > 0 && (
                      <>
                        <Button
                          variant="destructive"
                          size="default"
                          onClick={handleBulkDeleteClick}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete ({selectedCustomerIds.length})
                        </Button>
                        <Button
                          variant="outline"
                          size="default"
                          onClick={handleExportSelected}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export ({selectedCustomerIds.length})
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="default"
                      onClick={() => {
                        setSelectedCustomerIds([])
                        setSelectionMode(false)
                      }}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Cancel
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
                      variant="outline"
                      size="default"
                      onClick={handleExportAll}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
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
              </div>
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
                        <div className="space-y-4">
                          {/* Header Section */}
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                              {customer.isBusinessCustomer ? (
                                <Building2 className="w-5 h-5 text-primary" />
                              ) : (
                                <User className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors tracking-tight">
                                  {customer.effectiveDisplayName || customer.displayName}
                                </h3>
                                {customer.isBusinessCustomer && (
                                  <Badge variant="secondary">Business</Badge>
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
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Information Cards */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-foreground truncate">{customer.email}</div>
                                <div className="text-xs text-muted-foreground">Primary email</div>
                              </div>
                            </div>

                            {customer.phoneNumber && (
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm text-foreground">{customer.phoneNumber}</div>
                                  <div className="text-xs text-muted-foreground">Phone number</div>
                                </div>
                              </div>
                            )}

                            {customer.billingAddress && (
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-foreground truncate">
                                    {customer.billingAddress.city}, {customer.billingAddress.country}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Location</div>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-foreground">{formatDate(customer.signupDate)}</div>
                                <div className="text-xs text-muted-foreground">Customer since</div>
                              </div>
                            </div>
                          </div>

                          {/* Status and Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <Badge variant={getStatusMeta(customer.status).variant}>
                              {getStatusMeta(customer.status).label}
                            </Badge>

                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/customers/${customer.id}`} aria-label="View customer">
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/customers/${customer.id}?mode=edit`} aria-label="Edit customer">
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>

                          {/* Tags */}
                          {customer.tags.length > 0 && (
                            <div className="pt-3 border-t border-border">
                              <div className="flex flex-wrap gap-1">
                                {customer.tags.slice(0, 3).map((tag: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {customer.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{customer.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
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
                  isLoading={loading || skeletonLoading}
                  selectable={selectionMode}
                  selectedIds={selectedCustomerIds}
                  onSelectionChange={setSelectedCustomerIds}
                  onDelete={handleDeleteClick}
                  onDuplicate={handleDuplicate}
                  columnVisibility={columnVisibility}
                  onColumnVisibilityChange={setColumnVisibility}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Empty State */}
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

        {/* Add Customer Sheet */}
        <AddCustomerSheet
          isOpen={showAddModal}
          onClose={closeAddModal}
          onCustomerAdded={handleCustomerAdded}
        />

        {/* Single Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Customer</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{' '}
                <span className="font-medium text-foreground">
                  {customerToDelete?.effectiveDisplayName ?? customerToDelete?.displayName}
                </span>
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Delete Confirmation Dialog */}
        <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {selectedCustomerIds.length} Customers</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{' '}
                <span className="font-medium text-foreground">
                  {selectedCustomerIds.length} customer{selectedCustomerIds.length > 1 ? 's' : ''}
                </span>
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmBulkDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete {selectedCustomerIds.length} Customer{selectedCustomerIds.length > 1 ? 's' : ''}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  )
}

export default CustomersPage
