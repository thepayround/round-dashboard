import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import { useCardController } from './useCardController'

import { cn } from '@/shared/utils/cn'


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
    gradient: '',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
    border: 'border-primary/20',
    hoverColor: 'group-hover:text-primary'
  },
  secondary: {
    gradient: '',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
    border: 'border-primary/20',
    hoverColor: 'group-hover:text-primary'
  },
  accent: {
    gradient: '',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
    border: 'border-primary/20',
    hoverColor: 'group-hover:text-primary'
  },
  success: {
    gradient: '',
    iconBg: 'bg-accent/20',
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
    hoverColor: 'group-hover:text-[#D417C8]'
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
  const isLink = Boolean(href)
  const isInteractive = !disabled && (Boolean(onClick) || isLink)
  const { isFocused, isPressed, interactionProps } = useCardController({
    clickable: isInteractive,
    disabled,
    onPress: onClick,
    isInteractiveElement: isLink,
  })
  
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4 }
  } : {}

  const surfaceClasses = cn(
    'bg-[#171719] border border-[#1e1f22] rounded-lg p-6 relative overflow-hidden group transition-all duration-200',
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#25262a] cursor-pointer',
    isFocused && 'ring-1 ring-white/10',
    isPressed && 'scale-[0.995]',
    className
  )

  const CardContent = () => (
    <motion.div 
      whileHover={{ y: disabled ? 0 : -1, scale: disabled ? 1 : 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className={surfaceClasses}>
        {/* Hover Gradient Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-200`} />
        
        {/* Content */}
        <div className="relative">
          {layout === 'vertical' ? (
            // Default Layout - Vertical Stack (matching original NavigationCard)
            <>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colorConfig.iconBg} border ${colorConfig.border}`}>
                  <Icon className={`w-6 h-6 ${colorConfig.iconColor}`} />
                </div>
              </div>
              <h3 className={`text-lg font-normal tracking-tight text-white ${colorConfig.hoverColor} transition-colors mb-2`}>
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
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colorConfig.iconBg} border ${colorConfig.border}`}>
                  <Icon className={`w-6 h-6 ${colorConfig.iconColor}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-normal tracking-tight text-white ${colorConfig.hoverColor} transition-colors`}>
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
          {...interactionProps}
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
        <Link
          to={href}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...interactionProps}
        >
          <CardContent />
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      onClick={onClick}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...interactionProps}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...motionProps}
    >
      <CardContent />
    </motion.div>
  )
}

export const ActionCard = memo(ActionCardComponent)
