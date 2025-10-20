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
  primary: 'from-[#D417C8] to-[#7767DA]',
  secondary: 'from-[#14BDEA] to-[#7767DA]',
  accent: 'from-[#7767DA] to-[#D417C8]',
  success: 'from-green-500 to-emerald-500',
  warning: 'from-yellow-500 to-orange-500',
  danger: 'from-red-500 to-pink-500'
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
          <h2 className={`${size === 'main' ? 'text-lg' : 'text-lg'} font-normal tracking-tight text-white ${size === 'main' ? 'mb-1.5' : 'mb-0'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`${size === 'main' ? 'text-sm' : 'text-sm'} text-gray-400 mt-1.5`}>
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
