import { motion } from 'framer-motion'
import { 
  Ticket, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Eye, 
  Copy,
  Calendar,
  Users,
  TrendingUp,
  Percent,
  DollarSign,

  Activity,
  AlertTriangle,
  Archive
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import type { Coupon, CatalogViewMode } from '../types/catalog.types'

interface CouponCardProps {
  coupon: Coupon
  viewMode: CatalogViewMode
  onEdit?: (coupon: Coupon) => void
  onDelete?: (coupon: Coupon) => void
  onDuplicate?: (coupon: Coupon) => void
  onCopyCode?: (coupon: Coupon) => void
}

export const CouponCard = ({ 
  coupon, 
  viewMode, 
  onEdit, 
  onDelete,
  onDuplicate,
  onCopyCode
}: CouponCardProps) => {
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
    expired: 'text-[#FF4E50] bg-[#FF4E50]/10 border-[#FF4E50]/20',
    archived: 'text-[#7767DA] bg-[#7767DA]/10 border-[#7767DA]/20'
  }

  const discountTypeColors = {
    percentage: 'text-[#D417C8] bg-[#D417C8]/10 border-[#D417C8]/20',
    fixed_amount: 'text-[#42E695] bg-[#42E695]/10 border-[#42E695]/20'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Activity
      case 'expired': return AlertTriangle
      case 'archived': return Archive
      default: return Ticket
    }
  }

  const formatDiscount = () => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`
    }
    return `$${coupon.discountValue}`
  }

  const getUsagePercentage = () => {
    if (!coupon.maxRedemptions) return 0
    return (coupon.currentRedemptions / coupon.maxRedemptions) * 100
  }

  const isExpiringSoon = () => {
    if (!coupon.validUntil) return false
    const now = new Date()
    const daysUntilExpiry = Math.ceil((coupon.validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.couponCode)
    onCopyCode?.(coupon)
  }

  if (viewMode === 'list') {
    const StatusIcon = getStatusIcon(coupon.status)
    
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
              {/* Coupon Icon */}
              <div className="relative">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#14BDEA]/20 to-[#32A1E4]/20 border border-white/10">
                  <Ticket className="w-6 h-6 text-[#14BDEA]" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${statusColors[coupon.status]}`}>
                    <StatusIcon className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <Link 
                    to={`/catalog/coupons/${coupon.id}`}
                    className="text-xl font-bold auth-text hover:text-[#14BDEA] transition-colors"
                  >
                    {coupon.name}
                  </Link>
                </div>
                <p className="auth-text-muted text-sm mb-2">{coupon.description}</p>
                
                {/* Enhanced metrics */}
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={handleCopyCode}
                    className="font-mono text-sm bg-black/20 px-3 py-1 rounded-md hover:bg-black/30 transition-colors auth-text flex items-center space-x-2"
                  >
                    <span>{coupon.couponCode}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                  <span className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-[#32A1E4]" />
                    <span className="auth-text-muted">{coupon.currentRedemptions}/{coupon.maxRedemptions ?? '∞'} used</span>
                  </span>
                  <span className={`flex items-center space-x-2 text-sm px-3 py-1 rounded-full border ${statusColors[coupon.status]}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span className="font-medium capitalize">{coupon.status}</span>
                  </span>
                  <span className={`flex items-center space-x-2 text-sm px-3 py-1 rounded-full border ${discountTypeColors[coupon.discountType]}`}>
                    <span className="font-medium">{coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}</span>
                  </span>
                  {isExpiringSoon() && (
                    <span className="flex items-center space-x-2 text-sm px-3 py-1 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/20">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#FFC107]" />
                      <span className="font-medium text-[#FFC107]">Expiring Soon</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Discount Display */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-[#14BDEA]">
                  {formatDiscount()}
                </div>
                <div className="text-sm auth-text-muted">
                  {coupon.discountType === 'percentage' ? 'Off' : 'Discount'}
                </div>
              </div>
              
              <div className="relative" ref={dropdownRef} style={{ zIndex: showActions ? 99999 : 'auto' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:from-white/15 hover:to-white/10 hover:border-white/30"
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
                    <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
                      <div className="bg-gradient-to-r from-[#14BDEA]/20 to-[#32A1E4]/20 px-4 py-3 border-b border-white/10">
                        <p className="font-medium auth-text text-sm">Coupon Actions</p>
                      </div>
                      
                      <div className="p-2">
                        <Link to={`/catalog/coupons/${coupon.id}`}>
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
                          onClick={() => onEdit?.(coupon)}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-gradient-to-r hover:from-[#14BDEA]/10 hover:to-[#32A1E4]/5 rounded-lg transition-all duration-200"
                        >
                          <Edit3 className="w-4 h-4 text-[#14BDEA]" />
                          <span className="font-medium">Edit Coupon</span>
                        </motion.button>
                        
                        <motion.button 
                          whileHover={{ x: 2 }}
                          onClick={handleCopyCode}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-gradient-to-r hover:from-[#7767DA]/10 hover:to-[#D417C8]/5 rounded-lg transition-all duration-200"
                        >
                          <Copy className="w-4 h-4 text-[#7767DA]" />
                          <span className="font-medium">Copy Code</span>
                        </motion.button>
                        
                        <motion.button 
                          whileHover={{ x: 2 }}
                          onClick={() => onDuplicate?.(coupon)}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-gradient-to-r hover:from-[#FFC107]/10 hover:to-[#FF8A00]/5 rounded-lg transition-all duration-200"
                        >
                          <TrendingUp className="w-4 h-4 text-[#FFC107]" />
                          <span className="font-medium">Duplicate</span>
                        </motion.button>
                        
                        <div className="border-t border-white/10 my-1" />
                        
                        <motion.button 
                          whileHover={{ x: 2 }}
                          onClick={() => onDelete?.(coupon)}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-[#FF4E50]/10 hover:to-[#F44336]/5 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 text-[#FF4E50]" />
                          <span className="font-medium text-[#FF4E50]">Delete Coupon</span>
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

  const StatusIcon = getStatusIcon(coupon.status)
  
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#14BDEA]/20 to-[#32A1E4]/20 border border-white/10">
              <Ticket className="w-7 h-7 text-[#14BDEA]" />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusColors[coupon.status]}`}>
                <StatusIcon className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="relative" ref={dropdownRef} style={{ zIndex: showActions ? 99999 : 'auto' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:from-white/15 hover:to-white/10 hover:border-white/30"
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
                <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#14BDEA]/20 to-[#32A1E4]/20 px-4 py-3 border-b border-white/10">
                    <p className="font-medium auth-text text-sm">Coupon Actions</p>
                  </div>
                  
                  <div className="p-2">
                    <Link to={`/catalog/coupons/${coupon.id}`}>
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
                      onClick={() => onEdit?.(coupon)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-gradient-to-r hover:from-[#14BDEA]/10 hover:to-[#32A1E4]/5 rounded-lg transition-all duration-200"
                    >
                      <Edit3 className="w-4 h-4 text-[#14BDEA]" />
                      <span className="font-medium">Edit Coupon</span>
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ x: 2 }}
                      onClick={handleCopyCode}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-gradient-to-r hover:from-[#7767DA]/10 hover:to-[#D417C8]/5 rounded-lg transition-all duration-200"
                    >
                      <Copy className="w-4 h-4 text-[#7767DA]" />
                      <span className="font-medium">Copy Code</span>
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ x: 2 }}
                      onClick={() => onDuplicate?.(coupon)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm auth-text hover:bg-gradient-to-r hover:from-[#FFC107]/10 hover:to-[#FF8A00]/5 rounded-lg transition-all duration-200"
                    >
                      <TrendingUp className="w-4 h-4 text-[#FFC107]" />
                      <span className="font-medium">Duplicate</span>
                    </motion.button>
                    
                    <div className="border-t border-white/10 my-1" />
                    
                    <motion.button 
                      whileHover={{ x: 2 }}
                      onClick={() => onDelete?.(coupon)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-[#FF4E50]/10 hover:to-[#F44336]/5 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-[#FF4E50]" />
                      <span className="font-medium text-[#FF4E50]">Delete Coupon</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Content */}
        <Link to={`/catalog/coupons/${coupon.id}`} className="block mb-4">
          <h3 className="text-xl font-bold auth-text mb-2 group-hover:text-[#14BDEA] transition-colors">
            {coupon.name}
          </h3>
          <p className="auth-text-muted text-sm line-clamp-2">
            {coupon.description}
          </p>
        </Link>

        {/* Coupon Code & Discount Display */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={handleCopyCode}
              className="font-mono text-sm bg-black/20 px-3 py-2 rounded-lg hover:bg-black/30 transition-colors auth-text flex items-center space-x-2"
            >
              <span>{coupon.couponCode}</span>
              <Copy className="w-4 h-4" />
            </button>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#14BDEA] flex items-center space-x-1">
                {coupon.discountType === 'percentage' ? (
                  <Percent className="w-5 h-5" />
                ) : (
                  <DollarSign className="w-5 h-5" />
                )}
                <span>{formatDiscount()}</span>
              </div>
              <div className="text-xs auth-text-muted">
                {coupon.discountType === 'percentage' ? 'Off' : 'Discount'}
              </div>
            </div>
          </div>
        </div>

        {/* Usage Progress */}
        {coupon.maxRedemptions && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="auth-text-muted">Usage</span>
              <span className="auth-text">{coupon.currentRedemptions}/{coupon.maxRedemptions}</span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#14BDEA] to-[#32A1E4] transition-all duration-300"
                style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
              />
            </div>
            <div className="text-xs auth-text-muted mt-1">
              {getUsagePercentage().toFixed(1)}% used
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[coupon.status]}`}>
              <StatusIcon className="w-3 h-3 inline mr-1" />
              {coupon.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${discountTypeColors[coupon.discountType]}`}>
              {coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
            </span>
            {isExpiringSoon() && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FFC107]/10 border border-[#FFC107]/20 text-[#FFC107]">
                Expiring Soon
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1 text-xs auth-text-muted">
            <Calendar className="w-3 h-3" />
            <span>
              {coupon.validUntil 
                ? `Until ${formatDate(coupon.validUntil)}`
                : `Created ${formatDate(coupon.createdAt)}`
              }
            </span>
          </div>
        </div>
        </div>
      </div>
    </motion.div>
  )
}