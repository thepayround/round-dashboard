import { motion } from 'framer-motion'
import { 
  Package, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Eye, 
  Copy,
  Users,
  Activity,
  Clock,
  Archive,
  CreditCard,
  Calendar,
  Zap
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import type { Plan, CatalogViewMode } from '../types/catalog.types'

interface PlanCardProps {
  plan: Plan
  viewMode: CatalogViewMode
  onEdit?: (plan: Plan) => void
  onDelete?: (plan: Plan) => void
  onDuplicate?: (plan: Plan) => void
}

export const PlanCard = ({ 
  plan, 
  viewMode, 
  onEdit, 
  onDelete,
  onDuplicate 
}: PlanCardProps) => {
  const [showActions, setShowActions] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowActions(false)
      }
    }

    const handleScroll = () => {
      if (showActions) {
        setShowActions(false)
      }
    }

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('scroll', handleScroll, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [showActions])

  const statusColors = {
    active: 'text-[#42E695] bg-[#42E695]/10 border-[#42E695]/20',
    inactive: 'text-[#FFC107] bg-[#FFC107]/10 border-[#FFC107]/20', 
    archived: 'text-[#7767DA] bg-[#7767DA]/10 border-[#7767DA]/20'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Activity
      case 'inactive': return Clock
      case 'archived': return Archive
      default: return Package
    }
  }

  const getLowestPrice = () => {
    if (!plan.pricePoints || plan.pricePoints.length === 0) return null
    return plan.pricePoints.reduce((min, pp) => 
      pp.price < min.price ? pp : min
    )
  }

  const formatPrice = (price: number, currency: string = 'USD', period: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(price)
    
    const periodMap: Record<string, string> = {
      'month': '/mo',
      'year': '/yr',
      'week': '/wk',
      'day': '/day'
    }
    
    return `${formatted}${periodMap[period] || `/${period}`}`
  }

  const lowestPrice = getLowestPrice()

  if (viewMode === 'list') {
    const StatusIcon = getStatusIcon(plan.status)
    
    return (
      <motion.div
        style={{ 
          zIndex: showActions ? 9999 : 'auto',
          position: 'relative'
        }}
      >
        <div className="bg-[#171719] border border-[#1e1f22] rounded-lg group cursor-pointer hover:bg-[#1d1d20] hover:border-[#25262a] transition-all duration-200" style={{ overflow: 'visible' }}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
            {/* Main Info */}
            <div className="flex items-center space-x-4 flex-1">
              {/* Plan Icon */}
              <div className="relative">
                <div className="p-3 rounded-lg bg-[#7767DA]/20 border border-white/10">
                  <CreditCard className="w-6 h-6 text-[#7767DA]" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${statusColors[plan.status]}`}>
                    <StatusIcon className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <Link 
                    to={`/catalog/plans/${plan.id}`}
                    className="text-xl font-medium tracking-tight auth-text hover:text-[#7767DA] transition-colors"
                  >
                    {plan.name}
                  </Link>
                </div>
                <p className="auth-text-muted text-sm mb-2">{plan.description}</p>
                
                {/* Enhanced metrics */}
                <div className="flex items-center space-x-6">
                  <span className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-[#32A1E4]" />
                    <span className="auth-text font-medium">{plan.features?.length || 0} features</span>
                  </span>
                  {plan.trialPeriod && (
                    <span className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-[#FFC107]" />
                      <span className="auth-text-muted">{plan.trialPeriod} day trial</span>
                    </span>
                  )}
                  <span className={`flex items-center space-x-2 text-sm px-3 py-1 rounded-full border ${statusColors[plan.status]}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span className="font-medium capitalize">{plan.status}</span>
                  </span>
                  {plan.isMetered && (
                    <span className="flex items-center space-x-2 text-sm px-3 py-1 rounded-full bg-[#32A1E4]/10 border border-[#32A1E4]/20">
                      <Zap className="w-3.5 h-3.5 text-[#32A1E4]" />
                      <span className="font-medium text-[#32A1E4]">Metered</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                {lowestPrice ? (
                  <>
                    <div className="text-2xl font-medium tracking-tight text-[#42E695]">
                      {formatPrice(lowestPrice.price, lowestPrice.currency, lowestPrice.billingFrequency)}
                    </div>
                    <div className="text-sm auth-text-muted">Starting Price</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-medium tracking-tight auth-text">
                      Custom
                    </div>
                    <div className="text-sm auth-text-muted">Contact Sales</div>
                  </>
                )}
              </div>
              
              <div className="relative" ref={dropdownRef} style={{ zIndex: showActions ? 99999 : 'auto' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg bg-[#1d1d20] border border-[#25262a] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#212124] hover:border-[#2c2d31]"
                  onClick={() => setShowActions(!showActions)}
                >
                  <MoreHorizontal className="w-5 h-5 auth-text" />
                </motion.button>

                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute right-0 top-full mt-3 min-w-[200px]"
                    style={{ zIndex: 99999 }}
                  >
                    <div className="bg-[#0a0a0a] border border-[#25262a] shadow-xl rounded-lg overflow-hidden">
                      <div className="bg-[#7767DA]/20 px-4 py-3 border-b border-[#25262a]">
                        <p className="font-medium auth-text text-sm">Plan Actions</p>
                      </div>
                      
                      <div className="p-2">
                        <Link to={`/catalog/plans/${plan.id}`}>
                          <motion.button 
                            whileHover={{ x: 2 }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-accent/10 rounded-lg transition-all duration-200"
                          >
                            <Eye className="w-4 h-4 text-[#32A1E4]" />
                            <span className="font-medium">View Details</span>
                          </motion.button>
                        </Link>
                        
                        <motion.button 
                          whileHover={{ x: 2 }}
                          onClick={() => onEdit?.(plan)}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-accent/10 rounded-lg transition-all duration-200"
                        >
                          <Edit3 className="w-4 h-4 text-[#7767DA]" />
                          <span className="font-medium">Edit Plan</span>
                        </motion.button>
                        
                        <motion.button 
                          whileHover={{ x: 2 }}
                          onClick={() => onDuplicate?.(plan)}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-warning/10 rounded-lg transition-all duration-200"
                        >
                          <Copy className="w-4 h-4 text-[#FFC107]" />
                          <span className="font-medium">Duplicate</span>
                        </motion.button>
                        
                        <div className="border-t border-white/10 my-1" />
                        
                        <motion.button 
                          whileHover={{ x: 2 }}
                          onClick={() => onDelete?.(plan)}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-destructive/10 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 text-[#FF4E50]" />
                          <span className="font-medium text-[#FF4E50]">Delete Plan</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    )
  }

  const StatusIcon = getStatusIcon(plan.status)
  
  return (
    <motion.div
      whileHover={{ y: -1, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ 
        zIndex: showActions ? 9999 : 'auto',
        position: 'relative'
      }}
    >
      <div className="bg-[#171719] border border-[#1e1f22] rounded-lg group cursor-pointer hover:bg-[#1d1d20] hover:border-[#25262a] transition-all duration-200" style={{ overflow: 'visible' }}>
        <div className="p-6">
          {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <div className="p-3 rounded-lg bg-[#7767DA]/10 border border-[#25262a]">
              <CreditCard className="w-7 h-7 text-[#7767DA]" />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusColors[plan.status]}`}>
                <StatusIcon className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="relative" ref={dropdownRef} style={{ zIndex: showActions ? 99999 : 'auto' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-lg bg-[#1d1d20] border border-[#25262a] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#212124] hover:border-[#2c2d31]"
              onClick={(e) => {
                e.preventDefault()
                setShowActions(!showActions)
              }}
            >
              <MoreHorizontal className="w-5 h-5 auth-text" />
            </motion.button>

            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute right-0 top-full mt-3 min-w-[200px]"
                style={{ zIndex: 99999 }}
              >
                <div className="bg-[#0a0a0a] border border-[#25262a] shadow-xl rounded-lg overflow-hidden">
                  <div className="bg-[#7767DA]/20 px-4 py-3 border-b border-[#25262a]">
                    <p className="font-medium auth-text text-sm">Plan Actions</p>
                  </div>
                  
                  <div className="p-2">
                    <Link to={`/catalog/plans/${plan.id}`}>
                      <motion.button 
                        whileHover={{ x: 2 }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-accent/10 rounded-lg transition-all duration-200"
                      >
                        <Eye className="w-4 h-4 text-[#32A1E4]" />
                        <span className="font-medium">View Details</span>
                      </motion.button>
                    </Link>
                    
                    <motion.button 
                      whileHover={{ x: 2 }}
                      onClick={() => onEdit?.(plan)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-accent/10 rounded-lg transition-all duration-200"
                    >
                      <Edit3 className="w-4 h-4 text-[#7767DA]" />
                      <span className="font-medium">Edit Plan</span>
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ x: 2 }}
                      onClick={() => onDuplicate?.(plan)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-warning/10 rounded-lg transition-all duration-200"
                    >
                      <Copy className="w-4 h-4 text-[#FFC107]" />
                      <span className="font-medium">Duplicate</span>
                    </motion.button>
                    
                    <div className="border-t border-white/10 my-1" />
                    
                    <motion.button 
                      whileHover={{ x: 2 }}
                      onClick={() => onDelete?.(plan)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-destructive/10 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-[#FF4E50]" />
                      <span className="font-medium text-[#FF4E50]">Delete Plan</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Content */}
        <Link to={`/catalog/plans/${plan.id}`} className="block mb-4">
          <h3 className="text-xl font-medium tracking-tight auth-text mb-2 group-hover:text-[#7767DA] transition-colors">
            {plan.name}
          </h3>
          <p className="auth-text-muted text-sm line-clamp-2">
            {plan.description}
          </p>
        </Link>

        {/* Price Display */}
        <div className="mb-4">
          {lowestPrice ? (
            <div className="text-center">
              <div className="text-2xl font-medium tracking-tight text-[#42E695] mb-1">
                {formatPrice(lowestPrice.price, lowestPrice.currency, lowestPrice.billingFrequency)}
              </div>
              <div className="text-xs auth-text-muted">Starting from</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-2xl font-medium tracking-tight auth-text mb-1">Custom</div>
              <div className="text-xs auth-text-muted">Contact for pricing</div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className={`grid ${plan.trialPeriod ? 'grid-cols-3' : 'grid-cols-2'} gap-3 mb-4`}>
          <div className="p-3 bg-black/20 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Users className="w-4 h-4 text-[#32A1E4]" />
              <span className="text-xs auth-text-muted">Features</span>
            </div>
            <div className="text-lg font-medium tracking-tight auth-text">{plan.features?.length || 0}</div>
          </div>
          
          <div className="p-3 bg-black/20 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Calendar className="w-4 h-4 text-[#7767DA]" />
              <span className="text-xs auth-text-muted">Billing</span>
            </div>
            <div className="text-sm font-normal tracking-tight tracking-tight text-[#7767DA] capitalize">{plan.billingPeriod}</div>
          </div>

          {plan.trialPeriod && (
            <div className="p-3 bg-black/20 rounded-lg text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Clock className="w-4 h-4 text-[#FFC107]" />
                <span className="text-xs auth-text-muted">Trial</span>
              </div>
              <div className="text-sm font-normal tracking-tight tracking-tight text-[#FFC107]">{plan.trialPeriod} days</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-normal tracking-tight ${statusColors[plan.status]}`}>
            <StatusIcon className="w-3 h-3 inline mr-1" />
            {plan.status}
          </span>
          
          {plan.isMetered && (
            <span className="px-3 py-1 rounded-full text-xs font-normal tracking-tight bg-[#32A1E4]/10 border border-[#32A1E4]/20 text-[#32A1E4]">
              <Zap className="w-3 h-3 inline mr-1" />
              Metered
            </span>
          )}
        </div>
        </div>
      </div>
    </motion.div>
  )
}
