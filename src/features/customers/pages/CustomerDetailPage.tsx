import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Globe,
  Clock,
  Tag,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  MoreHorizontal
} from 'lucide-react'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { Card } from '@/shared/components/Card'
import { ActionButton } from '@/shared/components/ActionButton'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { customerService } from '@/shared/services/api/customer.service'
import type { CustomerResponse } from '@/shared/services/api/customer.service'

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { showError, showSuccess } = useGlobalToast()
  
  const [customer, setCustomer] = useState<CustomerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [_isEditing, setIsEditing] = useState(false)

  const loadCustomer = useCallback(async (customerId: string) => {
    try {
      setLoading(true)
      const data = await customerService.get(customerId)
      setCustomer(data)
    } catch (error) {
      showError('Failed to load customer details')
      console.error('Error loading customer:', error)
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    if (id) {
      loadCustomer(id)
    }
  }, [id, loadCustomer])

  const _handleStatusUpdate = async (status: 'active' | 'inactive' | 'suspended' | 'cancelled', reason?: string) => {
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

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      suspended: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${variants[status as keyof typeof variants]}`}>
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white/10 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="w-48 h-6 bg-white/10 rounded animate-pulse" />
              <div className="w-32 h-4 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="w-full h-64 bg-white/5 rounded-lg animate-pulse" />
              <div className="w-full h-48 bg-white/5 rounded-lg animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="w-full h-48 bg-white/5 rounded-lg animate-pulse" />
              <div className="w-full h-32 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Customer Not Found</h3>
          <p className="text-gray-400 text-center mb-6">
            The customer you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
          <Link
            to="/customers"
            className="flex items-center gap-2 px-4 py-2 bg-[#D417C8] hover:bg-[#BD2CD0] text-white rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customers
          </Link>
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
            <Link
              to="/customers"
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base font-medium text-white mb-1">{customer.displayName}</h1>
              <p className="text-xs text-gray-400">{customer.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {getStatusBadge(customer.status)}
            <ActionButton
              label="Edit"
              icon={Edit}
              onClick={() => setIsEditing(true)}
              variant="secondary"
              size="sm"
            />
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
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
              <Card padding="md" className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#D417C8]/15 to-[#14BDEA]/15 rounded-lg border border-[#D417C8]/20">
                    <Building2 className="w-3.5 h-3.5 text-[#D417C8]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-medium text-white mb-1">Customer Information</h2>
                    <p className="text-xs text-gray-400 mb-4">
                      Core customer details and contact information
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-300">{customer.email}</span>
                        </div>
                        {customer.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-300">{customer.phoneNumber}</span>
                          </div>
                        )}
                        {customer.company && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-300">{customer.company}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-300">
                            Member since {formatDate(customer.signupDate)}
                          </span>
                        </div>
                        {customer.timezone && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-300">{customer.timezone}</span>
                          </div>
                        )}
                        {customer.locale && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-300">{customer.locale}</span>
                          </div>
                        )}
                      </div>
                    </div>
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
              <Card padding="md" className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#14BDEA]/15 to-[#7767DA]/15 rounded-lg border border-[#14BDEA]/20">
                    <MapPin className="w-3.5 h-3.5 text-[#14BDEA]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-medium text-white mb-1">Addresses</h2>
                    <p className="text-xs text-gray-400 mb-4">
                      Billing and shipping addresses
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customer.billingAddress && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Billing Address
                          </h3>
                          <div className="text-xs text-gray-400 space-y-1">
                            <div>{customer.billingAddress.line1}</div>
                            {customer.billingAddress.line2 && <div>{customer.billingAddress.line2}</div>}
                            <div>
                              {customer.billingAddress.city}, {customer.billingAddress.state} {customer.billingAddress.zipCode}
                            </div>
                            <div>{customer.billingAddress.country}</div>
                          </div>
                        </div>
                      )}
                      
                      {customer.shippingAddress && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Shipping Address
                          </h3>
                          <div className="text-xs text-gray-400 space-y-1">
                            <div>{customer.shippingAddress.line1}</div>
                            {customer.shippingAddress.line2 && <div>{customer.shippingAddress.line2}</div>}
                            <div>
                              {customer.shippingAddress.city}, {customer.shippingAddress.state} {customer.shippingAddress.zipCode}
                            </div>
                            <div>{customer.shippingAddress.country}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Tags and Custom Fields */}
            {(customer.tags.length > 0 || Object.keys(customer.customFields).length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card padding="md" className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-[#7767DA]/15 to-[#D417C8]/15 rounded-lg border border-[#7767DA]/20">
                      <Tag className="w-3.5 h-3.5 text-[#7767DA]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-sm font-medium text-white mb-1">Metadata</h2>
                      <p className="text-xs text-gray-400 mb-4">
                        Tags and custom fields
                      </p>
                      
                      <div className="space-y-4">
                        {customer.tags.length > 0 && (
                          <div>
                            <h3 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">
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
                            <h3 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">
                              Custom Fields
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
                    </div>
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
              <Card padding="md">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-emerald-500/15 to-emerald-400/15 rounded-lg border border-emerald-500/20">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-white mb-1">Quick Actions</h2>
                    <p className="text-xs text-gray-400">
                      Manage customer account
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <ActionButton
                    label="Send Email"
                    icon={Mail}
                    onClick={() => {/* TODO: Implement email */}}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  />
                  <ActionButton
                    label="View Notes"
                    icon={FileText}
                    onClick={() => {/* TODO: Implement notes */}}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  />
                  <ActionButton
                    label="Edit Details"
                    icon={Edit}
                    onClick={() => setIsEditing(true)}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  />
                </div>
              </Card>
            </motion.div>

            {/* Status Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card padding="md">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-amber-500/15 to-amber-400/15 rounded-lg border border-amber-500/20">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-white mb-1">Account Status</h2>
                    <p className="text-xs text-gray-400">
                      Customer account settings
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Portal Access</span>
                    <span className={`text-xs px-2 py-1 rounded-md ${
                      customer.portalAccess 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {customer.portalAccess ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Auto Collection</span>
                    <span className={`text-xs px-2 py-1 rounded-md ${
                      customer.autoCollection 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {customer.autoCollection ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {customer.lastActivityDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Last Activity</span>
                      <span className="text-xs text-gray-300">
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
    </DashboardLayout>
  )
}

export default CustomerDetailPage
