import React from 'react'

import colorLogo from '../../assets/logos/color-empty-logo-blur.svg'

interface ColorLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const ColorLogo: React.FC<ColorLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  return <img src={colorLogo} alt="Round" className={`${sizeClasses[size]} ${className}`} />
}
