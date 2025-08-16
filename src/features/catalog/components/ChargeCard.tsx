import { motion } from 'framer-motion'
import { 
  Zap, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Eye, 
  Copy,
  DollarSign,
  Calendar,
  Package,
  AlertTriangle,
  Clock,
  Activity,
  Archive,

} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import type { Charge, CatalogViewMode } from '../types/catalog.types'

interface ChargeCardProps {
  charge: Charge
  viewMode: CatalogViewMode
  onEdit?: (charge: Charge) => void
  onDelete?: (charge: Charge) => void
  onDuplicate?: (charge: Charge) => void
}

export const ChargeCard = ({ 
  charge, 
  viewMode, 
  onEdit, 
  onDelete,
  onDuplicate 
}: ChargeCardProps) => {
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

  const typeColors = {
    one_time: 'text-[#32A1E4] bg-[#32A1E4]/10 border-[#32A1E4]/20',
    recurring: 'text-[#42E695] bg-[#42E695]/10 border-[#42E695]/20',
    usage_based: 'text-[#D417C8] bg-[#D417C8]/10 border-[#D417C8]/20',
    penalty: 'text-[#FF4E50] bg-[#FF4E50]/10 border-[#FF4E50]/20'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Activity
      case 'inactive': return Clock
      case 'archived': return Archive
      default: return Package
    }
  }

  const getChargeIcon = () => {
    switch (charge.chargeType) {
      case 'penalty': return AlertTriangle
      case 'usage_based': return Zap
      case 'recurring': return Clock
      default: return DollarSign
    }
  }

  const formatPrice = (pricePoint: typeof charge.pricePoints[0]) => {
    if (charge.chargeModel === 'percentage') {
      return `${pricePoint.percentage ?? pricePoint.price}%`
    }
    return `$${pricePoint.price.toFixed(2)}`
  }

  const getChargeModelLabel = (model: string) => {
    switch (model) {
      case 'flat_fee': return 'Flat Fee'
      case 'per_unit': return 'Per Unit'
      case 'tiered': return 'Tiered'
      case 'volume': return 'Volume'
      case 'stairstep': return 'Stairstep'
      case 'package': return 'Package'
      case 'percentage': return 'Percentage'
      case 'metered': return 'Metered'
      default: return model
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'one_time': return 'One-time'
      case 'recurring': return 'Recurring'
      case 'usage_based': return 'Usage-based'
      case 'penalty': return 'Penalty'
      default: return type
    }
  }

  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)

  const ChargeIcon = getChargeIcon()

  if (viewMode === 'list') {
    const StatusIcon = getStatusIcon(charge.status)
    
    return (
      <motion.div
        style={{ 
          zIndex: showActions ? 9999 : 'auto',
          position: 'relative'
        }}
      >
        <div className="auth-card group cursor-pointer" style={{ overflow: 'visible', boxShadow: 'none !important' }}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
            {/* Main Info */}
            <div className="flex items-center space-x-4 flex-1">
              {/* Charge Icon */}
              <div className="relative">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[#FFC107]/20 to-[#FF8A00]/20 border border-white/10">
                  <ChargeIcon className="w-6 h-6 text-[#FFC107]" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${statusColors[charge.status]}`}>
                    <StatusIcon className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <Link 
                    to={`/catalog/charges/${charge.id}`}
                    className="text-xl font-bold auth-text hover:text-[#FFC107] transition-colors"
                  >
                    {charge.name}
                  </Link>
                </div>
                <p className="auth-text-muted text-sm mb-2">{charge.description}</p>
                
                {/* Enhanced metrics */}
                <div className="flex items-center space-x-6">
                  <span className="flex items-center space-x-2 text-sm">
                    <Package className="w-4 h-4 text-[#32A1E4]" />
                    <span className="auth-text font-medium">{getChargeModelLabel(charge.chargeModel)}</span>
                  </span>
                  <span className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#7767DA]" />
                    <span className="auth-text-muted">{formatDate(charge.createdAt)}</span>
                  </span>
                  <span className={`flex items-center space-x-2 text-sm px-3 py-1 rounded-full border ${statusColors[charge.status]}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span className="font-medium capitalize">{charge.status}</span>
                  </span>
                  <span className={`flex items-center space-x-2 text-sm px-3 py-1 rounded-full border ${typeColors[charge.chargeType]}`}>
                    <span className="font-medium">{getTypeLabel(charge.chargeType)}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-[#42E695]">
                  {formatPrice(charge.pricePoints[0])}
                </div>
                <div className="text-sm auth-text-muted">
                  {charge.pricePoints.length > 1 ? `+${charge.pricePoints.length - 1} more` : 'Price'}
                </div>
              </div>
              
              <div className="relative" ref={dropdownRef} style={{ zIndex: showActions ? 99999 : 'auto' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:from-white/15 hover:to-white/10 hover:border-white/30"
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
                    <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-[#FFC107]/20 to-[#FF8A00]/20 px-4 py-3 border-b border-white/10">
                        <p className="font-medium auth-text text-sm">Charge Actions</p>
                      </div>
                      
                      <div className="p-2">
                        <Link to={`/catalog/charges/${charge.id}`}>
                          <motion.button 
                            whileHover={{ x: 2 }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-gradient-to-r hover:from-[#32A1E4]/10 hover:to-[#14BDEA]/5 rounded-lg transition-all duration-200"
                          >
                            <Eye className="w-4 h-4 text-[#32A1E4]" />
                            <span className="font-medium">View Details</span>
                          </motion.button>
                        </Link>
                        
                        <motion.button 
                          whileHover={{ x: 2 }}
                          onClick={() => onEdit?.(charge)}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-gradient-to-r hover:from-[#FFC107]/10 hover:to-[#FF8A00]/5 rounded-lg transition-all duration-200"
                        >
                          <Edit3 className="w-4 h-4 text-[#FFC107]" />
                          <span className="font-medium">Edit Charge</span>
                        </motion.button>
                        
                        <motion.button 
                          whileHover={{ x: 2 }}
                          onClick={() => onDuplicate?.(charge)}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-gradient-to-r hover:from-[#7767DA]/10 hover:to-[#D417C8]/5 rounded-lg transition-all duration-200"
                        >
                          <Copy className="w-4 h-4 text-[#7767DA]" />
                          <span className="font-medium">Duplicate</span>
                        </motion.button>
                        
                        <div className="border-t border-white/10 my-1" />
                        
                        <motion.button 
                          whileHover={{ x: 2 }}
                          onClick={() => onDelete?.(charge)}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-[#FF4E50]/10 hover:to-[#F44336]/5 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 text-[#FF4E50]" />
                          <span className="font-medium text-[#FF4E50]">Delete Charge</span>
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

  const StatusIcon = getStatusIcon(charge.status)
  
  return (
    <motion.div
      whileHover={{ y: -1, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ 
        zIndex: showActions ? 9999 : 'auto',
        position: 'relative'
      }}
    >
      <div className="auth-card group cursor-pointer" style={{ overflow: 'visible', boxShadow: 'none !important' }}>
        <div className="p-6">
          {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#FFC107]/20 to-[#FF8A00]/20 border border-white/10">
              <ChargeIcon className="w-7 h-7 text-[#FFC107]" />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusColors[charge.status]}`}>
                <StatusIcon className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="relative" ref={dropdownRef} style={{ zIndex: showActions ? 99999 : 'auto' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:from-white/15 hover:to-white/10 hover:border-white/30"
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
                <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FFC107]/20 to-[#FF8A00]/20 px-4 py-3 border-b border-white/10">
                    <p className="font-medium auth-text text-sm">Charge Actions</p>
                  </div>
                  
                  <div className="p-2">
                    <Link to={`/catalog/charges/${charge.id}`}>
                      <motion.button 
                        whileHover={{ x: 2 }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-gradient-to-r hover:from-[#32A1E4]/10 hover:to-[#14BDEA]/5 rounded-lg transition-all duration-200"
                      >
                        <Eye className="w-4 h-4 text-[#32A1E4]" />
                        <span className="font-medium">View Details</span>
                      </motion.button>
                    </Link>
                    
                    <motion.button 
                      whileHover={{ x: 2 }}
                      onClick={() => onEdit?.(charge)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-gradient-to-r hover:from-[#FFC107]/10 hover:to-[#FF8A00]/5 rounded-lg transition-all duration-200"
                    >
                      <Edit3 className="w-4 h-4 text-[#FFC107]" />
                      <span className="font-medium">Edit Charge</span>
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ x: 2 }}
                      onClick={() => onDuplicate?.(charge)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-gradient-to-r hover:from-[#7767DA]/10 hover:to-[#D417C8]/5 rounded-lg transition-all duration-200"
                    >
                      <Copy className="w-4 h-4 text-[#7767DA]" />
                      <span className="font-medium">Duplicate</span>
                    </motion.button>
                    
                    <div className="border-t border-white/10 my-1" />
                    
                    <motion.button 
                      whileHover={{ x: 2 }}
                      onClick={() => onDelete?.(charge)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-[#FF4E50]/10 hover:to-[#F44336]/5 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-[#FF4E50]" />
                      <span className="font-medium text-[#FF4E50]">Delete Charge</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Content */}
        <Link to={`/catalog/charges/${charge.id}`} className="block mb-4">
          <h3 className="text-xl font-bold auth-text mb-2 group-hover:text-[#FFC107] transition-colors">
            {charge.name}
          </h3>
          <p className="auth-text-muted text-sm line-clamp-2">
            {charge.description}
          </p>
        </Link>

        {/* Price Display */}
        <div className="mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#42E695] mb-1">
              {formatPrice(charge.pricePoints[0])}
            </div>
            <div className="text-xs auth-text-muted">
              {charge.pricePoints[0].billingFrequency && charge.chargeType !== 'one_time' 
                ? `per ${charge.pricePoints[0].billingFrequency}` 
                : getChargeModelLabel(charge.chargeModel)
              }
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-black/20 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Package className="w-4 h-4 text-[#32A1E4]" />
              <span className="text-xs auth-text-muted">Model</span>
            </div>
            <div className="text-sm font-bold auth-text">{getChargeModelLabel(charge.chargeModel)}</div>
          </div>
          
          <div className="p-3 bg-black/20 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <DollarSign className="w-4 h-4 text-[#42E695]" />
              <span className="text-xs auth-text-muted">Prices</span>
            </div>
            <div className="text-lg font-bold text-[#42E695]">{charge.pricePoints?.length || 0}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[charge.status]}`}>
              <StatusIcon className="w-3 h-3 inline mr-1" />
              {charge.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[charge.chargeType]}`}>
              {getTypeLabel(charge.chargeType)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs auth-text-muted">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(charge.createdAt)}</span>
          </div>
        </div>
        </div>
      </div>
    </motion.div>
  )
}