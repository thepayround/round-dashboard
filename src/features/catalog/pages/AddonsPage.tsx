import { motion } from 'framer-motion'
import { 
  Zap, 
  Grid3X3,
  List,
  DollarSign,
  TrendingUp,
  Package,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { DashboardLayout } from '../../../shared/components/DashboardLayout'
import { AddonCard, CreateAddonModal } from '../components'
import { ActionButton, Card, SearchFilterToolbar, SectionHeader } from '../../../shared/components'
import type { ViewMode, FilterField } from '../../../shared/components'
import type { Addon, CatalogViewMode } from '../types/catalog.types'

export const AddonsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<CatalogViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFamily, setSelectedFamily] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - replace with API calls
  const addons: Addon[] = [
    {
      id: '1',
      name: 'Advanced Analytics',
      description: 'Deep-dive analytics and custom reporting capabilities',
      productFamilyId: '2',
      type: 'recurring',
      status: 'active',
      chargeModel: 'flat_fee',
      isOptional: true,
      isQuantityBasedCharge: false,
      customerPortal: {
        showInCheckout: true,
        showInPortal: true,
        allowSelfSubscribe: true,
        allowSelfRemove: true
      },
      pricePoints: [
        {
          id: 'ap1',
          currency: 'USD',
          price: 49,
          billingFrequency: 'monthly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        },
        {
          id: 'ap2',
          currency: 'USD',
          price: 490,
          billingFrequency: 'yearly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        }
      ],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-12')
    },
    {
      id: '2',
      name: 'Priority Support',
      description: '24/7 phone and chat support with dedicated account manager',
      productFamilyId: '3',
      type: 'recurring',
      status: 'active',
      chargeModel: 'flat_fee',
      isOptional: true,
      isQuantityBasedCharge: false,
      customerPortal: {
        showInCheckout: true,
        showInPortal: true,
        allowSelfSubscribe: true,
        allowSelfRemove: true
      },
      pricePoints: [
        {
          id: 'ap3',
          currency: 'USD',
          price: 99,
          billingFrequency: 'monthly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        }
      ],
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-03-08')
    },
    {
      id: '3',
      name: 'API Calls Pack',
      description: 'Additional API calls beyond your plan limit',
      productFamilyId: '1',
      type: 'usage_based',
      status: 'active',
      chargeModel: 'per_unit',
      isOptional: true,
      isQuantityBasedCharge: true,
      customerPortal: {
        showInCheckout: true,
        showInPortal: true,
        allowSelfSubscribe: true,
        allowSelfRemove: true
      },
      pricePoints: [
        {
          id: 'ap4',
          currency: 'USD',
          price: 0.001,
          billingFrequency: 'monthly',
          unitPrice: 0.001,
          pricingModel: 'per_unit',
          showInCheckout: true,
          showInPortal: true
        }
      ],
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-03-05')
    },
    {
      id: '4',
      name: 'Setup & Migration',
      description: 'Professional setup and data migration service',
      productFamilyId: '3',
      type: 'one_time',
      status: 'active',
      chargeModel: 'flat_fee',
      isOptional: false,
      isQuantityBasedCharge: false,
      customerPortal: {
        showInCheckout: true,
        showInPortal: false,
        allowSelfSubscribe: false,
        allowSelfRemove: false
      },
      pricePoints: [
        {
          id: 'ap5',
          currency: 'USD',
          price: 499,
          billingFrequency: 'monthly',
          pricingModel: 'flat_fee',
          showInCheckout: true,
          showInPortal: true
        }
      ],
      createdAt: new Date('2024-03-01')
    }
  ]

  const addonStats = {
    totalAddons: addons.length,
    activeAddons: addons.filter(a => a.status === 'active').length,
    totalRevenue: 8640,
    averagePrice: 162
  }

  const productFamilies = [
    { id: 'all', name: 'All Families' },
    { id: '1', name: 'Core Platform' },
    { id: '2', name: 'Analytics Suite' },
    { id: '3', name: 'Enterprise Add-ons' }
  ]

  const addonTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'recurring', name: 'Recurring' },
    { id: 'one_time', name: 'One-time' },
    { id: 'usage_based', name: 'Usage-based' }
  ]

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
      id: 'addonType',
      label: 'Add-on Type',
      type: 'select',
      value: selectedType,
      onChange: setSelectedType,
      options: addonTypes
    }
  ]

  const filteredAddons = addons.filter(addon => {
    const matchesSearch = addon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         addon.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFamily = selectedFamily === 'all' || addon.productFamilyId === selectedFamily
    const matchesType = selectedType === 'all' || addon.type === selectedType
    return matchesSearch && matchesFamily && matchesType
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <SectionHeader
          title="Add-ons"
          subtitle="Manage additional services and features for your customers"
          size="main"
          actions={
            <div className="flex items-center space-x-4">
              <Link to="/catalog">
                <button className="btn-secondary">
                  Back to Catalog
                </button>
              </Link>
              <ActionButton
                label="Create Add-on"
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
            title="Total Add-ons"
            value={addonStats.totalAddons}
            icon={Zap}
            trend={{ value: "+1 this month", direction: "up" }}
            color="primary"
            animate={false}
          />
          <Card 
            variant="stats"
            title="Active Add-ons"
            value={addonStats.activeAddons}
            icon={Package}
            trend={{ value: "All active", direction: "neutral" }}
            color="success"
            animate={false}
          />
          <Card 
            variant="stats"
            title="Monthly Revenue"
            value={`$${addonStats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: "+25% growth", direction: "up" }}
            color="secondary"
            animate={false}
          />
          <Card 
            variant="stats"
            title="Avg Add-on Price"
            value={`$${addonStats.averagePrice}`}
            icon={TrendingUp}
            trend={{ value: "↗️ Premium focus", direction: "up" }}
            color="warning"
            animate={false}
          />
        </motion.div>

        {/* Toolbar */}
        <SearchFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search add-ons..."
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filterFields={filterFields}
          viewMode={viewMode as ViewMode}
          onViewModeChange={(mode) => setViewMode(mode as CatalogViewMode)}
          viewModeOptions={[
            { value: 'grid', icon: Grid3X3, label: 'Grid' },
            { value: 'list', icon: List, label: 'List' }
          ]}
          delay={0.2}
        />

        {/* Add-ons Grid/List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold auth-text">Your Add-ons</h2>
            <span className="auth-text-muted">{filteredAddons.length} add-ons</span>
          </div>

          {filteredAddons.length === 0 ? (
            <Card animate={false} padding="xl" className="text-center">
              <Zap className="w-16 h-16 auth-icon mx-auto mb-4" />
              <h3 className="text-xl font-semibold auth-text mb-2">No add-ons found</h3>
              <p className="auth-text-muted mb-6">
                {searchQuery || selectedFamily !== 'all' || selectedType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first add-on to get started'
                }
              </p>
              {!searchQuery && selectedFamily === 'all' && selectedType === 'all' && (
                <ActionButton
                  label="Create Your First Add-on"
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
              {filteredAddons.map((addon, index) => (
                <motion.div
                  key={addon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <AddonCard 
                    addon={addon} 
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Add-on Modal */}
      <CreateAddonModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </DashboardLayout>
  )
}
