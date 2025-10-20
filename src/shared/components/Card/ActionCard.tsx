import { motion } from 'framer-motion'
import type { LucideIcon} from 'lucide-react';
import { Link } from 'react-router-dom'
import { memo } from 'react'

interface ActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  href?: string
  external?: boolean
  onClick?: () => void
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral'
  layout?: 'vertical' | 'horizontal'
  className?: string
  animate?: boolean
  delay?: number
  disabled?: boolean
}

const colorVariants = {
  primary: {
    gradient: 'from-[#D417C8]/20 via-transparent to-transparent',
    iconBg: 'from-[#D417C8]/30 to-[#D417C8]/10',
    iconColor: 'text-[#D417C8]',
    border: 'border-[#D417C8]/20',
    hoverColor: 'group-hover:text-[#D417C8]'
  },
  secondary: {
    gradient: 'from-[#14BDEA]/20 via-transparent to-transparent',
    iconBg: 'from-[#14BDEA]/30 to-[#14BDEA]/10',
    iconColor: 'text-[#14BDEA]',
    border: 'border-[#14BDEA]/20',
    hoverColor: 'group-hover:text-[#14BDEA]'
  },
  accent: {
    gradient: 'from-[#7767DA]/20 via-transparent to-transparent',
    iconBg: 'from-[#7767DA]/30 to-[#7767DA]/10',
    iconColor: 'text-[#7767DA]',
    border: 'border-[#7767DA]/20',
    hoverColor: 'group-hover:text-[#7767DA]'
  },
  success: {
    gradient: 'from-green-500/20 via-transparent to-transparent',
    iconBg: 'from-green-500/30 to-green-500/10',
    iconColor: 'text-green-500',
    border: 'border-green-500/20',
    hoverColor: 'group-hover:text-green-400'
  },
  warning: {
    gradient: 'from-yellow-500/20 via-transparent to-transparent',
    iconBg: 'from-yellow-500/30 to-yellow-500/10',
    iconColor: 'text-yellow-500',
    border: 'border-yellow-500/20',
    hoverColor: 'group-hover:text-yellow-400'
  },
  danger: {
    gradient: 'from-red-500/20 via-transparent to-transparent',
    iconBg: 'from-red-500/30 to-red-500/10',
    iconColor: 'text-red-500',
    border: 'border-red-500/20',
    hoverColor: 'group-hover:text-red-400'
  },
  neutral: {
    gradient: 'from-gray-500/20 via-transparent to-transparent',
    iconBg: 'from-gray-500/30 to-gray-500/10',
    iconColor: 'text-gray-400',
    border: 'border-gray-500/20',
    hoverColor: 'group-hover:text-gray-300'
  }
}

const ActionCardComponent = ({
  title,
  description,
  icon: Icon,
  href,
  external = false,
  onClick,
  color = 'neutral',
  layout = 'vertical',
  className = '',
  animate = true,
  delay = 0,
  disabled = false
}: ActionCardProps) => {
  const colorConfig = colorVariants[color]
  
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4 }
  } : {}

  const CardContent = () => (
    <motion.div 
      whileHover={{ y: -1, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className={`auth-card p-6 relative overflow-hidden group ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}>
        {/* Hover Gradient Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-200`} />
        
        {/* Content */}
        <div className="relative">
          {layout === 'vertical' ? (
            // Default Layout - Vertical Stack (matching original NavigationCard)
            <>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colorConfig.iconBg} border ${colorConfig.border} backdrop-blur-sm`}>
                  <Icon className={`w-6 h-6 ${colorConfig.iconColor}`} />
                </div>
              </div>
              <h3 className={`text-lg font-normal tracking-tight tracking-tight text-white ${colorConfig.hoverColor} transition-colors mb-2`}>
                {title}
              </h3>
              <p className="text-gray-400 text-sm">
                {description}
              </p>
            </>
          ) : (
            // Horizontal Layout - Compact
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colorConfig.iconBg} border ${colorConfig.border} backdrop-blur-sm`}>
                  <Icon className={`w-6 h-6 ${colorConfig.iconColor}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-normal tracking-tight tracking-tight text-white ${colorConfig.hoverColor} transition-colors`}>
                    {title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  if (disabled) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <motion.div {...motionProps}>
        <CardContent />
      </motion.div>
    )
  }

  if (href) {
    if (external) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...motionProps}
        >
          <CardContent />
        </motion.a>
      )
    }

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <motion.div {...motionProps}>
        <Link to={href}>
          <CardContent />
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      onClick={onClick}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...motionProps}
    >
      <CardContent />
    </motion.div>
  )
}

export const ActionCard = memo(ActionCardComponent)