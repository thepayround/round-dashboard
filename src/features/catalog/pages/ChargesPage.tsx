import { motion } from 'framer-motion'
import { 
  Zap, 
  Grid3X3,
  List,
  DollarSign,
  TrendingUp,
  Package,
} from 'lucide-react'
import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

import { DashboardLayout } from '../../../shared/components/DashboardLayout'
import { ChargeCard, CreateChargeModalEnhanced } from '../components'
import { ActionButton, Card, SearchFilterToolbar, SectionHeader } from '../../../shared/components'
import type { ViewMode, FilterField } from '../../../shared/components'
import type { Charge, CatalogViewMode } from '../types/catalog.types'
import { useDebouncedSearch } from '../../../shared/hooks/useDebouncedSearch'

export const ChargesPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<CatalogViewMode>('grid')
  const [selectedFamily, setSelectedFamily] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - replace with API calls
  const charges: Charge[] = [
    {
      id: '1',
      name: 'Setup Fee',
      description: 'One-time setup and configuration fee',
      productFamilyId: '1',
      chargeType: 'one_time',
      status: 'active',
      chargeModel: 'flat_fee',
      amount: 299,
      currency: 'USD',
      pricePoints: [
        {
          id: 'cp1',
          currency: 'USD',
          price: 299,
          billingFrequency: 'monthly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        }
      ],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-10')
    },
    {
      id: '2',
      name: 'Overage Fee',
      description: 'Additional charges for usage beyond plan limits',
      productFamilyId: '1',
      chargeType: 'usage_based',
      status: 'active',
      chargeModel: 'per_unit',
      amount: 0.05,
      currency: 'USD',
      unitPrice: 0.05,
      pricePoints: [
        {
          id: 'cp2',
          currency: 'USD',
          price: 0.05,
          billingFrequency: 'monthly',
          unitPrice: 0.05,
          pricingModel: 'per_unit',
          showInCheckout: true,
          showInPortal: true
        }
      ],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-15')
    },
    {
      id: '3',
      name: 'Late Payment Fee',
      description: 'Fee charged for late payments',
      productFamilyId: '2',
      chargeType: 'penalty',
      status: 'active',
      chargeModel: 'flat_fee',
      amount: 25,
      currency: 'USD',
      pricePoints: [
        {
          id: 'cp3',
          currency: 'USD',
          price: 25,
          billingFrequency: 'monthly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        }
      ],
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-02-28')
    },
    {
      id: '4',
      name: 'Express Processing',
      description: 'Rush processing fee for urgent requests',
      productFamilyId: '3',
      chargeType: 'one_time',
      status: 'active',
      chargeModel: 'percentage',
      amount: 15,
      currency: 'USD',
      percentageValue: 15,
      pricePoints: [
        {
          id: 'cp4',
          currency: 'USD',
          price: 15,
          billingFrequency: 'monthly',
          percentage: 15,
          pricingModel: 'percentage',
          showInCheckout: true,
          showInPortal: true
        }
      ],
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-03-05')
    }
  ]

  const chargeStats = {
    totalCharges: charges.length,
    activeCharges: charges.filter(c => c.status === 'active').length,
    totalRevenue: 2450,
    averageAmount: 92
  }

  const productFamilies = [
    { id: 'all', name: 'All Families' },
    { id: '1', name: 'Core Platform' },
    { id: '2', name: 'Analytics Suite' },
    { id: '3', name: 'Enterprise Add-ons' }
  ]

  const chargeTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'one_time', name: 'One-time' },
    { id: 'usage_based', name: 'Usage-based' },
    { id: 'penalty', name: 'Penalty' }
  ]

  // Search fields extraction function
  const getChargeSearchFields = useCallback((charge: Charge): string[] => [
    charge.name || '',
    charge.description || '',
    charge.chargeType || '',
    charge.status || '',
    charge.amount?.toString() || ''
  ], [])

  // Use debounced search
  const {
    searchQuery,
    setSearchQuery,
    filteredItems: searchFilteredCharges,
    isSearching,
    clearSearch,
    totalCount,
    filteredCount
  } = useDebouncedSearch({
    items: charges,
    searchFields: getChargeSearchFields,
    debounceMs: 300
  })

  const filterFields: FilterField[] = [
    {
      id: 'productFamily',
      label: 'Product Family',
      type: 'select',
      value: selectedFamily,
      onChange: setSelectedFamily,
      options: productFamilies
    },
    {
      id: 'chargeType',
      label: 'Charge Type',
      type: 'select',
      value: selectedType,
      onChange: setSelectedType,
      options: chargeTypes
    }
  ]

  // Apply additional filters to search results
  const filteredCharges = searchFilteredCharges.filter(charge => {
    const matchesFamily = selectedFamily === 'all' || charge.productFamilyId === selectedFamily
    const matchesType = selectedType === 'all' || charge.chargeType === selectedType
    
    return matchesFamily && matchesType
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <SectionHeader
          title="Charges"
          subtitle="Manage additional fees, penalties, and one-time charges"
          size="main"
          actions={
            <div className="flex items-center space-x-4">
              <Link to="/catalog">
                <button className="btn-secondary">
                  Back to Catalog
                </button>
              </Link>
              <ActionButton
                label="Create Charge"
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
            title="Total Charges"
            value={chargeStats.totalCharges}
            icon={Zap}
            trend={{ value: "+2 this month", direction: "up" }}
            color="primary"
            animate={false}
          />
          <Card 
            variant="stats"
            title="Active Charges"
            value={chargeStats.activeCharges}
            icon={Package}
            trend={{ value: "All active", direction: "neutral" }}
            color="success"
            animate={false}
          />
          <Card 
            variant="stats"
            title="Monthly Revenue"
            value={`$${chargeStats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: "+15% growth", direction: "up" }}
            color="secondary"
            animate={false}
          />
          <Card 
            variant="stats"
            title="Avg Charge Amount"
            value={`$${chargeStats.averageAmount}`}
            icon={TrendingUp}
            trend={{ value: "↗️ Optimized fees", direction: "up" }}
            color="warning"
            animate={false}
          />
        </motion.div>

        {/* Search and Filters */}
        <SearchFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search charges by name, description, type, or amount..."
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

        {/* Charges Grid/List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium tracking-tight auth-text">Your Charges</h2>
            <span className="auth-text-muted">{filteredCharges.length} charges</span>
          </div>

          {filteredCharges.length === 0 ? (
            <div className="auth-card p-12 text-center">
              <Zap className="w-16 h-16 auth-icon mx-auto mb-4" />
              <h3 className="text-xl font-medium tracking-tight auth-text mb-2">No charges found</h3>
              <p className="auth-text-muted mb-6">
                {searchQuery || selectedFamily !== 'all' || selectedType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first charge to get started'
                }
              </p>
              {!searchQuery && selectedFamily === 'all' && selectedType === 'all' && (
                <ActionButton
                  label="Create Your First Charge"
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
              {filteredCharges.map((charge, index) => (
                <motion.div
                  key={charge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <ChargeCard 
                    charge={charge} 
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Charge Modal */}
      <CreateChargeModalEnhanced 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </DashboardLayout>
  )
}
