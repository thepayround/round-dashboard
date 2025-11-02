import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Building2,
  User,
  MapPin,
  Calendar,
  Globe,
  Clock,
  Tag,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  CreditCard,
  Truck,
  Activity,
  Zap
} from 'lucide-react'
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'

import { CustomerDetailSkeleton } from '../components/CustomerDetailSkeleton'
import { CustomerNotesModal } from '../components/CustomerNotesModal'
import { DangerousActionsModal } from '../components/DangerousActionsModal'
import { EditCustomerModal } from '../components/EditCustomerModal'
import { EmailComposeModal } from '../components/EmailComposeModal'

import { ActionButton } from '@/shared/components/ActionButton'
import { Card } from '@/shared/components/Card'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { customerService } from '@/shared/services/api/customer.service'
import type { CustomerResponse , CustomerStatus } from '@/shared/services/api/customer.service'


const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { showError, showSuccess } = useGlobalToast()
  
  const [customer, setCustomer] = useState<CustomerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDangerousActionsModalOpen, setIsDangerousActionsModalOpen] = useState(false)

  const loadCustomer = useCallback(async (customerId: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await customerService.get(customerId)
      setCustomer(data)
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message ?? 'Failed to load customer details'
      setError(errorMessage)
      showError(errorMessage)
      // Error is already logged via showError toast
    } finally {
      setLoading(false)
    }
  }, [showError])

  const handleRetry = () => {
    if (id) {
      loadCustomer(id)
    }
  }

  const handleStatusChanged = (newStatus: string) => {
    if (customer) {
      setCustomer({ ...customer, status: newStatus as CustomerResponse['status'] })
    }
  }

  const handleCustomerDeleted = () => {
    // Navigate back to customers list after deletion
    window.location.href = '/customers'
  }

  useEffect(() => {
    if (id) {
      loadCustomer(id)
    }
  }, [id, loadCustomer])

  const _handleStatusUpdate = async (status: CustomerStatus, reason?: string) => {
    if (!customer) return
    
    try {
      await customerService.updateStatus(customer.id, { 
        status, 
        reason 
      })
      showSuccess(`Customer status updated to ${status}`)
      await loadCustomer(customer.id)
    } catch (error) {
      showError('Failed to update customer status')
    }
  }

  const formatDate = (dateString: string) => new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString))

  const getStatusBadge = (status: string | number) => {
    // Convert status to number if it's a string
    const statusValue = typeof status === 'string' ? parseInt(status) : status
    
    const statusConfig = {
      1: { // Active
        variant: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        icon: '●',
        label: 'Active'
      },
      2: { // Inactive
        variant: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        icon: '○',
        label: 'Inactive'
      },
      3: { // Suspended
        variant: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        icon: '⏸',
        label: 'Suspended'
      },
      4: { // Cancelled
        variant: 'bg-red-500/20 text-[#D417C8] border-red-500/30',
        icon: '✕',
        label: 'Cancelled'
      }
    }
    
    const config = statusConfig[statusValue as keyof typeof statusConfig] ?? statusConfig[2]
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-normal tracking-tight rounded-lg border ${config.variant}`}>
        <span className="text-xs">{config.icon}</span>
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/customers" 
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
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

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  if (error || !customer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24">
          <AlertCircle className="w-16 h-16 text-[#D417C8] mb-4" />
          <h3 className="text-lg font-medium tracking-tight text-white mb-2">
            {error ? 'Error Loading Customer' : 'Customer Not Found'}
          </h3>
          <p className="text-gray-400 text-center mb-6">
            {error ?? "The customer you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/customers"
              className="flex items-center gap-2 px-4 py-2 bg-[#D417C8] hover:bg-[#BD2CD0] text-white rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Customers
            </Link>
            {error && (
              <ActionButton
                label="Try Again"
                onClick={handleRetry}
                variant="secondary"
                size="sm"
              />
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
        >
          <Card padding="lg">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/customers"
                className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 border border-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  {customer.isBusinessCustomer ? (
                    <Building2 className="w-6 h-6 text-white" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-lg font-medium text-white">{customer.effectiveDisplayName ?? customer.displayName}</h1>
                    {customer.isBusinessCustomer && (
                      <span className="px-3 py-1 bg-[#14BDEA]/20 text-[#14BDEA] border border-[#14BDEA]/30 rounded-lg text-sm font-medium">
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
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#14BDEA]/20 border border-[#14BDEA]/30 text-[#14BDEA] rounded-lg hover:bg-[#14BDEA]/30 hover:text-white transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Send Email</span>
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg hover:shadow-[#D417C8]/25 transition-all duration-200"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium">Edit Details</span>
              </button>
              <button 
                onClick={() => setIsDangerousActionsModalOpen(true)}
                className="p-3 text-white/70 hover:text-[#D417C8] hover:bg-red-500/10 rounded-lg transition-all duration-200 border border-white/10"
                title="Dangerous Actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card padding="lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/20 rounded-xl border border-[#D417C8]/30">
                    {customer.isBusinessCustomer ? (
                      <Building2 className="w-5 h-5 text-[#D417C8]" />
                    ) : (
                      <User className="w-5 h-5 text-[#D417C8]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-medium text-white mb-2">
                      {customer.isBusinessCustomer ? 'Business Information' : 'Customer Information'}
                    </h2>
                    <p className="text-gray-500 dark:text-polar-500 leading-snug">
                      Core {customer.isBusinessCustomer ? 'business' : 'customer'} details and contact information
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Card variant="nested" padding="md">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[#14BDEA]" />
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
                          <Globe className="w-4 h-4 text-[#14BDEA]" />
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
                          <span className="w-4 h-4 flex items-center justify-center text-[#42E695] font-medium text-xs tracking-tight">$</span>
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
            </motion.div>

            {/* Addresses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card padding="lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/20 rounded-xl border border-[#14BDEA]/30">
                    <MapPin className="w-5 h-5 text-[#14BDEA]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-medium text-white mb-2">Addresses</h2>
                    <p className="text-gray-500 dark:text-polar-500 leading-snug">
                      Customer billing and shipping addresses
                    </p>
                  </div>
                </div>
                
                {(customer.billingAddress ?? customer.shippingAddress) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customer.billingAddress && (
                      <Card variant="nested" padding="lg" className="hover:bg-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <CreditCard className="w-5 h-5 text-[#42E695]" />
                          <h3 className="text-sm font-normal tracking-tight text-white">
                            Billing Address
                          </h3>
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
                      <Card variant="nested" padding="lg" className="hover:bg-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <Truck className="w-5 h-5 text-[#7767DA]" />
                          <h3 className="text-sm font-normal tracking-tight text-white">
                            Shipping Address
                          </h3>
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
                  <div className="text-center py-12 border-2 border-dashed border-white/20 rounded-xl">
                    <MapPin className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white/70 mb-2">No addresses on file</h3>
                    <p className="text-sm text-white/50">
                      Customer addresses will appear here once added
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Tags and Custom Fields */}
            {(customer.tags.length > 0 || Object.keys(customer.customFields).length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card padding="lg">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-primary/20 rounded-xl border border-[#7767DA]/30">
                      <Tag className="w-5 h-5 text-[#7767DA]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-medium text-white mb-2">Metadata</h2>
                      <p className="text-gray-500 dark:text-polar-500 leading-snug">
                        Tags and custom fields
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {customer.tags.length > 0 && (
                      <div>
                        <h3 className="text-xs font-normal tracking-tight text-gray-300 mb-2">
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {customer.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md border border-gray-600/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {Object.keys(customer.customFields).length > 0 && (
                      <div>
                        <h3 className="text-xs font-normal tracking-tight text-gray-300 mb-2">
                          Custom fields
                        </h3>
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
              </motion.div>
            )}
          </div>

          {/* Right Column - Actions and Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card padding="lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/20 rounded-xl border border-emerald-500/30">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-white mb-2">Quick Actions</h2>
                    <p className="text-gray-500 dark:text-polar-500 leading-snug">
                      Manage customer account
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setIsEmailModalOpen(true)}
                    className="w-full flex items-center gap-3 p-3 border border-white/10 rounded-xl hover:bg-white/5 hover:border-[#14BDEA]/30 text-left transition-all duration-200 group"
                  >
                    <Mail className="w-4 h-4 text-[#14BDEA] group-hover:text-white" />
                    <span className="text-sm font-normal tracking-tight text-white">Send Email</span>
                  </button>
                  <button
                    onClick={() => setIsNotesModalOpen(true)}
                    className="w-full flex items-center gap-3 p-3 border border-white/10 rounded-xl hover:bg-white/5 hover:border-[#42E695]/30 text-left transition-all duration-200 group"
                  >
                    <FileText className="w-4 h-4 text-[#42E695] group-hover:text-white" />
                    <span className="text-sm font-normal tracking-tight text-white">View Notes</span>
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full flex items-center gap-3 p-3 bg-primary/20 border border-primary/30 rounded-xl hover:bg-primary/30 text-left transition-all duration-200 group"
                  >
                    <Edit className="w-4 h-4 text-[#D417C8] group-hover:text-white" />
                    <span className="text-sm font-normal tracking-tight text-white">Edit Details</span>
                  </button>
                </div>
              </Card>
            </motion.div>

            {/* Status Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card padding="lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-warning/20 rounded-xl border border-amber-500/30">
                    <Activity className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-white mb-2">Account Status</h2>
                    <p className="text-gray-500 dark:text-polar-500 leading-snug">
                      Customer account settings
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-white/70" />
                      <span className="text-sm text-white">Portal Access</span>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-lg font-normal tracking-tight ${
                      customer.portalAccess 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-500/20 text-[#D417C8] border border-red-500/30'
                    }`}>
                      {customer.portalAccess ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-white/70" />
                      <span className="text-sm text-white">Auto Collection</span>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-lg font-normal tracking-tight ${
                      customer.autoCollection 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-500/20 text-[#D417C8] border border-red-500/30'
                    }`}>
                      {customer.autoCollection ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {customer.lastActivityDate && (
                    <div className="flex justify-between items-center p-3 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/70" />
                        <span className="text-sm text-white">Last Activity</span>
                      </div>
                      <span className="text-sm text-white/80 font-medium">
                        {formatDate(customer.lastActivityDate)}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {customer && (
        <>
          <EmailComposeModal
            isOpen={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
            customerEmail={customer.email}
            customerName={customer.effectiveDisplayName}
            customerId={customer.id}
          />
          
          <CustomerNotesModal
            isOpen={isNotesModalOpen}
            onClose={() => setIsNotesModalOpen(false)}
            customerId={customer.id}
            customerName={customer.effectiveDisplayName}
            initialNotes={customer.notes}
          />
          
          <EditCustomerModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            customer={customer}
            onCustomerUpdated={(updatedCustomer) => setCustomer(updatedCustomer)}
          />
          
          <DangerousActionsModal
            isOpen={isDangerousActionsModalOpen}
            onClose={() => setIsDangerousActionsModalOpen(false)}
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
