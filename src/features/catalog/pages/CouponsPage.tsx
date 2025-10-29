import { motion } from 'framer-motion'
import { 
  Ticket, 
  Grid3X3,
  List,
  DollarSign,
  Users,
  Package
} from 'lucide-react'
import { useState, useCallback } from 'react'
import { useDebouncedSearch } from '../../../shared/hooks/useDebouncedSearch'
import { Link } from 'react-router-dom'

import { DashboardLayout } from '../../../shared/components/DashboardLayout'
import { CouponCard, CreateCouponModal } from '../components'
import { ActionButton, Card, SearchFilterToolbar } from '../../../shared/components'
import type { ViewMode, FilterField } from '../../../shared/components'
import type { Coupon, CatalogViewMode } from '../types/catalog.types'

export const CouponsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<CatalogViewMode>('grid')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - replace with API calls
  const coupons: Coupon[] = [
    {
      id: '1',
      name: 'New Customer Discount',
      couponCode: 'NEWCUSTOMER20',
      description: '20% off first month for new customers',
      discountType: 'percentage',
      discountValue: 20,
      durationType: 'one_time',
      maxRedemptions: 1000,
      currentRedemptions: 245,
      status: 'active',
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2024-12-31'),
      restrictions: {
        firstTimeCustomersOnly: true
      },
      customerEligibility: {
        allCustomers: true
      },
      stackable: false,
      autoApply: false,
      createdAt: new Date('2023-12-15'),
      updatedAt: new Date('2024-03-10')
    },
    {
      id: '2',
      name: 'Annual Plan Savings',
      couponCode: 'ANNUAL50',
      description: '$50 off annual subscriptions',
      discountType: 'fixed_amount',
      discountValue: 50,
      durationType: 'one_time',
      maxRedemptions: 500,
      currentRedemptions: 123,
      status: 'active',
      validFrom: new Date('2024-02-01'),
      validUntil: new Date('2024-11-30'),
      restrictions: {
        minimumOrderValue: 200
      },
      customerEligibility: {
        allCustomers: true
      },
      stackable: false,
      autoApply: false,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-03-05')
    },
    {
      id: '3',
      name: 'Black Friday Special',
      couponCode: 'BLACKFRIDAY30',
      description: '30% off all plans for Black Friday',
      discountType: 'percentage',
      discountValue: 30,
      durationType: 'limited_period',
      duration: 3,
      maxRedemptions: 2000,
      currentRedemptions: 1892,
      status: 'expired',
      validFrom: new Date('2023-11-24'),
      validUntil: new Date('2023-11-27'),
      restrictions: {},
      customerEligibility: {
        allCustomers: true
      },
      stackable: true,
      autoApply: false,
      createdAt: new Date('2023-11-01'),
      updatedAt: new Date('2023-11-28')
    },
    {
      id: '4',
      name: 'Enterprise Discount',
      couponCode: 'ENTERPRISE100',
      description: '$100 off enterprise plans',
      discountType: 'fixed_amount',
      discountValue: 100,
      durationType: 'forever',
      maxRedemptions: 100,
      currentRedemptions: 23,
      status: 'active',
      validFrom: new Date('2024-01-01'),
      restrictions: {
        applicablePlans: ['3']
      },
      customerEligibility: {
        allCustomers: false,
        customerSegments: ['enterprise']
      },
      stackable: false,
      autoApply: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-02-15')
    }
  ]

  // Search fields extraction function
  const getCouponSearchFields = useCallback((coupon: Coupon): string[] => [
    coupon.couponCode ?? '',
    coupon.name ?? '',
    coupon.description ?? '',
    coupon.status ?? '',
    coupon.discountType ?? ''
  ], [])

  // Use debounced search
  const {
    searchQuery,
    setSearchQuery,
    filteredItems: searchFilteredCoupons,
    isSearching,
    clearSearch,
    totalCount,
    filteredCount
  } = useDebouncedSearch({
    items: coupons,
    searchFields: getCouponSearchFields,
    debounceMs: 300
  })

  const couponStats = {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(c => c.status === 'active').length,
    totalRedemptions: coupons.reduce((sum, c) => sum + c.currentRedemptions, 0),
    totalSavings: 18750
  }

  const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'active', name: 'Active' },
    { id: 'expired', name: 'Expired' },
    { id: 'archived', name: 'Archived' }
  ]

  const discountTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'percentage', name: 'Percentage' },
    { id: 'fixed_amount', name: 'Fixed Amount' }
  ]

  const filterFields: FilterField[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: selectedStatus,
      onChange: setSelectedStatus,
      options: statusOptions
    },
    {
      id: 'discountType',
      label: 'Discount Type',
      type: 'select',
      value: selectedType,
      onChange: setSelectedType,
      options: discountTypes
    }
  ]

  // Apply additional filters to search results
  const filteredCoupons = searchFilteredCoupons.filter(coupon => {
    const matchesStatus = selectedStatus === 'all' || coupon.status === selectedStatus
    const matchesType = selectedType === 'all' || coupon.discountType === selectedType
    return matchesStatus && matchesType
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <Link to="/catalog">
            <button className="btn-secondary">
              Back to Catalog
            </button>
          </Link>
          <ActionButton
            label="Create Coupon"
            onClick={() => setShowCreateModal(true)}
            size="md"
            animated={false}
          />
        </div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card 
            variant="stats"
            title="Total Coupons"
            value={couponStats.totalCoupons}
            icon={Ticket}
            trend={{ value: "+1 this month", direction: "up" }}
            color="primary"
            animate={false}
          />
          <Card 
            variant="stats"
            title="Active Coupons"
            value={couponStats.activeCoupons}
            icon={Package}
            trend={{ value: `${couponStats.activeCoupons}/${couponStats.totalCoupons} active`, direction: "neutral" }}
            color="success"
            animate={false}
          />
          <Card 
            variant="stats"
            title="Total Redemptions"
            value={couponStats.totalRedemptions.toLocaleString()}
            icon={Users}
            trend={{ value: "+145 this month", direction: "up" }}
            color="secondary"
            animate={false}
          />
          <Card 
            variant="stats"
            title="Total Savings"
            value={`$${couponStats.totalSavings.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: "Customer savings", direction: "neutral" }}
            color="warning"
            animate={false}
          />
        </motion.div>

        {/* Search and Filters */}
        <SearchFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search coupons by code, name, or description..."
          isSearching={isSearching}
          onClearSearch={clearSearch}
          searchResults={{
            total: totalCount,
            filtered: filteredCount
          }}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filterFields={filterFields}
          viewMode={viewMode as ViewMode}
          onViewModeChange={(mode) => setViewMode(mode as CatalogViewMode)}
          viewModeOptions={[
            { value: 'grid', icon: Grid3X3, label: 'Grid' },
            { value: 'list', icon: List, label: 'List' }
          ]}
          className="mb-6"
        />

        {/* Coupons Grid/List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium tracking-tight auth-text">Your Coupons</h2>
            <span className="auth-text-muted">{filteredCoupons.length} coupons</span>
          </div>

          {filteredCoupons.length === 0 ? (
            <div className="bg-[#171719] border border-[#1e1f22] rounded-lg p-12 text-center">
              <Ticket className="w-16 h-16 auth-icon mx-auto mb-4" />
              <h3 className="text-xl font-medium tracking-tight auth-text mb-2">No coupons found</h3>
              <p className="auth-text-muted mb-6">
                {searchQuery || selectedStatus !== 'all' || selectedType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first coupon to get started'
                }
              </p>
              {!searchQuery && selectedStatus === 'all' && selectedType === 'all' && (
                <ActionButton
                  label="Create Your First Coupon"
                  onClick={() => setShowCreateModal(true)}
                  size="md"
                  animated={false}
                />
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredCoupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <CouponCard 
                    coupon={coupon} 
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Coupon Modal */}
      <CreateCouponModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </DashboardLayout>
  )
}
