import React, { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Download, 
  Eye,
  Edit,
  Building2,
  DollarSign,
  TrendingUp,
  Clock,
  MoreHorizontal,
  Table,
  Grid3X3
} from 'lucide-react'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { Card, ActionButton, SearchFilterToolbar, SectionHeader } from '@/shared/components'
import type { ViewMode, FilterField } from '@/shared/components'
import type { Customer, CustomerFilters, CustomerMetrics } from '../types/customer.types'
import { useDebouncedSearch } from '@/shared/hooks/useDebouncedSearch'

const CustomersPage: React.FC = () => {
  const [filters, _setFilters] = useState<CustomerFilters>({})
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data
  const mockCustomers = useMemo((): Customer[] => [
    {
      id: '1',
      email: 'john.doe@acmecorp.com',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      company: 'Acme Corporation',
      phone: '+1-555-0123',
      status: 'active' as const,
      billingAddress: {
        line1: '123 Business St',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        zip: '94105'
      },
      subscriptions: [
        {
          id: 'sub1',
          planId: '1',
          planName: 'Professional Plan',
          status: 'active' as const,
          currentTermStart: new Date('2024-01-01'),
          currentTermEnd: new Date('2024-12-31'),
          nextBillingDate: new Date('2024-08-01'),
          mrr: 99,
          currency: 'USD',
          billingPeriod: 'monthly' as const,
          addons: [],
          coupons: [],
          createdAt: new Date('2024-01-01')
        }
      ],
      totalMRR: 99,
      totalLTV: 1188,
      accountBalance: 0,
      creditBalance: 0,
      unbilledCharges: 0,
      signupDate: new Date('2024-01-01'),
      lastActivityDate: new Date('2024-07-20'),
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
      tags: ['enterprise', 'high-value'],
      customFields: {},
      notes: [],
      currency: 'USD',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-07-20')
    },
    {
      id: '2',
      email: 'sarah.smith@techstart.io',
      firstName: 'Sarah',
      lastName: 'Smith',
      displayName: 'Sarah Smith',
      company: 'TechStart.io',
      phone: '+1-555-0456',
      status: 'active' as const,
      billingAddress: {
        line1: '456 Startup Ave',
        city: 'Austin',
        state: 'TX',
        country: 'US',
        zip: '73301'
      },
      subscriptions: [
        {
          id: 'sub2',
          planId: '2',
          planName: 'Starter Plan',
          status: 'trialing' as const,
          currentTermStart: new Date('2024-07-15'),
          currentTermEnd: new Date('2024-08-15'),
          mrr: 29,
          currency: 'USD',
          billingPeriod: 'monthly' as const,
          addons: [],
          coupons: [],
          trialEnd: new Date('2024-08-15'),
          createdAt: new Date('2024-07-15')
        }
      ],
      totalMRR: 29,
      totalLTV: 348,
      accountBalance: 0,
      creditBalance: 50,
      unbilledCharges: 0,
      signupDate: new Date('2024-07-15'),
      trialEndDate: new Date('2024-08-15'),
      lastActivityDate: new Date('2024-07-23'),
      churnRisk: 'medium' as const,
      emailPreferences: {
        invoices: true,
        subscriptionUpdates: true,
        marketingEmails: true,
        paymentFailures: true,
        trialReminders: true
      },
      portalAccess: true,
      autoCollection: true,
      tags: ['trial', 'startup'],
      customFields: {},
      notes: [],
      currency: 'USD',
      createdAt: new Date('2024-07-15')
    },
    {
      id: '3',
      email: 'mike.johnson@globaltech.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      displayName: 'Mike Johnson',
      company: 'GlobalTech Solutions',
      phone: '+1-555-0789',
      status: 'suspended' as const,
      billingAddress: {
        line1: '789 Enterprise Blvd',
        city: 'New York',
        state: 'NY',
        country: 'US',
        zip: '10001'
      },
      subscriptions: [
        {
          id: 'sub3',
          planId: '3',
          planName: 'Enterprise Plan',
          status: 'paused' as const,
          currentTermStart: new Date('2024-01-01'),
          currentTermEnd: new Date('2024-12-31'),
          mrr: 499,
          currency: 'USD',
          billingPeriod: 'monthly' as const,
          addons: [],
          coupons: [],
          pausedAt: new Date('2024-06-15'),
          createdAt: new Date('2024-01-01')
        }
      ],
      totalMRR: 0,
      totalLTV: 2495,
      accountBalance: -150,
      creditBalance: 0,
      unbilledCharges: 75,
      signupDate: new Date('2024-01-01'),
      lastActivityDate: new Date('2024-06-10'),
      churnRisk: 'high' as const,
      emailPreferences: {
        invoices: true,
        subscriptionUpdates: true,
        marketingEmails: false,
        paymentFailures: true,
        trialReminders: false
      },
      portalAccess: false,
      autoCollection: false,
      tags: ['enterprise', 'payment-issues'],
      customFields: {},
      notes: [
        {
          id: 'note1',
          content: 'Payment failed multiple times. Reached out via phone.',
          author: 'Support Team',
          isInternal: true,
          createdAt: new Date('2024-06-15')
        }
      ],
      currency: 'USD',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-06-15')
    }
  ], [])

  // Search fields extraction function - Memoized for stability
  const getCustomerSearchFields = useCallback((customer: Customer): string[] => [
    customer.displayName ?? '',
    customer.email ?? '',
    customer.company ?? '',
    customer.id ?? ''
  ], [])

  // Filter function for additional filters - Stable implementation
  const customerFilterFn = useCallback((customer: Customer, filters: CustomerFilters): boolean => {
    if (filters.status?.length && !filters.status.includes(customer.status)) {
      return false
    }

    if (filters.churnRisk?.length && !filters.churnRisk.includes(customer.churnRisk)) {
      return false
    }

    return true
  }, [])

  // Focus-safe debounced search
  const {
    searchQuery,
    setSearchQuery,
    filteredItems: filteredCustomers,
    isSearching,
    clearSearch,
    totalCount,
    filteredCount
  } = useDebouncedSearch({
    items: mockCustomers,
    searchFields: getCustomerSearchFields,
    debounceMs: 300,
    filters,
    filterFn: customerFilterFn
  })

  const customerMetrics: CustomerMetrics = {
    totalCustomers: mockCustomers.length,
    activeCustomers: mockCustomers.filter(c => c.status === 'active').length,
    trialingCustomers: mockCustomers.filter(c => c.subscriptions.some(s => s.status === 'trialing')).length,
    churnedCustomers: mockCustomers.filter(c => c.status === 'cancelled').length,
    avgMRR: mockCustomers.reduce((sum, c) => sum + c.totalMRR, 0) / mockCustomers.length,
    avgLTV: mockCustomers.reduce((sum, c) => sum + c.totalLTV, 0) / mockCustomers.length,
    churnRate: 5.2,
    reactivationRate: 12.8,
    trialConversionRate: 68.5
  }

  const filterFields: FilterField[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: '', // You can manage this with state
      onChange: (_value) => {
        // Handle status filter change
      },
      options: [
        { id: 'all', name: 'All Statuses' },
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
        { id: 'suspended', name: 'Suspended' },
        { id: 'cancelled', name: 'Cancelled' }
      ]
    },
    {
      id: 'churnRisk',
      label: 'Churn Risk',
      type: 'select',
      value: '',
      onChange: (_value) => {
        // Handle churn risk filter change
      },
      options: [
        { id: 'all', name: 'All Risk Levels' },
        { id: 'low', name: 'Low Risk' },
        { id: 'medium', name: 'Medium Risk' },
        { id: 'high', name: 'High Risk' }
      ]
    },
    {
      id: 'plan',
      label: 'Plan',
      type: 'select',
      value: '',
      onChange: (_value) => {
        // Handle plan filter change
      },
      options: [
        { id: 'all', name: 'All Plans' },
        { id: '1', name: 'Starter Plan' },
        { id: '2', name: 'Professional Plan' },
        { id: '3', name: 'Enterprise Plan' }
      ]
    },
    {
      id: 'country',
      label: 'Country',
      type: 'select',
      value: '',
      onChange: (_value) => {
        // Handle country filter change
      },
      options: [
        { id: 'all', name: 'All Countries' },
        { id: 'US', name: 'United States' },
        { id: 'CA', name: 'Canada' },
        { id: 'GB', name: 'United Kingdom' },
        { id: 'DE', name: 'Germany' }
      ]
    }
  ]

  const getStatusBadge = (status: Customer['status']) => {
    const statusConfig = {
      active: { 
        class: 'bg-[#42E695]/20 text-[#42E695] border border-[#42E695]/30', 
        label: 'Active' 
      },
      inactive: { 
        class: 'bg-[#FFC107]/20 text-[#FFC107] border border-[#FFC107]/30', 
        label: 'Inactive' 
      },
      suspended: { 
        class: 'bg-red-500/20 text-red-300 border border-red-400/30', 
        label: 'Suspended' 
      },
      cancelled: { 
        class: 'bg-gray-500/20 text-gray-400 border border-gray-500/30', 
        label: 'Cancelled' 
      }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    )
  }

  const getChurnRiskBadge = (risk: Customer['churnRisk']) => {
    const riskConfig = {
      low: { 
        class: 'bg-[#42E695]/20 text-[#42E695] border border-[#42E695]/30', 
        label: 'Low Risk' 
      },
      medium: { 
        class: 'bg-[#FFC107]/20 text-[#FFC107] border border-[#FFC107]/30', 
        label: 'Medium Risk' 
      },
      high: { 
        class: 'bg-red-500/20 text-red-300 border border-red-400/30', 
        label: 'High Risk' 
      }
    }
    
    const config = riskConfig[risk]
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <SectionHeader
          title="Customer Management"
          subtitle="Manage and track your customer relationships"
          size="main"
          actions={
            <div className="flex items-center gap-2 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary px-3 sm:px-6 py-2.5 sm:py-3 flex items-center text-sm touch-target"
              >
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </motion.button>
              <ActionButton
                label="Add Customer"
                onClick={() => { /* Add customer clicked */ }}
                size="md"
                animated={false}
              />
            </div>
          }
        />

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8"
        >
          <Card
            variant="compact"
            title="Total Customers"
            value={customerMetrics.totalCustomers}
            icon={Users}
            color="success"
            animate={false}
          />

          <Card
            variant="compact"
            title="Active Customers"
            value={customerMetrics.activeCustomers}
            icon={TrendingUp}
            color="secondary"
            trend={{
              value: "+5.2%",
              direction: "up",
              label: "vs last month"
            }}
            animate={false}
          />

          <Card
            variant="compact"
            title="Avg MRR"
            value={formatCurrency(customerMetrics.avgMRR)}
            icon={DollarSign}
            color="warning"
            trend={{
              value: "+12.4%",
              direction: "up",
              label: "vs last month"
            }}
            animate={false}
          />

          <Card
            variant="compact"
            title="Avg LTV"
            value={formatCurrency(customerMetrics.avgLTV)}
            icon={Clock}
            color="accent"
            trend={{
              value: "+8.7%",
              direction: "up",
              label: "vs last month"
            }}
            animate={false}
          />

          <Card
            variant="compact"
            title="Churn Rate"
            value={`${customerMetrics.churnRate}%`}
            icon={TrendingUp}
            color="danger"
            trend={{
              value: "+1.2%",
              direction: "up",
              label: "vs last month"
            }}
            animate={false}
          />
        </motion.div>

        {/* Search and Filters */}
        <SearchFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search customers by name, email, or company..."
          isSearching={isSearching}
          onClearSearch={clearSearch}
          searchResults={{
            total: totalCount,
            filtered: filteredCount
          }}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filterFields={filterFields}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          viewModeOptions={[
            { value: 'table', icon: Table, label: 'Table' },
            { value: 'grid', icon: Grid3X3, label: 'Grid' }
          ]}
          className="mb-6"
        />

        {/* Customer Table/Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card animate={false}>
          {viewMode === 'table' ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left py-4 px-6 text-sm font-medium auth-text-muted">Customer</th>
                      <th className="text-left py-4 px-6 text-sm font-medium auth-text-muted">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-medium auth-text-muted">MRR</th>
                      <th className="text-left py-4 px-6 text-sm font-medium auth-text-muted">LTV</th>
                      <th className="text-left py-4 px-6 text-sm font-medium auth-text-muted">Churn Risk</th>
                      <th className="text-right py-4 px-6 text-sm font-medium auth-text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#14BDEA] to-[#7767DA] rounded-full flex items-center justify-center text-white font-semibold">
                              {customer.firstName[0]}{customer.lastName[0]}
                            </div>
                            <div>
                              <p className="auth-text font-medium">{customer.displayName}</p>
                              <p className="auth-text-muted text-sm">{customer.email}</p>
                              {customer.company && (
                                <div className="text-xs auth-text-muted flex items-center gap-1 mt-1">
                                  <Building2 className="w-3 h-3" />
                                  {customer.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(customer.status as Customer['status'])}
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="auth-text font-semibold">{formatCurrency(customer.totalMRR)}</p>
                            <p className="auth-text-muted text-sm">
                              {customer.subscriptions.length} subscription{customer.subscriptions.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="auth-text font-semibold">{formatCurrency(customer.totalLTV)}</p>
                            <p className="auth-text-muted text-sm">Since {formatDate(customer.signupDate)}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {getChurnRiskBadge(customer.churnRisk as Customer['churnRisk'])}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/customers/${customer.id}`}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors touch-target"
                            >
                              <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                            </Link>
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors touch-target">
                              <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors touch-target">
                              <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden space-y-4 p-4 sm:p-6">
                {filteredCustomers.map((customer) => (
                  <div 
                    key={customer.id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-200"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#14BDEA] to-[#7767DA] rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                          {customer.firstName[0]}{customer.lastName[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="auth-text font-semibold truncate">{customer.displayName}</h3>
                          <p className="auth-text-muted text-sm truncate">{customer.email}</p>
                          {customer.company && (
                            <div className="text-xs auth-text-muted flex items-center gap-1 mt-1">
                              <Building2 className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{customer.company}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        {getStatusBadge(customer.status as Customer['status'])}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      <div className="text-center sm:text-left">
                        <div className="text-xs auth-text-muted mb-1">MRR</div>
                        <div className="auth-text font-semibold text-sm">{formatCurrency(customer.totalMRR)}</div>
                        <div className="auth-text-muted text-xs mt-1">
                          {customer.subscriptions.length} sub{customer.subscriptions.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="text-xs auth-text-muted mb-1">LTV</div>
                        <div className="auth-text font-semibold text-sm">{formatCurrency(customer.totalLTV)}</div>
                        <div className="auth-text-muted text-xs mt-1">Since {formatDate(customer.signupDate)}</div>
                      </div>
                      <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
                        <div className="text-xs auth-text-muted mb-2">Churn Risk</div>
                        <div className="flex justify-center sm:justify-start">
                          {getChurnRiskBadge(customer.churnRisk as Customer['churnRisk'])}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-700/50">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="flex-1 btn-primary text-center flex items-center justify-center gap-2 py-2.5 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                      <button className="btn-secondary p-2.5 touch-target">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="btn-secondary p-2.5 touch-target">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} animate={false}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#14BDEA] to-[#7767DA] rounded-full flex items-center justify-center text-white font-semibold">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="auth-text font-semibold truncate">{customer.displayName}</h3>
                        <p className="auth-text-muted text-sm truncate">{customer.email}</p>
                      </div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      {getStatusBadge(customer.status as Customer['status'])}
                    </div>
                  </div>

                  {customer.company && (
                    <div className="flex items-center gap-2 mb-3 text-sm auth-text-muted">
                      <Building2 className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{customer.company}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm auth-text-muted">MRR</div>
                      <div className="auth-text font-semibold">{formatCurrency(customer.totalMRR)}</div>
                    </div>
                    <div>
                      <div className="text-sm auth-text-muted">LTV</div>
                      <div className="auth-text font-semibold">{formatCurrency(customer.totalLTV)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="auth-text-muted">Risk: </span>
                      {getChurnRiskBadge(customer.churnRisk as Customer['churnRisk'])}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-700/50">
                    <Link
                      to={`/customers/${customer.id}`}
                      className="flex-1 btn-primary text-center flex items-center justify-center gap-2 touch-target"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Link>
                    <button className="btn-secondary p-3 touch-target">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          </Card>
        </motion.div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="text-center py-12" animate={false}>
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="auth-text text-xl font-semibold mb-2">No customers found</h3>
            <p className="auth-text-muted mb-6">
              {searchQuery || Object.keys(filters).length > 0
                ? "Try adjusting your search or filters"
                : "Get started by adding your first customer"
              }
            </p>
            <ActionButton
              label="Add Customer"
              onClick={() => { /* Add customer clicked */ }}
              size="md"
              animated={false}
            />
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default CustomersPage
