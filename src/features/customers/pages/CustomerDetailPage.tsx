import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Building2,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  AlertTriangle,
  Tag,
  Users,
  Activity,
  Download,
  Plus,
  Pause,
  Play,
  X,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import type { Customer, CustomerInvoice, CustomerPayment, CustomerSubscription} from '../types/customer.types'

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'invoices' | 'payments' | 'usage' | 'notes'>('overview')
  const [loading, setLoading] = useState(true)

  // Mock customer data
  const mockCustomer = useMemo(() => ({
    id: '1',
    email: 'john.doe@acmecorp.com',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John Doe',
    company: 'Acme Corporation',
    phone: '+1-555-0123',
    taxNumber: 'TX123456789',
    locale: 'en-US',
    timezone: 'America/New_York',
    status: 'active' as const,
    billingAddress: {
      line1: '123 Business St',
      line2: 'Suite 100',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      zip: '94105'
    },
    shippingAddress: {
      line1: '123 Business St',
      line2: 'Suite 100',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      zip: '94105'
    },
    paymentMethod: {
      id: 'pm1',
      type: 'card' as const,
      gateway: 'stripe',
      status: 'valid' as const,
      cardType: 'visa' as const,
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      createdAt: new Date('2024-01-01')
    },
    subscriptions: [
      {
        id: 'sub1',
        planId: '2',
        planName: 'Professional Plan',
        status: 'active' as const,
        currentTermStart: new Date('2024-07-01'),
        currentTermEnd: new Date('2024-08-01'),
        nextBillingDate: new Date('2024-08-01'),
        mrr: 99,
        currency: 'USD',
        billingPeriod: 'monthly' as const,
        addons: [
          {
            id: 'addon1',
            addonId: '1',
            addonName: 'Advanced Analytics',
            quantity: 1,
            unitPrice: 49,
            amount: 49
          }
        ],
        coupons: [],
        createdAt: new Date('2024-01-01')
      }
    ],
    totalMRR: 148,
    totalLTV: 1776,
    accountBalance: 0,
    creditBalance: 25,
    unbilledCharges: 0,
    signupDate: new Date('2024-01-01'),
    lastActivityDate: new Date('2024-07-23'),
    churnRisk: 'low' as const,
    emailPreferences: {
      invoices: true,
      subscriptionUpdates: true,
      marketingEmails: false,
      paymentFailures: true,
      trialReminders: true
    },
    portalAccess: true,
    autoCollection: true,
    tags: ['enterprise', 'high-value', 'priority'],
    customFields: {
      accountManager: 'Sarah Wilson',
      contractEndDate: '2024-12-31',
      industry: 'Technology'
    },
    notes: [
      {
        id: 'note1',
        content: 'Customer expressed interest in Enterprise plan during last call. Follow up in Q4.',
        author: 'Sarah Wilson',
        isInternal: true,
        createdAt: new Date('2024-07-15')
      },
      {
        id: 'note2',
        content: 'Payment successful. Thank you for your business!',
        author: 'System',
        isInternal: false,
        createdAt: new Date('2024-07-01')
      }
    ],
    currency: 'USD',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-07-23')
  }), [])

  const mockInvoices: CustomerInvoice[] = [
    {
      id: 'inv1',
      invoiceNumber: 'INV-001',
      status: 'paid',
      amount: 148,
      amountPaid: 148,
      amountDue: 0,
      currency: 'USD',
      issueDate: new Date('2024-07-01'),
      dueDate: new Date('2024-07-15'),
      paidAt: new Date('2024-07-01'),
      description: 'Monthly subscription',
      downloadUrl: '/invoices/inv1.pdf'
    },
    {
      id: 'inv2',
      invoiceNumber: 'INV-002',
      status: 'paid',
      amount: 148,
      amountPaid: 148,
      amountDue: 0,
      currency: 'USD',
      issueDate: new Date('2024-06-01'),
      dueDate: new Date('2024-06-15'),
      paidAt: new Date('2024-06-01'),
      description: 'Monthly subscription'
    }
  ]

  const mockPayments: CustomerPayment[] = [
    {
      id: 'pay1',
      amount: 148,
      currency: 'USD',
      paymentMethod: 'Visa ending in 4242',
      status: 'succeeded',
      invoiceId: 'inv1',
      processedAt: new Date('2024-07-01'),
      gatewayTransactionId: 'ch_1234567890'
    },
    {
      id: 'pay2',
      amount: 148,
      currency: 'USD',
      paymentMethod: 'Visa ending in 4242',
      status: 'succeeded',
      invoiceId: 'inv2',
      processedAt: new Date('2024-06-01'),
      gatewayTransactionId: 'ch_0987654321'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomer(mockCustomer)
      setLoading(false)
    }, 1000)
  }, [id, mockCustomer])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="skeleton h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton h-64" />
            <div className="skeleton h-96" />
          </div>
          <div className="space-y-6">
            <div className="skeleton h-80" />
            <div className="skeleton h-48" />
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="empty-state">
        <Users className="empty-state-icon" />
        <h3 className="empty-state-title">Customer not found</h3>
        <p className="empty-state-description">The customer you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/customers" className="btn-primary-enhanced">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customers
        </Link>
      </div>
    )
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)

  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)

  const getStatusBadge = (status: Customer['status']) => {
    const statusConfig = {
      active: { class: 'status-active', label: 'Active' },
      inactive: { class: 'status-inactive', label: 'Inactive' },
      suspended: { class: 'bg-red-500/20 border-red-400/30 text-red-300', label: 'Suspended' },
      cancelled: { class: 'status-archived', label: 'Cancelled' }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`status-badge ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const getChurnRiskBadge = (risk: Customer['churnRisk']) => {
    const riskConfig = {
      low: { class: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300', label: 'Low Risk', icon: CheckCircle },
      medium: { class: 'bg-amber-500/20 border-amber-400/30 text-amber-300', label: 'Medium Risk', icon: AlertCircle },
      high: { class: 'bg-red-500/20 border-red-400/30 text-red-300', label: 'High Risk', icon: AlertTriangle }
    }
    
    const config = riskConfig[risk]
    const Icon = config.icon
    return (
      <span className={`status-badge ${config.class} flex items-center gap-1.5`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  const getSubscriptionStatusBadge = (status: CustomerSubscription['status']) => {
    const statusConfig = {
      active: { class: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300', label: 'Active' },
      trialing: { class: 'bg-blue-500/20 border-blue-400/30 text-blue-300', label: 'Trial' },
      paused: { class: 'bg-amber-500/20 border-amber-400/30 text-amber-300', label: 'Paused' },
      cancelled: { class: 'bg-gray-500/20 border-gray-400/30 text-gray-300', label: 'Cancelled' },
      expired: { class: 'bg-red-500/20 border-red-400/30 text-red-300', label: 'Expired' }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`status-badge ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const getInvoiceStatusBadge = (status: CustomerInvoice['status']) => {
    const statusConfig = {
      paid: { class: 'status-active', label: 'Paid' },
      open: { class: 'bg-blue-500/20 border-blue-400/30 text-blue-300', label: 'Open' },
      overdue: { class: 'bg-red-500/20 border-red-400/30 text-red-300', label: 'Overdue' },
      draft: { class: 'status-inactive', label: 'Draft' },
      voided: { class: 'status-archived', label: 'Voided' },
      partially_paid: { class: 'bg-amber-500/20 border-amber-400/30 text-amber-300', label: 'Partially Paid' }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`status-badge ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'usage', label: 'Usage', icon: Activity },
    { id: 'notes', label: 'Notes', icon: Edit }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/customers"
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold auth-text mb-2">{customer.displayName}</h1>
            <p className="auth-text-muted text-lg">{customer.email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn-secondary-enhanced flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button className="btn-primary-enhanced flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Customer
          </button>
        </div>
      </div>

      {/* Customer Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="metric-value">{formatCurrency(customer.totalMRR)}</div>
          <div className="metric-label">Monthly Recurring Revenue</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{formatCurrency(customer.totalLTV)}</div>
          <div className="metric-label">Lifetime Value</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{customer.subscriptions.length}</div>
          <div className="metric-label">Active Subscriptions</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{formatCurrency(customer.accountBalance)}</div>
          <div className="metric-label">Account Balance</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="card-enhanced">
            <div className="border-b border-gray-700/50">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'overview' | 'subscriptions' | 'invoices' | 'payments' | 'usage' | 'notes')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{customer.phone}</span>
                          </div>
                        )}
                        {customer.company && (
                          <div className="flex items-center gap-3">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{customer.company}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">Customer since {formatDate(customer.signupDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Status & Risk</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Status</span>
                          {getStatusBadge(customer.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Churn Risk</span>
                          {getChurnRiskBadge(customer.churnRisk)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Portal Access</span>
                          <span className={`status-badge ${customer.portalAccess ? 'status-active' : 'status-inactive'}`}>
                            {customer.portalAccess ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {customer.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {customer.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Fields */}
                  {Object.keys(customer.customFields).length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Custom Fields</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(customer.customFields).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-gray-300">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Subscriptions Tab */}
              {activeTab === 'subscriptions' && (
                <div className="space-y-4">
                  {customer.subscriptions.map((subscription) => (
                    <div key={subscription.id} className="border border-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{subscription.planName}</h4>
                          <p className="text-gray-400">ID: {subscription.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {getSubscriptionStatusBadge(subscription.status)}
                          <div className="flex items-center gap-1">
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            {subscription.status === 'active' && (
                              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                                <Pause className="w-4 h-4" />
                              </button>
                            )}
                            {subscription.status === 'paused' && (
                              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400">MRR</div>
                          <div className="font-semibold text-white">{formatCurrency(subscription.mrr)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Billing Period</div>
                          <div className="text-gray-300 capitalize">{subscription.billingPeriod}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Next Billing</div>
                          <div className="text-gray-300">
                            {subscription.nextBillingDate ? formatDate(subscription.nextBillingDate) : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {subscription.addons.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-2">Add-ons</h5>
                          <div className="space-y-2">
                            {subscription.addons.map((addon) => (
                              <div key={addon.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-300">{addon.addonName} (x{addon.quantity})</span>
                                <span className="text-gray-300">{formatCurrency(addon.amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Invoices Tab */}
              {activeTab === 'invoices' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Invoices</h3>
                    <button className="btn-primary-enhanced flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Create Invoice
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {mockInvoices.map((invoice) => (
                      <div key={invoice.id} className="border border-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-white">{invoice.invoiceNumber}</h4>
                              {getInvoiceStatusBadge(invoice.status)}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{invoice.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-white">{formatCurrency(invoice.amount)}</div>
                            <div className="text-sm text-gray-400">{formatDate(invoice.issueDate)}</div>
                          </div>
                        </div>
                        
                        {invoice.downloadUrl && (
                          <div className="mt-3 pt-3 border-t border-gray-700/30">
                            <button className="btn-secondary-enhanced text-sm flex items-center gap-2">
                              <Download className="w-3 h-3" />
                              Download PDF
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Payment History</h3>
                    <button className="btn-primary-enhanced flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Record Payment
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {mockPayments.map((payment) => (
                      <div key={payment.id} className="border border-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <div className="font-semibold text-white">{formatCurrency(payment.amount)}</div>
                              <span className={`status-badge ${payment.status === 'succeeded' ? 'status-active' : 'bg-red-500/20 border-red-400/30 text-red-300'}`}>
                                {payment.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{payment.paymentMethod}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">{formatDate(payment.processedAt)}</div>
                            {payment.gatewayTransactionId && (
                              <div className="text-xs text-gray-500">ID: {payment.gatewayTransactionId}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage Tab */}
              {activeTab === 'usage' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Usage Analytics</h3>
                  <div className="empty-state py-8">
                    <Activity className="empty-state-icon" />
                    <h4 className="empty-state-title">No usage data available</h4>
                    <p className="empty-state-description">
                      Usage tracking is not enabled for this customer&apos;s subscriptions.
                    </p>
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Customer Notes</h3>
                    <button className="btn-primary-enhanced flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Note
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {customer.notes.map((note) => (
                      <div key={note.id} className="border border-gray-700/50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{note.author}</span>
                            {note.isInternal && (
                              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded text-xs">
                                Internal
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(note.createdAt)}</span>
                        </div>
                        <p className="text-gray-300">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card-enhanced p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-secondary-enhanced flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Send Email
              </button>
              <button className="w-full btn-secondary-enhanced flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" />
                Update Payment Method
              </button>
              <button className="w-full btn-secondary-enhanced flex items-center justify-center gap-2">
                <DollarSign className="w-4 h-4" />
                Apply Credit
              </button>
              <button className="w-full btn-secondary-enhanced flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Generate Invoice
              </button>
            </div>
          </div>

          {/* Billing Address */}
          <div className="card-enhanced p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Billing Address</h3>
            <div className="space-y-2 text-sm">
              <div className="text-gray-300">{customer.billingAddress.line1}</div>
              {customer.billingAddress.line2 && (
                <div className="text-gray-300">{customer.billingAddress.line2}</div>
              )}
              <div className="text-gray-300">
                {customer.billingAddress.city}, {customer.billingAddress.state} {customer.billingAddress.zip}
              </div>
              <div className="text-gray-300">{customer.billingAddress.country}</div>
            </div>
          </div>

          {/* Payment Method */}
          {customer.paymentMethod && (
            <div className="card-enhanced p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium capitalize">
                    {customer.paymentMethod.cardType} •••• {customer.paymentMethod.last4}
                  </div>
                  <div className="text-sm text-gray-400">
                    Expires {customer.paymentMethod.expiryMonth}/{customer.paymentMethod.expiryYear}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <span className={`status-badge ${customer.paymentMethod.status === 'valid' ? 'status-active' : 'bg-red-500/20 border-red-400/30 text-red-300'}`}>
                  {customer.paymentMethod.status}
                </span>
              </div>
            </div>
          )}

          {/* Account Balance */}
          <div className="card-enhanced p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Balance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Balance</span>
                <span className={`font-semibold ${customer.accountBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(customer.accountBalance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Credit Balance</span>
                <span className="font-semibold text-emerald-400">
                  {formatCurrency(customer.creditBalance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Unbilled Charges</span>
                <span className="font-semibold text-gray-300">
                  {formatCurrency(customer.unbilledCharges)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetailPage
