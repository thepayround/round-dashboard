import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { memo } from 'react'
import { Link } from 'react-router-dom'


import { CardContent } from './Card.Content'
import { CardFooter } from './Card.Footer'
import { CardHeader } from './Card.Header'
import { useCardController } from './useCardController'

import { cn } from '@/shared/utils/cn'

export interface CardProps {
  children?: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'compact' | 'stats' | 'navigation' | 'feature' | 'nested'
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
  navigationVariant?: 'default' | 'compact'
  enhancedHover?: boolean

  // Animation props
  animate?: boolean
  delay?: number

  // Nested variant - for inner cards
  nested?: boolean
}

const paddingVariants = {
  none: '',
  sm: 'p-2',           // Compact: 8px
  md: 'p-4',           // Standard: 16px (consistent with polar.sh)
  lg: 'p-6',           // Spacious: 24px
  xl: 'p-8'            // Extra: 32px
}

const colorVariants = {
  primary: {
    iconBg: 'bg-primary/10',
    border: 'border-primary/20',
    iconColor: 'text-primary',
    hoverColor: 'group-hover:text-primary'
  },
  secondary: {
    iconBg: 'bg-secondary/10',
    border: 'border-secondary/20',
    iconColor: 'text-secondary',
    hoverColor: 'group-hover:text-secondary'
  },
  accent: {
    iconBg: 'bg-accent/10',
    border: 'border-accent/20',
    iconColor: 'text-accent',
    hoverColor: 'group-hover:text-accent'
  },
  success: {
    iconBg: 'bg-success/10',
    border: 'border-success/20',
    iconColor: 'text-success',
    hoverColor: 'group-hover:text-success'
  },
  warning: {
    iconBg: 'bg-warning/10',
    border: 'border-warning/20',
    iconColor: 'text-warning',
    hoverColor: 'group-hover:text-warning'
  },
  danger: {
    iconBg: 'bg-destructive/10',
    border: 'border-destructive/20',
    iconColor: 'text-destructive',
    hoverColor: 'group-hover:text-primary'
  },
  neutral: {
    iconBg: 'bg-transparent',
    border: 'border-border',
    iconColor: 'text-fg-muted',
    hoverColor: 'group-hover:text-fg'
  }
}

const CardComponent = ({
  children,
  className = '',
  padding = 'md',
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
  delay = 0,
  nested = false
}: CardProps) => {
  const colorConfig = colorVariants[color]
  const paddingClass = paddingVariants[padding]
  const isNavigationLink = variant === 'navigation' && Boolean(href)
  const isInteractive = Boolean(onClick) || clickable || isNavigationLink

  const { isFocused, isPressed, interactionProps } = useCardController({
    clickable: isInteractive,
    onPress: onClick,
    isInteractiveElement: isNavigationLink,
  })

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up': return 'text-success'
      case 'down': return 'text-warning'
      default: return 'text-fg-muted'
    }
  }

  const TrendIcon = trend?.direction === 'up' ? ArrowUpRight : ArrowDownRight

  // Polar-inspired clean design
  const baseClasses = (nested || variant === 'nested')
    ? cn(
      'transition-all duration-200',
      paddingClass,
      isInteractive && 'cursor-pointer hover:border-border-hover',
      isFocused && 'ring-1 ring-ring/20',
      isPressed && 'scale-[0.995]',
      className
    )
    : cn(
      'bg-card border border-border rounded-xl relative overflow-hidden group shadow-sm',
      'transition-all duration-200',
      paddingClass,
      isInteractive && 'cursor-pointer hover:border-border-hover hover:shadow-md hover:bg-card-hover',
      isFocused && 'ring-1 ring-ring/20',
      isPressed && 'scale-[0.995]',
      className
    )

  const CardContent = () => (
    <div className="relative">
      {/* Content based on variant */}
      {variant === 'stats' && title && (
        <>
          <div className="flex items-center justify-between mb-2">
            {Icon && (
              <div className={`w-10 h-10 rounded-md ${colorConfig.iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${colorConfig.iconColor}`} />
              </div>
            )}
            {trend && (
              <div className={`flex items-center gap-1 ${getTrendColor(trend.direction)} text-xs font-normal tracking-tight`}>
                <TrendIcon className="w-3.5 h-3.5" />
                {trend.value}
              </div>
            )}
          </div>
          <h3 className="text-xl font-normal text-white mb-1 tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          <p className="text-xs text-[#a3a3a3]">{title}</p>
          {trend?.label && (
            <p className="text-xs text-[#737373] mt-1.5">{trend.label}</p>
          )}
        </>
      )}

      {variant === 'navigation' && title && description && (
        navigationVariant === 'default' ? (
          <>
            <div className="flex items-center justify-between mb-2">
              {Icon && (
                <div className={`w-8 h-8 rounded-md ${colorConfig.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${colorConfig.iconColor}`} />
                </div>
              )}
            </div>
            <h3 className={`text-sm font-normal tracking-tight text-white transition-colors duration-200 group-hover:text-primary mb-1.5 tracking-tight`}>
              {title}
            </h3>
            <p className="text-[#a3a3a3] text-xs leading-relaxed">
              {description}
            </p>
          </>
        ) : (
          <div className="flex items-center gap-2">
            {Icon && (
              <div className={`w-8 h-8 rounded-md ${colorConfig.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${colorConfig.iconColor}`} />
              </div>
            )}
            <div className="flex-1">
              <h3 className={`text-sm font-normal tracking-tight text-white transition-colors duration-200 group-hover:text-primary mb-1 tracking-tight`}>
                {title}
              </h3>
              <p className="text-[#a3a3a3] text-xs">
                {description}
              </p>
            </div>
          </div>
        )
      )}

      {variant === 'compact' && title && (
        <div className="flex items-center justify-between">
          {Icon && (
            <div className={`w-8 h-8 rounded-md ${colorConfig.iconBg} flex items-center justify-center flex-shrink-0 mr-2`}>
              <Icon className={`w-4 h-4 ${colorConfig.iconColor}`} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[#a3a3a3] text-xs mb-1">{title}</p>
            {value && (
              <p className="text-sm font-normal text-white tracking-tight">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            )}
            {trend && (
              <p className={`text-xs font-normal ${getTrendColor(trend.direction)} mt-1 tracking-tight`}>
                {trend.value}{trend.label && ` ${trend.label}`}
              </p>
            )}
          </div>
        </div>
      )}

      {variant === 'feature' && title && (
        <div className="text-center">
          {Icon && (
            <div className={`w-12 h-12 mx-auto mb-2 ${colorConfig.iconBg} rounded-md flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${colorConfig.iconColor}`} />
            </div>
          )}
          <h3 className="text-sm font-normal tracking-tight text-white mb-1.5 tracking-tight">{title}</h3>
          {description && (
            <p className="text-[#a3a3a3] text-xs">{description}</p>
          )}
        </div>
      )}

      {variant === 'nested' && children}

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
          {...interactionProps}
          {...motionProps}
        >
          <CardContent />
        </motion.a>
      )
    }

    return (
      <motion.div
        {...motionProps}
      >
        <Link
          to={href}
          className={baseClasses}
          onClick={onClick}
          {...interactionProps}
        >
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
      {...interactionProps}
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
