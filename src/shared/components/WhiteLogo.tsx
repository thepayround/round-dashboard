import React from 'react'

import whiteLogo from '../../assets/logos/white-logo.svg'

interface WhiteLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const WhiteLogo: React.FC<WhiteLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  return (
    <img src={whiteLogo} alt="Round Platform" className={`${sizeClasses[size]} ${className}`} />
  )
}
