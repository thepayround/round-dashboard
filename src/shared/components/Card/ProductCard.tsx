import { motion } from 'framer-motion'
import { Package, Calendar, Clock, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { memo } from 'react'
import { Card } from './Card'
import { useCurrency } from '@/shared/hooks/useCurrency'
import type { ActionMenuItem } from '../ActionMenu/ActionMenu'

interface ProductCardProps {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'archived'
  price?: {
    amount: number
    currency: string
    period: string
  }
  features?: Array<{
    id: string
    name: string
    value?: number
    type?: 'boolean' | 'quantity'
  }>
  metadata?: {
    createdAt: Date
    billingPeriod?: string
    trialPeriod?: number
  }
  viewMode?: 'card' | 'list' | 'grid'
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  className?: string
  href?: string
}

// Legacy fallback currency formatting - now replaced by useCurrency hook
// Commented out as it's not used but kept for reference
// const legacyFormatCurrency = (amount: number, currency: string) => new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency
//   }).format(amount)

const formatDate = (date: Date) => new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)

const ProductCardComponent = ({
  name,
  description,
  status,
  price,
  features = [],
  metadata,
  viewMode = 'grid',
  onEdit,
  onDelete,
  onDuplicate,
  className = '',
  href
}: ProductCardProps) => {
  const { formatCurrency } = useCurrency()
  
  const actions: ActionMenuItem[] = [
    ...(href ? [{
      id: 'view',
      label: 'View Details',
      icon: Package,
      onClick: () => { window.location.href = href }
    }] : []),
    ...(onEdit ? [{
      id: 'edit',
      label: 'Edit',
      onClick: onEdit
    }] : []),
    ...(onDuplicate ? [{
      id: 'duplicate',
      label: 'Duplicate',
      onClick: onDuplicate
    }] : []),
    ...(onDelete ? [{
      id: 'delete',
      label: 'Delete',
      variant: 'danger' as const,
      onClick: onDelete,
      divider: true
    }] : [])
  ]

  const badges = [
    ...(metadata?.trialPeriod ? [{
      label: `${metadata.trialPeriod}d trial`,
      variant: 'info' as const
    }] : [])
  ]

  const footerMetadata = [
    ...(metadata?.createdAt ? [{
      icon: Calendar,
      label: 'Created',
      value: formatDate(metadata.createdAt)
    }] : []),
    ...(metadata?.billingPeriod ? [{
      icon: Clock,
      label: 'Billing',
      value: metadata.billingPeriod
    }] : []),
    {
      icon: Package,
      label: 'Features',
      value: features.length.toString()
    }
  ]

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`glass-card hover:glass-card-hover transition-all duration-300 group ${className}`}
      >
        <div className="p-6">
          <Card.Header
            icon={Package}
            status={{ label: status, variant: status }}
            badges={badges}
            actions={actions}
            iconColor="text-blue-400"
            iconBg="from-blue-500/20 to-cyan-500/20"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Card.Content
                title={href ? undefined : name}
                description={description}
                layout="default"
              />
              {href && (
                <Link 
                  to={href}
                  className="text-xl font-semibold text-white hover:text-blue-300 transition-colors"
                >
                  {name}
                </Link>
              )}
            </div>
            
            {price && (
              <div className="text-right ml-6">
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(price.amount, price.currency)}
                </div>
                <div className="text-xs text-gray-400">
                  per {price.period}
                </div>
              </div>
            )}
          </div>
          
          <Card.Footer
            metadata={footerMetadata}
            layout="split"
            className="mt-4"
          />
        </div>
      </motion.div>
    )
  }

  // Handle both 'card' and 'grid' as the same layout (card view)
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`glass-card hover:glass-card-hover transition-all duration-300 group cursor-pointer ${className}`}
    >
      <div className="p-6">
        <Card.Header
          icon={Package}
          status={{ label: status, variant: status }}
          badges={badges}
          actions={actions}
          iconColor="text-blue-400"
          iconBg="from-blue-500/20 to-cyan-500/20"
        />

        {href ? (
          <Link to={href} className="block">
            <Card.Content
              title={name}
              description={description}
              layout="default"
              className="group-hover:text-blue-300 transition-colors"
            />
          </Link>
        ) : (
          <Card.Content
            title={name}
            description={description}
            layout="default"
          />
        )}

        {price && (
          <div className="text-center py-4 bg-black/20 rounded-xl my-4">
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(price.amount, price.currency)}
            </div>
            <div className="text-sm text-gray-400">per {price.period}</div>
          </div>
        )}

        {features.length > 0 && (
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium text-gray-400">Key Features:</h4>
            <div className="space-y-1">
              {features.slice(0, 3).map((feature) => (
                <div key={feature.id} className="flex items-center space-x-2 text-sm">
                  <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">
                    {feature.name}
                    {feature.type === 'quantity' && typeof feature.value === 'number' && feature.value > 0 && (
                      <span className="text-white ml-1">({feature.value.toLocaleString()})</span>
                    )}
                  </span>
                </div>
              ))}
              {features.length > 3 && (
                <div className="text-sm text-gray-400 pl-5">
                  +{features.length - 3} more features
                </div>
              )}
            </div>
          </div>
        )}

        <Card.Footer
          metadata={footerMetadata}
          layout="split"
        />
      </div>
    </motion.div>
  )
}

export const ProductCard = memo(ProductCardComponent)