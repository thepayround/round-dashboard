import { AlertCircle, X } from 'lucide-react'
import React from 'react'

import { Button, IconButton } from '@/shared/components/Button'

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
      <AlertCircle className="w-5 h-5 text-[#D417C8] mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-red-200 text-sm font-medium">Error</p>
        <p className="text-red-300 text-sm mt-1">{error}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="ghost"
            size="sm"
            className="mt-2 h-auto px-0 py-0 text-[#D417C8] hover:text-red-300 underline"
          >
            Try Again
          </Button>
        )}
      </div>
      {onClose && (
        <IconButton
          onClick={onClose}
          icon={X}
          variant="ghost"
          size="sm"
          aria-label="Close error"
          className="text-[#D417C8] hover:text-red-300"
        />
      )}
    </div>
  )
}