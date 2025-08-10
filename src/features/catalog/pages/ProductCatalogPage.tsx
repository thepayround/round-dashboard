import { motion } from 'framer-motion'
import { 
  Package, 
  Plus, 
  Grid3X3,
  List, 
  ShoppingCart,
  Tags,
  DollarSign,
  Zap,
  Settings,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { DashboardLayout, SectionHeader, Button, Card, SearchFilterToolbar, ActionCard, ActionButton } from '@/shared/components'
import type { ViewMode, FilterField } from '@/shared/components'
import { ProductFamilyCard, CreateProductFamilyModal } from '../components'

export const ProductCatalogPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - replace with API calls
  const catalogStats = {
    totalProducts: 24,
    activeProducts: 18,
    totalRevenue: 127650,
    monthlyGrowth: 12.5
  }

  const productFamilies = [
    {
      id: '1',
      name: 'Core Platform',
      description: 'Essential billing and revenue management features',
      productCount: 5,
      status: 'active' as const,
      category: 'SaaS Platform',
      createdAt: new Date('2024-01-15'),
      revenue: 45000
    },
    {
      id: '2', 
      name: 'Analytics Suite',
      description: 'Advanced analytics and business intelligence tools',
      productCount: 8,
      status: 'active' as const,
      category: 'Analytics',
      createdAt: new Date('2024-02-10'),
      revenue: 32500
    },
    {
      id: '3',
      name: 'Enterprise Add-ons',
      description: 'Premium features for enterprise customers',
      productCount: 6,
      status: 'active' as const,
      category: 'Enterprise',
      createdAt: new Date('2024-03-05'),
      revenue: 28900
    }
  ]

  const filterFields: FilterField[] = [
    // ProductCatalogPage can have minimal filters or none
    // Adding as empty array for consistency
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <SectionHeader
          title="Product Catalog"
          subtitle="Manage your product families, plans, addons, and pricing strategies"
          accent="primary"
          size="main"
          actions={
            <>
              <Link to="/catalog/settings">
                <Button
                  variant="secondary"
                  icon={Settings}
                >
                  Catalog Settings
                </Button>
              </Link>
              <ActionButton
                label="Create Product Family"
                onClick={() => setShowCreateModal(true)}
                size="md"
                animated={false}
              />
            </>
          }
        />

        {/* Enhanced Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8"
        >
          <Card
            variant="stats"
            title="Total Products"
            value={catalogStats.totalProducts}
            icon={Package}
            trend={{
              value: '+3 this month',
              direction: 'up'
            }}
            color="secondary"
            animate={false}
          />

          <Card
            variant="stats"
            title="Active Products"
            value={catalogStats.activeProducts}
            icon={ShoppingCart}
            trend={{
              value: '94% active rate',
              direction: 'neutral'
            }}
            color="success"
            animate={false}
          />

          <Card
            variant="stats"
            title="Monthly Revenue"
            value={`$${catalogStats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={{
              value: `+${catalogStats.monthlyGrowth}% growth`,
              direction: 'up'
            }}
            color="accent"
            animate={false}
          />

          <Card
            variant="stats"
            title="Product Families"
            value={productFamilies.length}
            icon={Tags}
            trend={{
              value: 'Well organized',
              direction: 'neutral'
            }}
            color="primary"
            animate={false}
          />
        </motion.div>

        {/* Enhanced Toolbar */}
        <SearchFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search product families..."
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          filterFields={filterFields}
          viewMode={viewMode as ViewMode}
          onViewModeChange={(mode) => setViewMode(mode as 'grid' | 'list')}
          viewModeOptions={[
            { value: 'grid', icon: Grid3X3, label: 'Grid' },
            { value: 'list', icon: List, label: 'List' }
          ]}
          delay={0.2}
        />

        {/* Enhanced Catalog Management Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-6"
        >
          <SectionHeader
            title="Catalog Management"
            accent="primary"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <ActionCard
              title="Manage Plans"
              description="View and manage all pricing plans"
              icon={Package}
              href="/catalog/plans"
              color="secondary"
              animate={false}
            />

            <ActionCard
              title="Manage Add-ons"
              description="View and manage additional services"
              icon={Zap}
              href="/catalog/addons"
              color="accent"
              animate={false}
            />

            <ActionCard
              title="Manage Charges"
              description="View and manage fees and penalties"
              icon={DollarSign}
              href="/catalog/charges"
              color="success"
              animate={false}
            />

            <ActionCard
              title="Manage Coupons"
              description="View and manage discount coupons"
              icon={Tags}
              href="/catalog/coupons"
              color="primary"
              animate={false}
            />
          </div>
        </motion.div>

        {/* Enhanced Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <SectionHeader
            title="Quick Actions"
            accent="secondary"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <ActionCard
              title="Create Plan"
              description="Define pricing & billing cycles"
              icon={Package}
              href="/catalog/plans/create"
              layout="horizontal"
              color="secondary"
              animate={false}
            />

            <ActionCard
              title="Create Addon"
              description="Additional services & features"
              icon={Zap}
              href="/catalog/addons/create"
              layout="horizontal"
              color="accent"
              animate={false}
            />

            <ActionCard
              title="Create Charge"
              description="One-time fees & services"
              icon={DollarSign}
              href="/catalog/charges/create"
              layout="horizontal"
              color="success"
              animate={false}
            />

            <ActionCard
              title="Create Coupon"
              description="Discounts & promotions"
              icon={Tags}
              href="/catalog/coupons/create"
              layout="horizontal"
              color="primary"
              animate={false}
            />
          </div>
        </motion.div>

        {/* Enhanced Product Families */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <SectionHeader
            title="Product Families"
            accent="accent"
            actions={
              <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm">
                <span className="text-gray-300 font-medium">{productFamilies.length} families</span>
              </div>
            }
          />

          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {productFamilies.map((family, index) => (
              <motion.div
                key={family.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <ProductFamilyCard 
                  family={family} 
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Create Product Family Modal */}
      <CreateProductFamilyModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </DashboardLayout>
  )
}
