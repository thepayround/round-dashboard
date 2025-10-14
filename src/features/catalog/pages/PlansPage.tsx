import { motion } from 'framer-motion'
import { 
  Package, 
  Grid3X3, 
  List,
  DollarSign,
  TrendingUp,
  Star
} from 'lucide-react'
import { useState, useCallback } from 'react'
import { useDebouncedSearch } from '../../../shared/hooks/useDebouncedSearch'
import { Link } from 'react-router-dom'

import { DashboardLayout } from '../../../shared/components/DashboardLayout'
import { PlanCard, CreatePlanModalEnhanced } from '../components'
import { ActionButton, Card, SearchFilterToolbar, SectionHeader } from '../../../shared/components'
import type { ViewMode, FilterField } from '../../../shared/components'
import type { Plan, CatalogViewMode } from '../types/catalog.types'

export const PlansPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<CatalogViewMode>('grid')
  const [selectedFamily, setSelectedFamily] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - replace with API calls
  const plans: Plan[] = [
    {
      id: '1',
      name: 'Starter Plan',
      description: 'Perfect for small businesses getting started with Round',
      productFamilyId: '1',
      status: 'active',
      billingPeriod: 'monthly',
      isMetered: false,
      entitlements: [],
      customerPortal: {
        showInCheckout: true,
        showInPortal: true,
        allowUpgrade: true,
        allowDowngrade: false,
        allowCancellation: true
      },
      pricePoints: [
        {
          id: 'pp1',
          currency: 'USD',
          price: 29,
          billingFrequency: 'monthly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        },
        {
          id: 'pp2',
          currency: 'USD',
          price: 290,
          billingFrequency: 'yearly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        }
      ],
      features: [
        { id: 'f1', name: 'Up to 100 customers', featureType: 'quantity', value: 100, displayOrder: 1 },
        { id: 'f2', name: 'Basic analytics', featureType: 'boolean', value: true, displayOrder: 2 },
        { id: 'f3', name: 'Email support', featureType: 'boolean', value: true, displayOrder: 3 }
      ],
      trialPeriod: 14,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-10')
    },
    {
      id: '2',
      name: 'Professional Plan',
      description: 'Advanced features for growing businesses',
      productFamilyId: '1',
      status: 'active',
      billingPeriod: 'monthly',
      isMetered: false,
      entitlements: [],
      customerPortal: {
        showInCheckout: true,
        showInPortal: true,
        allowUpgrade: true,
        allowDowngrade: true,
        allowCancellation: true
      },
      pricePoints: [
        {
          id: 'pp3',
          currency: 'USD',
          price: 99,
          billingFrequency: 'monthly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        },
        {
          id: 'pp4',
          currency: 'USD',
          price: 990,
          billingFrequency: 'yearly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        }
      ],
      features: [
        { id: 'f4', name: 'Up to 1,000 customers', featureType: 'quantity', value: 1000, displayOrder: 1 },
        { id: 'f5', name: 'Advanced analytics', featureType: 'boolean', value: true, displayOrder: 2 },
        { id: 'f6', name: 'Priority support', featureType: 'boolean', value: true, displayOrder: 3 },
        { id: 'f7', name: 'API access', featureType: 'boolean', value: true, displayOrder: 4 }
      ],
      trialPeriod: 30,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-15')
    },
    {
      id: '3',
      name: 'Enterprise Plan',
      description: 'Custom solutions for large organizations',
      productFamilyId: '1',
      status: 'active',
      billingPeriod: 'yearly',
      isMetered: false,
      entitlements: [],
      customerPortal: {
        showInCheckout: true,
        showInPortal: true,
        allowUpgrade: false,
        allowDowngrade: true,
        allowCancellation: false
      },
      pricePoints: [
        {
          id: 'pp5',
          currency: 'USD',
          price: 499,
          billingFrequency: 'monthly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        },
        {
          id: 'pp6',
          currency: 'USD',
          price: 4990,
          billingFrequency: 'yearly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        }
      ],
      features: [
        { id: 'f8', name: 'Unlimited customers', featureType: 'text', value: 'Unlimited', displayOrder: 1 },
        { id: 'f9', name: 'Custom analytics', featureType: 'boolean', value: true, displayOrder: 2 },
        { id: 'f10', name: '24/7 phone support', featureType: 'boolean', value: true, displayOrder: 3 },
        { id: 'f11', name: 'Dedicated account manager', featureType: 'boolean', value: true, displayOrder: 4 },
        { id: 'f12', name: 'Custom integrations', featureType: 'boolean', value: true, displayOrder: 5 }
      ],
      createdAt: new Date('2024-03-01')
    }
  ]

  // Search fields extraction function
  const getPlanSearchFields = useCallback((plan: Plan): string[] => [
    plan.name || '',
    plan.description || '',
    plan.status || '',
    plan.pricePoints?.[0]?.price?.toString() || ''
  ], [])

  // Use debounced search
  const {
    searchQuery,
    setSearchQuery,
    filteredItems: searchFilteredPlans,
    isSearching,
    clearSearch,
    totalCount,
    filteredCount
  } = useDebouncedSearch({
    items: plans,
    searchFields: getPlanSearchFields,
    debounceMs: 300
  })

  const planStats = {
    totalPlans: plans.length,
    activePlans: plans.filter(p => p.status === 'active').length,
    totalMRR: 25430,
    avgPlanValue: 185
  }

  const productFamilies = [
    { id: 'all', name: 'All Families' },
    { id: '1', name: 'Core Platform' },
    { id: '2', name: 'Analytics Suite' },
    { id: '3', name: 'Enterprise Add-ons' }
  ]

  const filterFields: FilterField[] = [
    {
      id: 'productFamily',
      label: 'Product Family',
      type: 'select',
      value: selectedFamily,
      onChange: setSelectedFamily,
      options: productFamilies
    }
  ]

  // Apply additional filters to search results
  const filteredPlans = searchFilteredPlans.filter(plan => {
    const matchesFamily = selectedFamily === 'all' || plan.productFamilyId === selectedFamily
    return matchesFamily
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <SectionHeader
          title="Plans"
          subtitle="Manage your pricing plans and billing frequencies"
          size="main"
          actions={
            <div className="flex items-center space-x-4">
              <Link to="/catalog">
                <button className="btn-secondary">
                  Back to Catalog
                </button>
              </Link>
              <ActionButton
                label="Create Plan"
                onClick={() => setShowCreateModal(true)}
                size="md"
                animated={false}
              />
            </div>
          }
        />

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card 
            variant="stats"
            title="Total Plans"
            value={planStats.totalPlans}
            icon={Package}
            trend={{ value: "+2 this month", direction: "up" }}
            color="secondary"
            animate={false}
          />
          <Card 
            variant="stats"
            title="Active Plans"
            value={planStats.activePlans}
            icon={Star}
            trend={{ value: "All active", direction: "neutral" }}
            color="success"
            animate={false}
          />
          <Card 
            variant="stats"
            title="Monthly MRR"
            value={`$${planStats.totalMRR.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: "+18% growth", direction: "up" }}
            color="primary"
            animate={false}
          />
          <Card 
            variant="stats"
            title="Avg Plan Value"
            value={`$${planStats.avgPlanValue}`}
            icon={TrendingUp}
            trend={{ value: "↗️ Increasing", direction: "up" }}
            color="accent"
            animate={false}
          />
        </motion.div>

        {/* Search and Filters */}
        <SearchFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search plans by name, description, or price..."
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

        {/* Plans Grid/List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Your Plans</h2>
            <span className="auth-text-muted">{filteredPlans.length} plans</span>
          </div>

          {filteredPlans.length === 0 ? (
            <Card animate={false} padding="xl" className="text-center">
              <Package className="w-16 h-16 auth-icon mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No plans found</h3>
              <p className="auth-text-muted mb-6">
                {searchQuery || selectedFamily !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first plan to get started'
                }
              </p>
              {!searchQuery && selectedFamily === 'all' && (
                <ActionButton
                  label="Create Your First Plan"
                  onClick={() => setShowCreateModal(true)}
                  size="md"
                  animated={false}
                />
              )}
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <PlanCard 
                    plan={plan} 
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Plan Modal */}
      <CreatePlanModalEnhanced 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        productFamilies={productFamilies}
      />
    </DashboardLayout>
  )
}
