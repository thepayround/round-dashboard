import { motion } from 'framer-motion'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  accent?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  actions?: React.ReactNode
  className?: string
  animated?: boolean
  size?: 'main' | 'section'
}

const accentColors = {
  primary: 'accent',
  secondary: 'accent',
  accent: 'accent',
  success: 'accent',
  warning: 'warning',
  danger: 'destructive'
}

export const SectionHeader = ({
  title,
  subtitle,
  accent = 'primary',
  actions,
  className = '',
  animated = true,
  size = 'section'
}: SectionHeaderProps) => {
  const _accentGradient = accentColors[accent]

  const HeaderContent = () => (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className={`${size === 'main' ? 'text-2xl' : 'text-xl'} font-normal tracking-tight text-white ${size === 'main' ? 'mb-1.5' : 'mb-0'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`${size === 'main' ? 'text-base' : ''} text-gray-500 dark:text-polar-500 leading-snug mt-1.5`}>
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2.5">
            {actions}
          </div>
        )}
      </div>
    </div>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderContent />
      </motion.div>
    )
  }

  return <HeaderContent />
}
