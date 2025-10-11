import React from 'react'
import { AlertCircle, X } from 'lucide-react'

interface CustomerErrorBoundaryProps {
  error?: string
  onRetry?: () => void
  onClose?: () => void
}

export const CustomerErrorDisplay: React.FC<CustomerErrorBoundaryProps> = ({
  error,
  onRetry,
  onClose
}) => {
  if (!error) return null

  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-red-200 text-sm font-medium">Error</p>
        <p className="text-red-300 text-sm mt-1">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-red-400 hover:text-red-300 text-sm font-medium mt-2 underline"
          >
            Try Again
          </button>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}