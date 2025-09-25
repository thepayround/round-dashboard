import { motion } from 'framer-motion'
import type { LucideIcon} from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode} from 'react';
import { memo } from 'react'
import { CardHeader } from './Card.Header'
import { CardContent } from './Card.Content'
import { CardFooter } from './Card.Footer'

export interface CardProps {
  children?: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'compact' | 'stats' | 'navigation' | 'feature'
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral'
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
  
  // Stats card specific props
  title?: string
  value?: string | number
  icon?: LucideIcon
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
    label?: string
  }
  
  // Navigation card specific props
  description?: string
  href?: string
  external?: boolean
  navigationVariant?: 'default' | 'compact'  // Add navigation layout variants
  enhancedHover?: boolean  // For NavigationCard-style enhanced hover effects
  
  // Animation props
  animate?: boolean
  delay?: number
}

const paddingVariants = {
  none: '',
  sm: 'p-2 md:p-2.5 lg:p-2',           // Compact: 8px → 10px → 8px
  md: 'p-3 md:p-3.5 lg:p-3',           // Standard: 12px → 14px → 12px  
  lg: 'p-4 md:p-4.5 lg:p-4',           // Spacious: 16px → 18px → 16px
  xl: 'p-5 md:p-5.5 lg:p-5'            // Extra: 20px → 22px → 20px
}

const colorVariants = {
  primary: {
    gradient: 'from-[#D417C8]/20 via-transparent to-transparent',
    iconBg: 'from-[#BD2CD0]/20 to-[#D417C8]/20',
    border: 'border-[#D417C8]/20',
    iconColor: 'text-[#BD2CD0]',
    hoverColor: 'group-hover:text-[#D417C8]'
  },
  secondary: {
    gradient: 'from-[#14BDEA]/20 via-transparent to-transparent',
    iconBg: 'from-[#32A1E4]/20 to-[#7767DA]/20',
    border: 'border-[#14BDEA]/20',
    iconColor: 'text-[#32A1E4]',
    hoverColor: 'group-hover:text-[#14BDEA]'
  },
  accent: {
    gradient: 'from-[#7767DA]/20 via-transparent to-transparent',
    iconBg: 'from-[#7767DA]/20 to-[#BD2CD0]/20',
    border: 'border-[#7767DA]/20',
    iconColor: 'text-[#7767DA]',
    hoverColor: 'group-hover:text-[#7767DA]'
  },
  success: {
    gradient: 'from-[#42E695]/20 via-transparent to-transparent',
    iconBg: 'from-[#42E695]/20 to-[#3BB2B8]/20',
    border: 'border-[#42E695]/20',
    iconColor: 'text-[#42E695]',
    hoverColor: 'group-hover:text-[#42E695]'
  },
  warning: {
    gradient: 'from-[#FFC107]/20 via-transparent to-transparent',
    iconBg: 'from-[#FFC107]/20 to-[#FF8A00]/20',
    border: 'border-[#FFC107]/20',
    iconColor: 'text-[#FFC107]',
    hoverColor: 'group-hover:text-[#FFC107]'
  },
  danger: {
    gradient: 'from-red-500/20 via-transparent to-transparent',
    iconBg: 'from-red-500/30 to-red-500/10',
    border: 'border-red-500/20',
    iconColor: 'text-red-500',
    hoverColor: 'group-hover:text-red-400'
  },
  neutral: {
    gradient: 'from-gray-500/10 via-transparent to-transparent',
    iconBg: 'from-gray-500/20 to-gray-500/10',
    border: 'border-gray-500/20',
    iconColor: 'text-gray-400',
    hoverColor: 'group-hover:text-gray-300'
  }
}

const CardComponent = ({
  children,
  className = '',
  padding = 'lg',
  variant = 'default',
  color = 'neutral',
  clickable = false,
  onClick,
  title,
  value,
  icon: Icon,
  trend,
  description,
  href,
  external = false,
  navigationVariant = 'default',
  animate = true,
  delay = 0
}: CardProps) => {
  const colorConfig = colorVariants[color]
  const paddingClass = paddingVariants[padding]
  
  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up': return 'text-[#42E695]'
      case 'down': return 'text-[#FFC107]'
      default: return 'text-gray-400'
    }
  }

  const _TrendIcon = trend?.direction === 'up' ? TrendingUp : TrendingDown

  const baseClasses = `
    auth-card relative overflow-hidden group
    ${paddingClass}
    ${clickable || onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim()

  const CardContent = () => (
    <div className="relative">
      {/* Content based on variant */}
      {variant === 'stats' && title && (
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-3">
            <p className="auth-text-muted text-xs font-medium truncate uppercase tracking-wide">
              {title}
            </p>
            <p className="auth-text text-sm font-medium">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            
            {trend && (
              <p className={`text-xs font-medium ${getTrendColor(trend.direction)} truncate`}>
                {trend.value}{trend.label && ` ${trend.label}`}
              </p>
            )}
          </div>

          {Icon && (
            <div className={`w-6 h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 rounded-lg bg-gradient-to-br ${colorConfig.iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-3 h-3 md:w-3.5 md:h-3.5 lg:w-3 lg:h-3 ${colorConfig.iconColor}`} />
            </div>
          )}
        </div>
      )}

      {variant === 'navigation' && title && description && (
        navigationVariant === 'default' ? (
          // Default Layout - Vertical Stack (like NavigationCard default)
          <>
            <div className="flex items-center justify-between mb-4">
              {Icon && (
                <div className={`p-1.5 md:p-2 lg:p-1.5 bg-gradient-to-br ${colorConfig.iconBg} rounded-lg border ${colorConfig.border} backdrop-blur-sm`}>
                  <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 lg:w-3.5 lg:h-3.5 ${colorConfig.iconColor}`} />
                </div>
              )}
            </div>
            <h3 className={`text-xs font-light text-white transition-colors duration-200 ${colorConfig.hoverColor} mb-0.5`}>
              {title}
            </h3>
            <p className="text-gray-400 text-[0.6875rem] leading-tight">
              {description}
            </p>
          </>
        ) : (
          // Compact Layout - Horizontal (existing)
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {Icon && (
                <div className={`p-1.5 md:p-2 lg:p-1.5 bg-gradient-to-br ${colorConfig.iconBg} rounded-lg border ${colorConfig.border} backdrop-blur-sm`}>
                  <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 lg:w-3.5 lg:h-3.5 ${colorConfig.iconColor}`} />
                </div>
              )}
              <div>
                <h3 className={`text-xs font-light text-white transition-colors duration-200 ${colorConfig.hoverColor}`}>
                  {title}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {description}
                </p>
              </div>
            </div>
          </div>
        )
      )}

      {variant === 'compact' && title && (
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-3">
            <p className="text-gray-400 text-xs font-light truncate">{title}</p>
            {value && (
              <p className="text-sm font-medium text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            )}
            {trend && (
              <p className={`text-xs font-medium ${getTrendColor(trend.direction)} truncate`}>
                {trend.value}{trend.label && ` ${trend.label}`}
              </p>
            )}
          </div>
          {Icon && (
            <div className={`w-6 h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 rounded-lg bg-gradient-to-br ${colorConfig.iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-3 h-3 md:w-3.5 md:h-3.5 lg:w-3 lg:h-3 ${colorConfig.iconColor}`} />
            </div>
          )}
        </div>
      )}

      {variant === 'feature' && title && (
        <div className="text-center">
          {Icon && (
            <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${colorConfig.iconBg} rounded-lg border ${colorConfig.border} flex items-center justify-center backdrop-blur-sm`}>
              <Icon className={`w-8 h-8 ${colorConfig.iconColor}`} />
            </div>
          )}
          <h3 className="text-sm font-medium text-white mb-2">{title}</h3>
          {description && (
            <p className="text-gray-400 text-xs">{description}</p>
          )}
        </div>
      )}

      {variant === 'default' && children}
    </div>
  )

  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4 }
  } : {}

  // Navigation card with Link wrapper
  if (variant === 'navigation' && href) {
    if (external) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
          onClick={onClick}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...motionProps}
        >
          <CardContent />
        </motion.a>
      )
    }

    return (
      <motion.div
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...motionProps}
      >
        <Link to={href} className={baseClasses} onClick={onClick}>
          <CardContent />
        </Link>
      </motion.div>
    )
  }

  // Regular card
  return (
    <motion.div
      className={baseClasses}
      onClick={onClick}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...motionProps}
    >
      <CardContent />
    </motion.div>
  )
}

// Create base memoized component
const MemoizedCard = memo(CardComponent)

// Create Card with composable parts
export const Card = Object.assign(MemoizedCard, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter
})
