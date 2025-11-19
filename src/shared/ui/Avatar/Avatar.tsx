import { cn } from '@/shared/utils/cn'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarShape = 'circle' | 'rounded' | 'square'

export interface AvatarProps {
  name: string
  src?: string
  size?: AvatarSize
  shape?: AvatarShape
  className?: string
}

const sizeStyles = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-xs',
  lg: 'w-12 h-12 text-sm',
  xl: 'w-16 h-16 text-base',
}

const shapeStyles = {
  circle: 'rounded-full',
  rounded: 'rounded-xl',
  square: 'rounded-none',
}

function getInitials(name: string): string {
  if (!name) return ''
  return name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const Avatar = ({
  name,
  src,
  size = 'md',
  shape = 'rounded',
  className,
}: AvatarProps) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'object-cover',
          sizeStyles[size],
          shapeStyles[shape],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'bg-primary flex items-center justify-center text-white font-medium tracking-tight',
        sizeStyles[size],
        shapeStyles[shape],
        className
      )}
      aria-label={`Avatar for ${name}`}
    >
      {getInitials(name)}
    </div>
  )
}
