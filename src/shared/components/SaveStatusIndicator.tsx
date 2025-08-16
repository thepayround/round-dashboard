import React from 'react'
import { Check, AlertCircle, Loader2, Save } from 'lucide-react'

// Simple className utility
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ')

interface SaveStatusIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error'
  className?: string
  showText?: boolean
}

export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({
  status,
  className,
  showText = true
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Loader2,
          text: 'Saving...',
          className: 'text-blue-400',
          iconClassName: 'animate-spin'
        }
      case 'saved':
        return {
          icon: Check,
          text: 'Saved',
          className: 'text-green-400',
          iconClassName: ''
        }
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Save failed',
          className: 'text-red-400',
          iconClassName: ''
        }
      default:
        return null
    }
  }

  const config = getStatusConfig()
  
  if (!config) return null

  const Icon = config.icon

  return (
    <div className={cn(
      'flex items-center space-x-1 text-sm transition-all duration-200',
      config.className,
      className
    )}>
      <Icon className={cn('w-4 h-4', config.iconClassName)} />
      {showText && <span>{config.text}</span>}
    </div>
  )
}

interface SaveButtonProps {
  onClick: () => void
  status: 'idle' | 'saving' | 'saved' | 'error'
  hasUnsavedChanges: boolean
  disabled?: boolean
  className?: string
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  status,
  hasUnsavedChanges,
  disabled,
  className
}) => {
  const isDisabled = (disabled ?? false) || status === 'saving' || !hasUnsavedChanges

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500',
        isDisabled
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white hover:from-pink-600 hover:to-cyan-600',
        className
      )}
    >
      {status === 'saving' ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Save className="w-4 h-4 mr-2" />
      )}
      {status === 'saving' ? 'Saving...' : 'Save Changes'}
    </button>
  )
}
