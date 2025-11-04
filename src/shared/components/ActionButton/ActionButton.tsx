import type { LucideIcon } from 'lucide-react'
import { Plus, ArrowRight, LogIn, UserPlus } from 'lucide-react'

import { Button } from '../Button'

interface ActionButtonProps {
  /** The text to display after the icon (e.g., "Customer", "Plan", "Product", "Sign In", "Next") */
  label: string
  /** Click handler function */
  onClick?: () => void
  /** Optional custom icon - defaults to Plus for create actions */
  icon?: LucideIcon
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'success'
  /** Button type for specific actions */
  actionType?: 'create' | 'auth' | 'navigation' | 'general'
  /** Whether button is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** Whether to show motion animations */
  animated?: boolean
  /** Loading state */
  loading?: boolean
  /** HTML button type attribute */
  type?: 'button' | 'submit' | 'reset'
}

const ActionButton = ({
  label,
  onClick,
  icon: Icon,
  size = 'md',
  variant = 'primary',
  actionType = 'create',
  disabled = false,
  className = '',
  animated: _animated = true,
  loading = false,
  type = 'button'
}: ActionButtonProps) => {
  // Set default icon based on action type if no icon provided
  const getDefaultIcon = () => {
    if (Icon) return Icon
    switch (actionType) {
      case 'create': return Plus
      case 'auth': return label.toLowerCase().includes('sign up') || label.toLowerCase().includes('register') ? UserPlus : LogIn
      case 'navigation': return ArrowRight
      default: return Plus
    }
  }

  const DefaultIcon = getDefaultIcon()

  // Map ActionButton variant to Button variant
  const mappedVariant = variant === 'success' ? 'primary' : variant

  return (
    <Button
      onClick={onClick}
      icon={DefaultIcon}
      iconPosition="right"
      size={size}
      variant={mappedVariant as 'primary' | 'secondary' | 'ghost'}
      loading={loading}
      disabled={disabled}
      className={className}
      type={type}
    >
      {label}
    </Button>
  )
}

export { ActionButton }
