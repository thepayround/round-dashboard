import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  CreditCard,
  Edit,
  FileText,
  Globe,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Shield,
  Tag,
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
import { Button, IconButton } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { cn } from '@/shared/utils/cn'

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
    isEditModalOpen,
    isDangerousActionsModalOpen,
    openEmailModal,
    closeEmailModal,
    openNotesModal,
    closeNotesModal,
    openEditModal,
    closeEditModal,
    openDangerousActionsModal,
    closeDangerousActionsModal,
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
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-normal tracking-tight rounded-lg border ${config.variant}`}
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
          <Card padding="lg">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary/20 rounded-xl border border-primary/30">
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
              <div className="space-y-4">
                <Card variant="nested" padding="md">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-secondary" />
                    <div>
                      <div className="text-sm font-normal tracking-tight text-white">{customer.email}</div>
                      <div className="text-xs text-white/60">Primary email address</div>
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
                      {customer.phoneNumberConfirmed && (
                        <div title="Phone number confirmed">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                    </div>
                  </Card>
                )}
                {customer.company && (
                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-[#7767DA]" />
                      <div>
                        <div className="text-sm font-normal tracking-tight text-white">{customer.company}</div>
                        <div className="text-xs text-white/60">Company name</div>
                      </div>
                    </div>
                  </Card>
                )}
                {customer.taxNumber && (
                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-sm font-normal tracking-tight text-white">{customer.taxNumber}</div>
                        <div className="text-xs text-white/60">Tax number</div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                {customer.timezone && (
                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#FF6B6B]" />
                      <div>
                        <div className="text-sm font-normal tracking-tight text-white">{customer.timezone}</div>
                        <div className="text-xs text-white/60">Timezone</div>
                      </div>
                    </div>
                  </Card>
                )}
                {customer.locale && (
                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-secondary" />
                      <div>
                        <div className="text-sm font-normal tracking-tight text-white">{customer.locale}</div>
                        <div className="text-xs text-white/60">Language & locale</div>
                      </div>
                    </div>
                  </Card>
                )}
                {customer.currency && (
                  <Card variant="nested" padding="md">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 flex items-center justify-center text-[#42E695] font-medium text-xs tracking-tight">
                        $
                      </span>
                      <div>
                        <div className="text-sm font-normal tracking-tight text-white">{customer.currency}</div>
                        <div className="text-xs text-white/60">Preferred currency</div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary/20 rounded-xl border border-secondary/30">
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
                  <Card variant="nested" padding="lg">
                    <div className="flex items-center gap-3 mb-3">
                      <CreditCard className="w-5 h-5 text-[#42E695]" />
                      <h3 className="text-sm font-normal tracking-tight text-white">Billing Address</h3>
                    </div>
                    <div className="text-sm text-white/80 leading-relaxed space-y-1">
                      <div>{customer.billingAddress.line1}</div>
                      {customer.billingAddress.line2 && <div>{customer.billingAddress.line2}</div>}
                      <div>
                        {customer.billingAddress.city}, {customer.billingAddress.state} {customer.billingAddress.zipCode}
                      </div>
                      <div className="text-white/60">{customer.billingAddress.country}</div>
                    </div>
                  </Card>
                )}

                {customer.shippingAddress && (
                  <Card variant="nested" padding="lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Truck className="w-5 h-5 text-[#7767DA]" />
                      <h3 className="text-sm font-normal tracking-tight text-white">Shipping Address</h3>
                    </div>
                    <div className="text-sm text-white/80 leading-relaxed space-y-1">
                      <div>{customer.shippingAddress.line1}</div>
                      {customer.shippingAddress.line2 && <div>{customer.shippingAddress.line2}</div>}
                      <div>
                        {customer.shippingAddress.city}, {customer.shippingAddress.state} {customer.shippingAddress.zipCode}
                      </div>
                      <div className="text-white/60">{customer.shippingAddress.country}</div>
                    </div>
                  </Card>
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
            <Card padding="lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/20 rounded-xl border border-[#7767DA]/30">
                  <Tag className="w-5 h-5 text-[#7767DA]" />
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
          <Card padding="lg">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary/20 rounded-xl border border-emerald-500/30">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white mb-2">Quick Actions</h2>
                <p className="text-gray-500 leading-snug">Manage customer account</p>
              </div>
            </div>

            <div className="space-y-3">
              <QuickActionButton label="Send Email" icon={Mail} onClick={openEmailModal} />
              <QuickActionButton label="View Notes" icon={FileText} onClick={openNotesModal} />
              <QuickActionButton label="Edit Details" icon={Edit} onClick={openEditModal} variant="secondary" />
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-warning/20 rounded-xl border border-amber-500/30">
                <Activity className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white mb-2">Account Status</h2>
                <p className="text-gray-500 leading-snug">Customer account settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-white/70" />
                  <span className="text-sm text-white">Portal Access</span>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-lg font-normal tracking-tight ${
                    customer.portalAccess
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-primary border border-red-500/30'
                  }`}
                >
                  {customer.portalAccess ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-white/70" />
                  <span className="text-sm text-white">Auto Collection</span>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-lg font-normal tracking-tight ${
                    customer.autoCollection
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-primary border border-red-500/30'
                  }`}
                >
                  {customer.autoCollection ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {customer.lastActivityDate && (
                <div className="flex justify-between items-center p-3 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/70" />
                    <span className="text-sm text-white">Last Activity</span>
                  </div>
                  <span className="text-sm text-white/80 font-medium">{formatDate(customer.lastActivityDate)}</span>
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
        <Card padding="lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium text-white">Recent Notes</h2>
              <p className="text-sm text-white/60">Keep track of context and conversations</p>
            </div>
            <Button onClick={openNotesModal} variant="primary" size="sm" icon={FileText} iconPosition="left">
              Manage Notes
            </Button>
          </div>

          {customer.notes.length > 0 ? (
            <div className="space-y-4">
              {customer.notes.slice(0, 5).map(note => (
                <div key={note.id} className="border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{note.author}</span>
                    <span className="text-xs text-white/50">{formatDate(note.createdDate)}</span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{note.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
              <FileText className="w-10 h-10 text-white/30 mx-auto mb-3" />
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
        <div className="p-3 bg-primary/20 rounded-xl border border-white/10">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-white">Invoices</h2>
          <p className="text-sm text-white/60">Billing history and upcoming payments</p>
        </div>
      </div>
      <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
        <CreditCard className="w-10 h-10 text-white/30 mx-auto mb-3" />
        <p className="text-sm text-white/60 mb-4">Invoices will appear here once billing is connected.</p>
        <Link
          to="/billing"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg text-sm text-white"
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
            <Link to="/customers" className="p-2 text-gray-400 rounded-lg">
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
              <Button onClick={handleRetry} variant="secondary" size="sm" icon={CheckCircle} iconPosition="left">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card padding="lg" clickable={false}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <IconButton
                  icon={ArrowLeft}
                  onClick={() => navigate('/customers')}
                  variant="ghost"
                  size="lg"
                  className="p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl border border-white/10"
                  aria-label="Back to customers"
                />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    {customer.isBusinessCustomer ? <Building2 className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-lg font-medium text-white">{customer.effectiveDisplayName ?? customer.displayName}</h1>
                      {customer.isBusinessCustomer && (
                        <span className="px-3 py-1 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg text-sm font-medium">
                          Business
                        </span>
                      )}
                      {getStatusBadge(customer.status)}
                    </div>
                    <div className="flex items-center gap-4 text-white/70">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Member since {formatDate(customer.signupDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={openEmailModal}
                  variant="secondary"
                  size="md"
                  icon={Mail}
                  iconPosition="left"
                  className="bg-secondary/20 border-secondary/30 text-secondary"
                >
                  Send Email
                </Button>
                <Button type="button" onClick={openEditModal} variant="primary" size="md" icon={Edit} iconPosition="left">
                  Edit Details
                </Button>
                <IconButton
                  type="button"
                  onClick={openDangerousActionsModal}
                  icon={MoreHorizontal}
                  variant="ghost"
                  size="md"
                  className="text-white/70 border border-white/10"
                  title="Dangerous Actions"
                  aria-label="Dangerous Actions"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
          {DETAIL_TABS.map(tab => (
            <Button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id)}
              size="sm"
              variant={currentTab === tab.id ? 'primary' : 'ghost'}
              className={cn(
                'rounded-lg px-4',
                currentTab === tab.id
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-white/60 border border-transparent hover:text-white'
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {currentTab === 'overview' && renderOverviewContent()}
        {currentTab === 'notes' && renderNotesContent()}
        {currentTab === 'invoices' && renderInvoicesContent()}
      </div>

      {customer && (
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
        </>
      )}
    </DashboardLayout>
  )
}

export default CustomerDetailPage
