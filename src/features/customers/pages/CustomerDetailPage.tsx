import type { ColumnDef } from '@tanstack/react-table'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle,
  CreditCard,
  Edit,
  FileText,
  Mail,
  MoreHorizontal,
  Plus,
  Trash2,
  User,
} from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { CustomerDetailSkeleton } from '../components/CustomerDetailSkeleton'
import { CustomerNotesModal } from '../components/CustomerNotesModal'
import { DangerousActionsModal } from '../components/DangerousActionsModal'
import { EditCustomerSheet, type EditCustomerSection } from '../components/EditCustomerSheet'
import { EmailComposeSheet } from '../components/EmailComposeSheet'
import { useCustomerDetailController, type CustomerDetailTab } from '../hooks/useCustomerDetailController'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import type { CustomerNoteResponse } from '@/shared/types/customer.types'
import { DataTable, SortableHeader } from '@/shared/ui/DataTable/DataTable'
import { Button } from '@/shared/ui/shadcn/button'
import { Card } from '@/shared/ui/shadcn/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'
import { cn } from '@/shared/utils/cn'
import { ConfirmDialog } from '@/shared/widgets/ConfirmDialog'
import { SearchFilterToolbar } from '@/shared/widgets/SearchFilterToolbar'

const DETAIL_TABS: { id: CustomerDetailTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'notes', label: 'Notes' },
  { id: 'invoices', label: 'Invoices' },
]

/** Simple info row component */
const InfoRow = ({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={cn('text-sm text-foreground text-right', mono && 'font-mono')}>{value}</span>
  </div>
)

/** Section card with optional edit action */
const SectionCard = ({
  title,
  onEdit,
  children,
  className,
}: {
  title: string
  onEdit?: () => void
  children: React.ReactNode
  className?: string
}) => (
  <Card
    className={cn(
      'p-5 transition-colors',
      onEdit && 'cursor-pointer hover:bg-muted/30',
      className
    )}
    onClick={onEdit}
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-medium">{title}</h3>
      {onEdit && (
        <Edit className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </div>
    {children}
  </Card>
)

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const {
    customer,
    loading,
    error,
    currentTab,
    setCurrentTab,
    isEmailModalOpen,
    isNotesModalOpen,
    editingNoteId,
    isEditModalOpen,
    isDangerousActionsModalOpen,
    isDeleteNoteConfirmOpen,
    noteToDelete: _noteToDelete,
    openEmailModal,
    closeEmailModal,
    openNotesModal,
    closeNotesModal,
    openEditModal,
    closeEditModal,
    openDangerousActionsModal,
    closeDangerousActionsModal,
    requestDeleteNote,
    confirmDeleteNote,
    cancelDeleteNote,
    handleRetry,
    handleStatusChanged,
    handleCustomerUpdated,
    handleCustomerDeleted,
  } = useCustomerDetailController(id)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const hasOpenedEditModalFromQueryRef = useRef(false)

  // Track which section to open in edit sheet
  const [editSection, setEditSection] = useState<EditCustomerSection | undefined>(undefined)

  const handleBackNavigation = useCallback(() => {
    navigate('/customers', { replace: true })
  }, [navigate])

  // Open edit modal with specific section
  const openEditWithSection = useCallback((section: EditCustomerSection) => {
    setEditSection(section)
    openEditModal()
  }, [openEditModal])

  // Reset section when modal closes
  const handleCloseEditModal = useCallback(() => {
    closeEditModal()
    setEditSection(undefined)
  }, [closeEditModal])

  useEffect(() => {
    const shouldOpenEditModal = searchParams.get('mode') === 'edit'

    if (!shouldOpenEditModal) {
      hasOpenedEditModalFromQueryRef.current = false
      return
    }

    if (!customer || hasOpenedEditModalFromQueryRef.current) {
      return
    }

    hasOpenedEditModalFromQueryRef.current = true
    openEditModal()

    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('mode')
    setSearchParams(nextParams, { replace: true })
  }, [customer, openEditModal, searchParams, setSearchParams])

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString))

  const formatDateTime = (dateString: string) =>
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))

  const getStatusBadge = (status: string | number) => {
    const statusValue = typeof status === 'string' ? parseInt(status, 10) : status

    const statusConfig = {
      1: { className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', label: 'Active' },
      2: { className: 'bg-muted text-muted-foreground border-border', label: 'Inactive' },
      3: { className: 'bg-amber-500/10 text-amber-500 border-amber-500/20', label: 'Suspended' },
      4: { className: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Cancelled' },
    } as const

    const config = statusConfig[statusValue as keyof typeof statusConfig] ?? statusConfig[2]

    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const renderOverviewContent = () => {
    if (!customer) return null

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <SectionCard title="Contact Information" onEdit={() => openEditWithSection('contact')}>
            <div className="divide-y divide-border">
              <InfoRow label="Full Name" value={`${customer.firstName} ${customer.lastName}`} />
              <InfoRow
                label="Email"
                value={
                  <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                    {customer.email}
                  </a>
                }
              />
              <InfoRow
                label="Phone"
                value={
                  customer.phoneNumber ? (
                    <span className="flex items-center gap-1.5">
                      {customer.phoneNumber}
                      {customer.phoneNumberConfirmed && (
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                      )}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )
                }
              />
              {customer.company && <InfoRow label="Company" value={customer.company} />}
              <InfoRow
                label="Tax ID"
                value={
                  customer.taxNumber ? (
                    <span className="font-mono">{customer.taxNumber}</span>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )
                }
              />
              <InfoRow
                label="Customer Type"
                value={
                  <span className="flex items-center gap-1.5">
                    {customer.isBusinessCustomer ? (
                      <>
                        <Building2 className="h-3.5 w-3.5" />
                        Business
                      </>
                    ) : (
                      <>
                        <User className="h-3.5 w-3.5" />
                        Individual
                      </>
                    )}
                  </span>
                }
              />
            </div>
          </SectionCard>

          {/* Preferences */}
          <SectionCard title="Preferences" onEdit={() => openEditWithSection('preferences')}>
            <div className="divide-y divide-border">
              <InfoRow
                label="Currency"
                value={customer.currency || <span className="text-muted-foreground">Not set</span>}
              />
              <InfoRow
                label="Language"
                value={customer.locale || <span className="text-muted-foreground">Not set</span>}
              />
              <InfoRow
                label="Timezone"
                value={customer.timezone || <span className="text-muted-foreground">Not set</span>}
              />
            </div>
          </SectionCard>

          {/* Billing Address */}
          <SectionCard title="Billing Address" onEdit={() => openEditWithSection('billing-address')}>
            {customer.billingAddress ? (
              <div className="divide-y divide-border">
                {customer.billingAddress.name && (
                  <InfoRow label="Name" value={customer.billingAddress.name} />
                )}
                <InfoRow label="Address Line 1" value={customer.billingAddress.line1} />
                {customer.billingAddress.line2 && (
                  <InfoRow label="Address Line 2" value={customer.billingAddress.line2} />
                )}
                <InfoRow label="City" value={customer.billingAddress.city} />
                {customer.billingAddress.state && (
                  <InfoRow label="State / Province" value={customer.billingAddress.state} />
                )}
                <InfoRow label="ZIP / Postal Code" value={customer.billingAddress.zipCode} />
                <InfoRow label="Country" value={customer.billingAddress.country} />
                {customer.billingAddress.isPrimary && (
                  <InfoRow
                    label="Primary"
                    value={
                      <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">
                        Yes
                      </span>
                    }
                  />
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No billing address</p>
            )}
          </SectionCard>

          {/* Shipping Address */}
          <SectionCard title="Shipping Address" onEdit={() => openEditWithSection('shipping-address')}>
            {customer.shippingAddress ? (
              <div className="divide-y divide-border">
                {customer.shippingAddress.name && (
                  <InfoRow label="Name" value={customer.shippingAddress.name} />
                )}
                <InfoRow label="Address Line 1" value={customer.shippingAddress.line1} />
                {customer.shippingAddress.line2 && (
                  <InfoRow label="Address Line 2" value={customer.shippingAddress.line2} />
                )}
                <InfoRow label="City" value={customer.shippingAddress.city} />
                {customer.shippingAddress.state && (
                  <InfoRow label="State / Province" value={customer.shippingAddress.state} />
                )}
                <InfoRow label="ZIP / Postal Code" value={customer.shippingAddress.zipCode} />
                <InfoRow label="Country" value={customer.shippingAddress.country} />
                {customer.shippingAddress.isPrimary && (
                  <InfoRow
                    label="Primary"
                    value={
                      <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">
                        Yes
                      </span>
                    }
                  />
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No shipping address</p>
            )}
          </SectionCard>

          {/* Additional Addresses (if any beyond billing/shipping) */}
          {customer.allAddresses.filter(
            addr => addr.id !== customer.billingAddress?.id && addr.id !== customer.shippingAddress?.id
          ).length > 0 && (
            <SectionCard title="Other Addresses">
              <div className="space-y-4">
                {customer.allAddresses
                  .filter(addr => addr.id !== customer.billingAddress?.id && addr.id !== customer.shippingAddress?.id)
                  .map(addr => (
                    <div key={addr.id} className="divide-y divide-border border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between pb-2">
                        <span className="text-sm font-medium">
                          {addr.name || addr.type || 'Address'}
                        </span>
                        {addr.isPrimary && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">
                            Primary
                          </span>
                        )}
                      </div>
                      <InfoRow label="Address Line 1" value={addr.line1} />
                      {addr.line2 && <InfoRow label="Address Line 2" value={addr.line2} />}
                      <InfoRow label="City" value={addr.city} />
                      {addr.state && <InfoRow label="State / Province" value={addr.state} />}
                      <InfoRow label="ZIP / Postal Code" value={addr.zipCode} />
                      <InfoRow label="Country" value={addr.country} />
                    </div>
                  ))}
              </div>
            </SectionCard>
          )}

          {/* Tags */}
          <SectionCard title="Tags" onEdit={() => openEditWithSection('tags')}>
            {customer.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {customer.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags</p>
            )}
          </SectionCard>

          {/* Custom Fields */}
          {Object.keys(customer.customFields).length > 0 && (
            <SectionCard title="Custom Fields">
              <div className="divide-y divide-border">
                {Object.entries(customer.customFields).map(([key, value]) => (
                  <InfoRow key={key} label={key} value={value} />
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Account Settings */}
          <SectionCard title="Account Settings" onEdit={() => openEditWithSection('settings')}>
            <div className="divide-y divide-border">
              <InfoRow
                label="Portal Access"
                value={
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-md',
                      customer.portalAccess
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {customer.portalAccess ? 'Enabled' : 'Disabled'}
                  </span>
                }
              />
              <InfoRow
                label="Auto Collection"
                value={
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-md',
                      customer.autoCollection
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {customer.autoCollection ? 'Enabled' : 'Disabled'}
                  </span>
                }
              />
            </div>
          </SectionCard>

          {/* Activity Summary */}
          <Card className="p-5">
            <h3 className="text-sm font-medium mb-3">Activity</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-semibold">{customer.notes?.length || 0}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Notes</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-semibold">0</div>
                <div className="text-xs text-muted-foreground mt-0.5">Invoices</div>
              </div>
            </div>
          </Card>

          {/* Dates & System Info */}
          <Card className="p-5">
            <h3 className="text-sm font-medium mb-3">System Information</h3>
            <div className="divide-y divide-border">
              <InfoRow label="Customer ID" value={<span className="font-mono text-xs">{customer.id}</span>} />
              <InfoRow label="Customer Since" value={formatDate(customer.signupDate)} />
              {customer.lastActivityDate && (
                <InfoRow label="Last Activity" value={formatDate(customer.lastActivityDate)} />
              )}
              <InfoRow label="Created" value={formatDateTime(customer.createdDate)} />
              <InfoRow label="Modified" value={formatDateTime(customer.modifiedDate)} />
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const notesColumns: ColumnDef<CustomerNoteResponse, unknown>[] = [
    {
      accessorKey: 'content',
      header: ({ column }) => <SortableHeader column={column}>Note</SortableHeader>,
      cell: ({ row }) => (
        <div className="font-medium max-w-md truncate break-all">{row.original.content}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'author',
      header: ({ column }) => <SortableHeader column={column}>Author</SortableHeader>,
      cell: ({ row }) => <div className="text-muted-foreground">{row.original.author}</div>,
    },
    {
      accessorKey: 'createdDate',
      header: ({ column }) => (
        <SortableHeader column={column} className="justify-end">
          Date
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground text-right">{formatDate(row.original.createdDate)}</div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const note = row.original
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={e => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation()
                    openNotesModal(note.id)
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation()
                    requestDeleteNote(note.id)
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]

  // Notes search state
  const [notesSearchQuery, setNotesSearchQuery] = useState('')
  const [showNotesFilters, setShowNotesFilters] = useState(false)

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!customer?.notes) return []
    if (!notesSearchQuery) return customer.notes

    const query = notesSearchQuery.toLowerCase()
    return customer.notes.filter(
      note => note.content.toLowerCase().includes(query) || note.author.toLowerCase().includes(query)
    )
  }, [customer?.notes, notesSearchQuery])

  const renderNotesContent = () => {
    if (!customer) return null

    return (
      <div className="space-y-6">
        {/* Search toolbar with Add Note button */}
        <SearchFilterToolbar
          searchQuery={notesSearchQuery}
          onSearchChange={setNotesSearchQuery}
          searchPlaceholder="Search notes by content or author..."
          searchResults={{
            total: customer.notes.length,
            filtered: filteredNotes.length,
          }}
          showFilters={showNotesFilters}
          onToggleFilters={() => setShowNotesFilters(!showNotesFilters)}
          additionalActions={
            <Button
              type="button"
              onClick={() => openNotesModal()}
              variant="default"
              size="default"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </Button>
          }
        />

        {/* Notes table */}
        {filteredNotes.length > 0 ? (
          <DataTable
            data={filteredNotes}
            columns={notesColumns}
            showPagination={true}
            showSearch={false}
            pageSize={10}
            emptyMessage="No notes found."
            onRowClick={note => openNotesModal(note.id)}
          />
        ) : (
          <div className="text-center py-10 border border-dashed border-border rounded-xl">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              {notesSearchQuery ? 'No notes match your search.' : 'No notes yet. Click "Add Note" to create one.'}
            </p>
          </div>
        )}
      </div>
    )
  }

  const renderInvoicesContent = () => (
    <Card className="p-6">
      <div className="text-center py-10">
        <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-sm font-medium mb-1">No invoices yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Invoices will appear here once billing is connected.
        </p>
        <Link to="/billing">
          <Button variant="secondary" size="sm">
            Go to Billing
          </Button>
        </Link>
      </div>
    </Card>
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/customers" className="p-2 text-muted-foreground rounded-md">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="h-7 bg-muted rounded w-48 mb-2 animate-pulse" />
              <div className="h-4 bg-muted rounded w-32 animate-pulse" />
            </div>
          </div>
          <CustomerDetailSkeleton />
        </div>
      </DashboardLayout>
    )
  }

  const hasError = Boolean(error)

  if (hasError || !customer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24">
          <AlertCircle className="w-16 h-16 text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {hasError ? 'Error Loading Customer' : 'Customer Not Found'}
          </h3>
          <p className="text-muted-foreground text-center mb-6">
            {hasError
              ? error
              : "The customer you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={() => handleBackNavigation()} variant="default" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Customers
            </Button>
            {hasError && (
              <Button type="button" onClick={handleRetry} variant="secondary" className="gap-2">
                Try Again
              </Button>
            )}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate('/customers')}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Back to customers"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {customer.isBusinessCustomer ? (
                  <Building2 className="h-5 w-5 text-primary" />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-medium">
                    {customer.effectiveDisplayName ?? customer.displayName}
                  </h1>
                  {getStatusBadge(customer.status)}
                </div>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" onClick={openEmailModal} className="gap-2">
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
            <Button type="button" variant="default" onClick={openEditModal} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openNotesModal()}>
                  <Plus className="h-4 w-4" />
                  Add Note
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={openDangerousActionsModal}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Customer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-border">
          {DETAIL_TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id)}
              className={cn(
                'pb-3 text-sm font-medium transition-colors relative',
                currentTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              {currentTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {currentTab === 'overview' && renderOverviewContent()}
        {currentTab === 'notes' && renderNotesContent()}
        {currentTab === 'invoices' && renderInvoicesContent()}
      </div>

      {customer && (
        <>
          <EmailComposeSheet
            isOpen={isEmailModalOpen}
            onClose={closeEmailModal}
            customerEmail={customer.email}
            customerName={customer.effectiveDisplayName}
            customerId={customer.id}
          />

          <CustomerNotesModal
            isOpen={isNotesModalOpen}
            onClose={closeNotesModal}
            customerId={customer.id}
            customerName={customer.effectiveDisplayName}
            initialNotes={customer.notes}
            initialEditingNoteId={editingNoteId}
          />

          <EditCustomerSheet
            key={customer.id}
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            customer={customer}
            onCustomerUpdated={handleCustomerUpdated}
            initialSection={editSection}
          />

          <DangerousActionsModal
            isOpen={isDangerousActionsModalOpen}
            onClose={closeDangerousActionsModal}
            customerId={customer.id}
            customerName={customer.effectiveDisplayName}
            currentStatus={customer.status}
            onStatusChanged={handleStatusChanged}
            onCustomerDeleted={handleCustomerDeleted}
          />

          <ConfirmDialog
            isOpen={isDeleteNoteConfirmOpen}
            onClose={cancelDeleteNote}
            onConfirm={confirmDeleteNote}
            title="Delete Note"
            message="Are you sure you want to delete this note? This action cannot be undone."
            confirmLabel="Delete Note"
            variant="danger"
          />
        </>
      )}
    </DashboardLayout>
  )
}

export default CustomerDetailPage
