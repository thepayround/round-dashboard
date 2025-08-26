/**
 * PhoneDisplay Component - Pure Display Component
 * 
 * A simple phone display component that only handles display and copy functionality.
 * All formatting and API calls should be handled at a higher level.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Flag, Phone } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

// Display format variants
export type PhoneDisplayVariant = 'standard' | 'compact' | 'flag-only' | 'minimal'

export interface CountryInfo {
  countryCode: string
  countryName: string
  phoneCode: string
  flag: string
}

export interface PhoneDisplayProps {
  phoneNumber: string
  formattedPhoneNumber?: string
  countryInfo?: CountryInfo
  variant?: PhoneDisplayVariant
  className?: string
  showCopyButton?: boolean
  showCountryFlag?: boolean
  copyButtonOnly?: boolean
  onCopy?: (phoneNumber: string) => void
}

/**
 * Simple phone display component - no API calls, pure display
 */
export const PhoneDisplay: React.FC<PhoneDisplayProps> = ({
  phoneNumber,
  formattedPhoneNumber,
  countryInfo,
  variant = 'standard',
  className,
  showCopyButton = true,
  showCountryFlag = true,
  copyButtonOnly = false,
  onCopy
}) => {
  const [isCopied, setIsCopied] = useState(false)
  
  const displayNumber = formattedPhoneNumber ?? phoneNumber

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault() // Prevent form submission
    e.stopPropagation() // Stop event bubbling
    
    try {
      // Copy clean international format for universal compatibility
      const cleanNumber = phoneNumber.replace(/\D/g, '')
      const internationalFormat = cleanNumber.startsWith('1') ? `+${cleanNumber}` : `+${cleanNumber}`
      
      await navigator.clipboard.writeText(internationalFormat)
      setIsCopied(true)
      onCopy?.(internationalFormat)
      
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy phone number:', err)
    }
  }

  // Render variants
  const renderContent = () => {
    switch (variant) {
      case 'minimal':
        return (
          <span className="font-mono text-sm">
            {displayNumber}
          </span>
        )

      case 'compact':
        return (
          <div className="flex items-center gap-1">
            {showCountryFlag && countryInfo?.flag && (
              <span className="text-sm">{countryInfo.flag}</span>
            )}
            <span className="font-mono text-sm">
              {displayNumber}
            </span>
          </div>
        )

      case 'flag-only':
        return (
          <div className="flex items-center gap-2">
            {countryInfo?.flag ? (
              <span className="text-lg">{countryInfo.flag}</span>
            ) : (
              <Flag className="h-4 w-4 text-gray-400" />
            )}
            <span className="font-mono">
              {displayNumber}
            </span>
          </div>
        )

      case 'standard':
      default:
        return (
          <div className="flex items-center gap-3">
            {showCountryFlag && (
              <div className="flex items-center gap-1">
                {countryInfo?.flag ? (
                  <span className="text-lg">{countryInfo.flag}</span>
                ) : (
                  <Flag className="h-4 w-4 text-gray-400" />
                )}
                {countryInfo?.countryName && (
                  <span className="text-sm text-gray-600">
                    {countryInfo.countryName}
                  </span>
                )}
              </div>
            )}
            <span className="font-mono font-medium">
              {displayNumber}
            </span>
          </div>
        )
    }
  }

  return (
    <div className={cn(
      copyButtonOnly 
        ? 'inline-flex' 
        : 'flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2',
      className
    )}>
      {!copyButtonOnly && (
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            {renderContent()}
          </div>
        </div>
      )}

      {showCopyButton && (
        <motion.button
          type="button" // Prevent form submission
          onClick={handleCopy}
          className={cn(
            copyButtonOnly 
              ? 'p-1 transition-all duration-200 cursor-pointer'
              : 'ml-2 p-1 transition-all duration-200 cursor-pointer',
            isCopied
              ? 'text-emerald-400'
              : 'text-white/60 hover:text-white/90'
          )}
          whileHover={isCopied ? {} : { scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isCopied ? 'Copied!' : 'Copy phone number'}
          aria-label="Copy phone number"
        >
          <motion.div
            initial={false}
            animate={{ 
              scale: isCopied ? [1, 1.2, 1] : 1,
              rotate: isCopied ? [0, 15, 0] : 0
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </motion.div>
        </motion.button>
      )}
    </div>
  )
}
