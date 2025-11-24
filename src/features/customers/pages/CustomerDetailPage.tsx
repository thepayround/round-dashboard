import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle,
  CreditCard,
  Edit,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Shield,
  Tag,
  Trash2,
  Truck,
  User,
  Zap,
  Clock,
} from 'lucide-react'
import React, { useCallback, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { CustomerDetailSkeleton } from '../components/CustomerDetailSkeleton'
import { CustomerNotesModal } from '../components/CustomerNotesModal'
import { DangerousActionsModal } from '../components/DangerousActionsModal'
import { EditCustomerModal } from '../components/EditCustomerModal'
import { EmailComposeModal } from '../components/EmailComposeModal'
import { useCustomerDetailController, type CustomerDetailTab } from '../hooks/useCustomerDetailController'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import { EmptyState } from '@/shared/ui'
import { Button, IconButton, PlainButton } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/Table/Table'
import { cn } from '@/shared/utils/cn'
import { ConfirmDialog } from '@/shared/widgets/ConfirmDialog'

const DETAIL_TABS: { id: CustomerDetailTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'notes', label: 'Notes' },
  { id: 'invoices', label: 'Invoices' },
]

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

  const handleBackNavigation = useCallback(() => {
    navigate('/customers', { replace: true })
  }, [navigate])

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

  const QuickActionButton = ({
    label,
    icon,
    onClick,
    variant = 'ghost',
    className = '',
  }: {
    label: string
    icon: LucideIcon
    onClick: () => void
    variant?: 'ghost' | 'secondary'
    className?: string
  }) => (
    <Button
      type="button"
      onClick={onClick}
      variant={variant}
      size="md"
      icon={icon}
      iconPosition="left"
      fullWidth
      className={cn(
        'justify-start border border-white/10',
        variant === 'secondary' && 'bg-primary/20 border-primary/30 hover:bg-primary/30',
        className
      )}
    >
      {label}
    </Button>
  )

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString))

  const getStatusBadge = (status: string | number) => {
    const statusValue = typeof status === 'string' ? parseInt(status, 10) : status

    const statusConfig = {
      1: {
        variant: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        icon: '●',
        label: 'Active',
      },
      2: {
        variant: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        icon: '●',
        label: 'Inactive',
      },
      3: {
        variant: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        icon: '●',
        label: 'Suspended',
      },
      4: {
        variant: 'bg-red-500/20 text-primary border-red-500/30',
        icon: '●',
        label: 'Cancelled',
      },
    } as const

    const config = statusConfig[statusValue as keyof typeof statusConfig] ?? statusConfig[2]

    return (
      <span
        className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-normal tracking-tight rounded-md border ${config.variant}`}
      >
        <span className="text-xs">{config.icon}</span>
        {config.label}
      </span>
    )
  }

  const renderOverviewContent = () => {
    if (!customer) return null

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg" className="bg-bg-surface">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 bg-primary/20 rounded-xl border border-primary/30">
                {customer.isBusinessCustomer ? (
                  <Building2 className="w-5 h-5 text-primary" />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-white mb-2">
                  {customer.isBusinessCustomer ? 'Business Information' : 'Customer Information'}
                </h2>
                <p className="text-gray-500 leading-snug">
                  Core {customer.isBusinessCustomer ? 'business' : 'customer'} details and contact information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="divide-y divide-border/40 border border-border/40 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-secondary" />
                    <span className="text-sm text-fg-muted">Email</span>
                  </div>
                  <span className="text-sm font-medium text-fg">{customer.email}</span>
                </div>

                {customer.phoneNumber && (
                  <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-success" />
                      <span className="text-sm text-fg-muted">Phone</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-fg">{customer.phoneNumber}</span>
                      {customer.phoneNumberConfirmed && (
                        <div title="Confirmed">
                          <CheckCircle className="w-3 h-3 text-success" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {customer.company && (
                  <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-accent" />
                      <span className="text-sm text-fg-muted">Company</span>
                    </div>
                    <span className="text-sm font-medium text-fg">{customer.company}</span>
                  </div>
                )}

                {customer.taxNumber && (
                  <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-fg-muted">Tax ID</span>
                    </div>
                    <span className="text-sm font-mono text-fg">{customer.taxNumber}</span>
                  </div>
                )}
              </div>

              <div className="divide-y divide-border/40 border border-border/40 rounded-lg overflow-hidden h-fit">
                <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm text-fg-muted">Joined Date</span>
                  </div>
                  <span className="text-sm font-medium text-fg">{formatDate(customer.signupDate)}</span>
                </div>

                {customer.timezone && (
                  <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-destructive" />
                      <span className="text-sm text-fg-muted">Timezone</span>
                    </div>
                    <span className="text-sm font-medium text-fg">{customer.timezone}</span>
                  </div>
                )}

                {customer.locale && (
                  <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-fg-muted">Locale</span>
                    </div>
                    <span className="text-sm font-medium text-fg">{customer.locale}</span>
                  </div>
                )}

                {customer.currency && (
                  <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 flex items-center justify-center text-success font-bold text-xs">$</span>
                      <span className="text-sm text-fg-muted">Currency</span>
                    </div>
                    <span className="text-sm font-medium text-fg">{customer.currency}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-bg-surface">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 bg-primary/20 rounded-xl border border-secondary/30">
                <MapPin className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-white mb-2">Addresses</h2>
                <p className="text-gray-500 leading-snug">Customer billing and shipping addresses</p>
              </div>
            </div>

            {customer.billingAddress || customer.shippingAddress ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customer.billingAddress && (
                  <div className="divide-y divide-border/40 border border-border/40 rounded-lg overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-bg-raised/50">
                      <CreditCard className="w-4 h-4 text-success" />
                      <span className="text-sm text-fg-muted">Billing Address</span>
                    </div>
                    <div className="p-4 bg-bg-raised/50 text-sm text-fg-muted leading-relaxed">
                      <p>{customer.billingAddress.line1}</p>
                      {customer.billingAddress.line2 && <p>{customer.billingAddress.line2}</p>}
                      <p>{customer.billingAddress.city}, {customer.billingAddress.state} {customer.billingAddress.zipCode}</p>
                      <p>{customer.billingAddress.country}</p>
                    </div>
                  </div>
                )}

                {customer.shippingAddress && (
                  <div className="divide-y divide-border/40 border border-border/40 rounded-lg overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-bg-raised/50">
                      <Truck className="w-4 h-4 text-accent" />
                      <span className="text-sm text-fg-muted">Shipping Address</span>
                    </div>
                    <div className="p-4 bg-bg-raised/50 text-sm text-fg-muted leading-relaxed">
                      <p>{customer.shippingAddress.line1}</p>
                      {customer.shippingAddress.line2 && <p>{customer.shippingAddress.line2}</p>}
                      <p>{customer.shippingAddress.city}, {customer.shippingAddress.state} {customer.shippingAddress.zipCode}</p>
                      <p>{customer.shippingAddress.country}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                icon={MapPin}
                title="No addresses on file"
                description="Customer addresses will appear here once added"
                className="border border-dashed border-white/20 rounded-xl"
              />
            )}
          </Card>

          {(customer.tags.length > 0 || Object.keys(customer.customFields).length > 0) && (
            <Card padding="lg" className="bg-bg-surface">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-primary/20 rounded-xl border border-accent/30">
                  <Tag className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-white mb-2">Metadata</h2>
                  <p className="text-gray-500 leading-snug">Tags and custom fields</p>
                </div>
              </div>

              <div className="space-y-4">
                {customer.tags.length > 0 && (
                  <div>
                    <h3 className="text-xs font-normal tracking-tight text-gray-300 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md border border-gray-600/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(customer.customFields).length > 0 && (
                  <div>
                    <h3 className="text-xs font-normal tracking-tight text-gray-300 mb-2">Custom fields</h3>
                    <div className="space-y-2">
                      {Object.entries(customer.customFields).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-400">{key}</span>
                          <span className="text-gray-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>


        <div className="space-y-6">

          <Card padding="lg" className="bg-bg-surface">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 bg-primary/20 rounded-xl border border-emerald-500/30">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white mb-2">Quick Actions</h2>
                <p className="text-gray-500 leading-snug">Manage customer account</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <QuickActionButton
                label="Edit Details"
                icon={Edit}
                onClick={openEditModal}
                variant="secondary"
                className="hover:bg-primary/30 hover:border-primary/30"
              />
              <QuickActionButton label="Send Email" icon={Mail} onClick={openEmailModal} />
              <QuickActionButton
                label="Delete Customer"
                icon={Trash2}
                onClick={openDangerousActionsModal}
                className="bg-[#371b1d] hover:bg-[#4a2428] border-red-400/30 hover:border-red-400/30 text-white"
              />
            </div>
          </Card>

          <Card padding="lg" className="bg-[#141416]">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 bg-warning/20 rounded-xl border border-amber-500/30">
                <Activity className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white mb-2">Account Status</h2>
                <p className="text-gray-500 leading-snug">Customer account settings</p>
              </div>
            </div>

            <div className="divide-y divide-border/40 border border-border/40 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-fg-muted" />
                  <span className="text-sm text-fg-muted">Portal Access</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium border ${customer.portalAccess
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}
                >
                  {customer.portalAccess ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-fg-muted" />
                  <span className="text-sm text-fg-muted">Auto Collection</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium border ${customer.autoCollection
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}
                >
                  {customer.autoCollection ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              {customer.lastActivityDate && (
                <div className="flex items-center justify-between p-4 bg-bg-raised/50">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-fg-muted" />
                    <span className="text-sm text-fg-muted">Last Activity</span>
                  </div>
                  <span className="text-sm font-medium text-fg">{formatDate(customer.lastActivityDate)}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const renderNotesContent = () => {
    if (!customer) return null

    return (
      <div className="space-y-6">
        <Card padding="lg" className="bg-bg-surface">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium text-white">Recent Notes</h2>
              <p className="text-sm text-white/60">Keep track of context and conversations</p>
            </div>
            <Button onClick={() => openNotesModal()} variant="primary" size="md" icon={Plus} iconPosition="left">
              Add Note
            </Button>
          </div>

          {customer.notes.length > 0 ? (
            <div className="border border-white/10 rounded-lg overflow-hidden bg-bg-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Note</TableHead>
                    <TableHead className="w-[150px]">Author</TableHead>
                    <TableHead className="w-[150px] text-right">Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.notes.slice(0, 5).map(note => (
                    <TableRow
                      key={note.id}
                      className="cursor-pointer hover:bg-white/5"
                      onClick={() => openNotesModal(note.id)}
                    >
                      <TableCell className="font-medium max-w-md truncate break-all">{note.content}</TableCell>
                      <TableCell className="text-fg-muted">{note.author}</TableCell>
                      <TableCell className="text-right text-fg-muted">{formatDate(note.createdDate)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          icon={Trash2}
                          variant="ghost"
                          size="sm"
                          aria-label="Delete note"
                          className="text-fg-muted hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            requestDeleteNote(note.id)
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
              <FileText className="w-10 h-10 text-white/60 mx-auto mb-4" />
              <p className="text-sm text-white/60">No notes yet. Click &quot;Manage Notes&quot; to add one.</p>
            </div>
          )}
        </Card>
      </div>
    )
  }

  const renderInvoicesContent = () => (
    <Card padding="lg">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-4 bg-primary/20 rounded-xl border border-white/10">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-white">Invoices</h2>
          <p className="text-sm text-white/60">Billing history and upcoming payments</p>
        </div>
      </div>
      <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
        <CreditCard className="w-10 h-10 text-white/60 mx-auto mb-4" />
        <p className="text-sm text-white/60 mb-4">Invoices will appear here once billing is connected.</p>
        <Link
          to="/billing"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-md text-sm text-white"
        >
          Go to Billing
        </Link>
      </div>
    </Card>
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/customers" className="p-2 text-gray-400 rounded-md">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="h-7 bg-gray-700/50 rounded w-48 mb-2 animate-pulse" />
              <div className="h-4 bg-gray-700/50 rounded w-32 animate-pulse" />
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
          <AlertCircle className="w-16 h-16 text-primary mb-4" />
          <h3 className="text-lg font-medium tracking-tight text-white mb-2">
            {hasError ? 'Error Loading Customer' : 'Customer Not Found'}
          </h3>
          <p className="text-gray-400 text-center mb-6">
            {hasError ? error : "The customer you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              onClick={() => handleBackNavigation()}
              variant="primary"
              size="md"
              icon={ArrowLeft}
              iconPosition="left"
            >
              Back to Customers
            </Button>
            {hasError && (
              <Button onClick={handleRetry} variant="secondary" size="md" icon={CheckCircle} iconPosition="left">
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
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-6">
            <IconButton
              icon={ArrowLeft}
              onClick={() => navigate('/customers')}
              variant="ghost"
              size="md"
              className="text-white/60 hover:text-white"
              aria-label="Back to customers"
            />

            <div className="flex items-center gap-4">
              <h1 className="text-xl font-medium text-white">{customer.effectiveDisplayName ?? customer.displayName}</h1>
              {getStatusBadge(customer.status)}
            </div>
          </div>
        </motion.div>




        <div className="flex gap-6">
          {DETAIL_TABS.map(tab => (
            <PlainButton
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={cn(
                'pb-2 text-sm font-medium transition-colors relative',
                currentTab === tab.id
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              )}
              unstyled
            >
              {tab.label}
              {currentTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </PlainButton>
          ))}
        </div>

        {currentTab === 'overview' && renderOverviewContent()}
        {currentTab === 'notes' && renderNotesContent()}
        {currentTab === 'invoices' && renderInvoicesContent()}
      </div>

      {
        customer && (
          <>
            <EmailComposeModal
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

            <EditCustomerModal
              isOpen={isEditModalOpen}
              onClose={closeEditModal}
              customer={customer}
              onCustomerUpdated={handleCustomerUpdated}
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
        )
      }
    </DashboardLayout >
  )
}

export default CustomerDetailPage
