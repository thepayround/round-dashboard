import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Users,
  Eye,
  Edit,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MoreHorizontal,
  Loader2
} from 'lucide-react'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { Card } from '@/shared/components/Card'
import { ActionButton } from '@/shared/components/ActionButton'
import { SearchFilterToolbar, SectionHeader } from '@/shared/components'
import type { FilterField } from '@/shared/components'
import { useDebouncedSearch } from '@/shared/hooks/useDebouncedSearch'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { customerService } from '@/shared/services/api/customer.service'
import type { CustomerResponse, CustomerSearchParams } from '@/shared/services/api/customer.service'
import { AddCustomerModal } from '../components/AddCustomerModal'

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
      return 'bg-green-500/20 text-green-400 border border-green-500/30'
    case CustomerStatus.Inactive:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
    case CustomerStatus.Suspended:
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
    case CustomerStatus.Cancelled:
      return 'bg-red-500/20 text-red-400 border border-red-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }
}

const CustomersPage: React.FC = () => {
  const { showError, showSuccess } = useGlobalToast()
  
  const [customers, setCustomers] = useState<CustomerResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const pageSize = 12

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true)
      
      const searchParams: CustomerSearchParams = {
        pageNumber: currentPage,
        pageSize,
        orderBy: 'CreatedDate',
        isAscending: false
      }

      const response = await customerService.getAll(searchParams)
      setCustomers(response.items)
      setTotalCount(response.totalCount)
    } catch (error) {
      showError('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, showError])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  // Search fields extraction function
  const getCustomerSearchFields = useCallback((customer: CustomerResponse): string[] => [
    customer.email ?? '',
    customer.firstName ?? '',
    customer.lastName ?? '',
    customer.displayName ?? '',
    customer.company ?? '',
    customer.phoneNumber ?? '',
    customer.status ?? '',
    ...(customer.tags ?? [])
  ], [])

  // Use debounced search
  const {
    searchQuery,
    setSearchQuery,
    filteredItems: filteredCustomers
  } = useDebouncedSearch({
    items: customers,
    searchFields: getCustomerSearchFields,
    debounceMs: 300
  })

  const formatDate = (dateString: string) => new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString))

  const getInitials = (displayName: string) => displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

  const handleCustomerAdded = () => {
    loadCustomers()
    setShowAddModal(false)
    showSuccess('Customer added successfully')
  }

  // Filter fields for the search toolbar
  const filterFields: FilterField[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: '',
      onChange: (_value: string) => {
        // TODO: Implement status filter
      },
      options: [
        { id: 'active', name: 'Active' },
        { id: 'inactive', name: 'Inactive' },
        { id: 'suspended', name: 'Suspended' },
        { id: 'cancelled', name: 'Cancelled' }
      ]
    },
    {
      id: 'currency',
      label: 'Currency',
      type: 'select',
      value: '',
      onChange: (_value: string) => {
        // TODO: Implement currency filter
      },
      options: [
        { id: 'USD', name: 'USD' },
        { id: 'EUR', name: 'EUR' },
        { id: 'GBP', name: 'GBP' },
        { id: 'CAD', name: 'CAD' }
      ]
    },
    {
      id: 'portalAccess',
      label: 'Portal Access',
      type: 'select',
      value: '',
      onChange: (_value: string) => {
        // TODO: Implement portal access filter
      },
      options: [
        { id: 'true', name: 'Enabled' },
        { id: 'false', name: 'Disabled' }
      ]
    }
  ]

  if (loading && customers.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="w-48 h-8 bg-white/10 rounded animate-pulse" />
              <div className="w-64 h-4 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="w-32 h-10 bg-white/10 rounded-lg animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl" />
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-white/10 rounded" />
                      <div className="w-32 h-3 bg-white/10 rounded" />
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-lg" />
                </div>
                
                <div className="space-y-3">
                  <div className="w-full h-3 bg-white/10 rounded" />
                  <div className="w-3/4 h-3 bg-white/10 rounded" />
                  <div className="w-1/2 h-3 bg-white/10 rounded" />
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
        <SectionHeader
          title="Customers"
          subtitle={`Manage your ${totalCount} customers and their information`}
          actions={
            <ActionButton
              label="Add Customer"
              variant="primary"
              size="md"
              onClick={() => setShowAddModal(true)}
            />
          }
        />

        <SearchFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search customers by name, email, company, phone, or tags..."
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filterFields={filterFields}
        />

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative"
            >
              <Card className="h-full p-6 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D417C8] to-[#14BDEA] flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(customer.displayName)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-[#D417C8] transition-colors">
                        {customer.displayName}
                      </h3>
                      {customer.company && (
                        <p className="text-sm text-white/60">{customer.company}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <Mail className="w-4 h-4 text-[#14BDEA]" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  
                  {customer.phoneNumber && (
                    <div className="flex items-center space-x-2 text-sm text-white/70">
                      <Phone className="w-4 h-4 text-[#42E695]" />
                      <span>{customer.phoneNumber}</span>
                    </div>
                  )}
                  
                  {customer.billingAddress && (
                    <div className="flex items-center space-x-2 text-sm text-white/70">
                      <MapPin className="w-4 h-4 text-[#FFC107]" />
                      <span className="truncate">
                        {customer.billingAddress.city}, {customer.billingAddress.country}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <Calendar className="w-4 h-4 text-[#7767DA]" />
                    <span>Joined {formatDate(customer.signupDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(customer.status)}`}>
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
                      {customer.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#7767DA]/20 text-[#7767DA] border border-[#7767DA]/30 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {customer.tags.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 text-white/60 rounded text-xs">
                          +{customer.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
              <Users className="w-12 h-12 text-white/50" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No customers found</h3>
            <p className="text-white/60 mb-6">
              {searchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first customer'}
            </p>
            {!searchQuery && (
              <ActionButton
                label="Add Customer"
                variant="primary"
                size="md"
                onClick={() => setShowAddModal(true)}
              />
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && customers.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3 text-white/60">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-white">Loading customers...</span>
            </div>
          </div>
        )}

        {/* Add Customer Modal */}
        <AddCustomerModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCustomerAdded={handleCustomerAdded}
        />
      </div>
    </DashboardLayout>
  )
}

export default CustomersPage
