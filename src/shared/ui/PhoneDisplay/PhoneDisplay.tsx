/**
 * PhoneDisplay Component - Pure Display Component
 * 
 * A simple phone display component that only handles display and copy functionality.
 * All formatting and API calls should be handled at a higher level.
 * 
 * @example
 * ```tsx
 * // Copy button only (most common use case)
 * <PhoneDisplay
 *   phoneNumber="+1234567890"
 *   copyButtonOnly
 *   showCopyButton
 *   showCountryFlag={false}
 * />
 * 
 * // Full display with country info
 * <PhoneDisplay
 *   phoneNumber="+1234567890"
 *   formattedPhoneNumber="+1 (234) 567-890"
 *   countryInfo={{
 *     countryCode: 'US',
 *     countryName: 'United States',
 *     phoneCode: '1',
 *     flag: '🇺🇸'
 *   }}
 * />
 * ```
 */

import { Check, Copy, Flag, Phone } from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/shared/ui/shadcn/button'
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
              <Flag className="h-4 w-4 text-white/60" />
            )}
            <span className="font-mono">
              {displayNumber}
            </span>
          </div>
        )

      case 'standard':
      default:
        return (
          <div className="flex items-center gap-4">
            {showCountryFlag && (
              <div className="flex items-center gap-1">
                {countryInfo?.flag ? (
                  <span className="text-lg">{countryInfo.flag}</span>
                ) : (
                  <Flag className="h-4 w-4 text-white/60" />
                )}
                {countryInfo?.countryName && (
                  <span className="text-sm text-white/60">
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
        : 'flex items-center justify-between rounded-lg border border-border bg-white/[0.04] px-3 py-2',
      className
    )}>
      {!copyButtonOnly && (
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Phone className="h-4 w-4 text-white/60 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            {renderContent()}
          </div>
        </div>
      )}

      {showCopyButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className={cn(
            copyButtonOnly
              ? 'p-1 h-auto w-auto'
              : 'ml-2 p-1 h-auto w-auto',
            isCopied
              ? 'text-secondary'
              : 'text-white/60 hover:text-white/90'
          )}
          title={isCopied ? 'Copied!' : 'Copy phone number'}
          aria-label="Copy phone number"
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      )}
    </div>
  )
}
